import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

async function toBase64(source: Blob | string): Promise<string> {
  const blob = typeof source === 'string' ? await (await fetch(source)).blob() : source;
  return await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1] || '');
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

// Saves/exports a file. In the browser: normal download. In the Android app: write the
// file and open the share sheet (Save to Files / Drive / send to another app).
export async function saveFile(filename: string, source: Blob | string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    const data = await toBase64(source);
    const written = await Filesystem.writeFile({ path: filename, data, directory: Directory.Cache });
    await Share.share({ title: filename, url: written.uri, dialogTitle: 'Save or share' });
    return;
  }
  const url = typeof source === 'string' ? source : URL.createObjectURL(source);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  if (typeof source !== 'string') setTimeout(() => URL.revokeObjectURL(url), 1000);
}
