import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// CORS so the Android app (origin https://localhost) can reach this server
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// In-memory cross-device cloud sync store (keyed by sync code or user email)
const cloudStore: Record<string, { data: any; updatedAt: number }> = {};

// Helper: initialize Gemini SDK
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Image Generation Endpoint
app.post('/api/gemini/generate-image', async (req, res) => {
  try {
    const { prompt, resolution = '1K', aspectRatio = '1:1', style = 'Cinematic' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback response with artistic placeholder if API key not available yet
      return res.json({
        success: true,
        fallback: true,
        imageUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80`,
        message: 'No GEMINI_API_KEY detected. Using sample high-res artwork. Add your key in Secrets panel for live 4K generation.',
      });
    }

    const enhancedPrompt = `${prompt}, ${style} style, ultra high definition, masterpiece, highly detailed, vivid lighting`;

    // Attempt generation with gemini-nano-banana-2.1 (supports 1K, 2K, 4K)
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-nano-banana-2.1',
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: (['1:1', '3:4', '4:3', '9:16', '16:9'].includes(aspectRatio) ? aspectRatio : '1:1') as any,
            imageSize: (['1K', '2K', '4K'].includes(resolution) ? resolution : '1K') as any,
          },
        },
      });

      let foundImageUrl: string | null = null;
      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType ?? 'image/png';
          foundImageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (foundImageUrl) {
        return res.json({ success: true, imageUrl: foundImageUrl });
      }
    } catch (primaryErr: any) {
      console.warn('Primary model error, attempting gemini-3.1-flash-lite-image:', primaryErr?.message);
    }

    // Secondary attempt with gemini-3.1-flash-lite-image
    try {
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: (['1:1', '3:4', '4:3', '9:16', '16:9'].includes(aspectRatio) ? aspectRatio : '1:1') as any,
          },
        },
      });

      let fallbackImageUrl: string | null = null;
      for (const part of fallbackResponse.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType ?? 'image/png';
          fallbackImageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (fallbackImageUrl) {
        return res.json({ success: true, imageUrl: fallbackImageUrl });
      }
    } catch (secondaryErr: any) {
      console.error('Secondary image generation failed:', secondaryErr?.message);
      return res.status(500).json({
        error: secondaryErr?.message || 'Image generation failed',
        hint: 'Please check your API key in Settings > Secrets.',
      });
    }

    return res.status(500).json({ error: 'No image data returned from model' });
  } catch (error: any) {
    console.error('Image generation route error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// AI Writing / Diario Assistant
app.post('/api/gemini/assist', async (req, res) => {
  try {
    const { action, text, context } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        result: `[Offline/Demo mode] Note refined: ${text ? text.slice(0, 100) : 'New entry created.'}`,
      });
    }

    let prompt = '';
    if (action === 'refine') {
      prompt = `Polish and improve this diary note, preserving emotional honesty and fixing clarity:\n\n${text}`;
    } else if (action === 'summarize') {
      prompt = `Provide a concise 1-sentence title and 3 bullet highlights for this entry:\n\n${text}`;
    } else if (action === 'expand') {
      prompt = `Expand on this journal reflection with thoughtful prompt questions and mindful perspective:\n\n${text}`;
    } else if (action === 'tags') {
      prompt = `Extract 3 to 5 relevant short hashtags or labels (comma separated, no hash symbol) for this note:\n\n${text}`;
    } else {
      prompt = `Reflect on this diary note: ${text}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an intuitive, private, and empathetic personal diary assistant.',
      },
    });

    res.json({ result: response.text ?? '' });
  } catch (error: any) {
    console.error('AI assistant error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cross-Platform Cloud Backup & Sync endpoints
app.post('/api/sync/backup', (req, res) => {
  try {
    const { syncKey = 'default_user', data } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'Missing sync data' });
    }
    cloudStore[syncKey] = {
      data,
      updatedAt: Date.now(),
    };
    res.json({
      success: true,
      syncKey,
      updatedAt: cloudStore[syncKey].updatedAt,
      message: 'Cloud backup updated successfully across devices.',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/sync/restore/:syncKey', (req, res) => {
  const { syncKey } = req.params;
  const record = cloudStore[syncKey];
  if (!record) {
    return res.status(404).json({ error: 'No cloud backup found for this sync key' });
  }
  res.json({ success: true, data: record.data, updatedAt: record.updatedAt });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Diario',
    time: new Date().toISOString(),
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Diario Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
