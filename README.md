# Diario – AI Notes, Diary & Video Studio

Web app + Android APK (Capacitor). Notes, notebooks and settings are stored on the device and work offline.

## Get the APK from GitHub
1. Push this folder to a GitHub repo (branch `main`).
2. Open the **Actions** tab → **Build Android APK** → when it finishes, download the `diario-apk` artifact (`diario.apk`).
   Or push a tag (`git tag v1.0 && git push --tags`) to get `diario.apk` attached to a Release.
3. On your phone: open the APK → allow "Install unknown apps" → install. The icon is the artwork in `resources/`.

## AI + cloud sync (optional)
These need the server (`server.ts`) deployed somewhere (it holds `GEMINI_API_KEY`; keys never go in the APK).
Set the repo variable **API_BASE** (Settings → Secrets and variables → Actions → Variables) to that server's URL, then re-run the build.

## Run locally
`npm install` → set `GEMINI_API_KEY` in `.env.local` → `npm run dev`
