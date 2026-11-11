// Runs after `npx cap add android`: adds notes-app permissions and installs the launcher icon.
import fs from 'fs';
import path from 'path';

const root = path.resolve('android/app/src/main');
const manifestPath = path.join(root, 'AndroidManifest.xml');
let xml = fs.readFileSync(manifestPath, 'utf8');

const perms = [
  'android.permission.INTERNET',
  'android.permission.ACCESS_NETWORK_STATE',
  'android.permission.RECORD_AUDIO',            // voice notes
  'android.permission.MODIFY_AUDIO_SETTINGS',
  'android.permission.CAMERA',                  // photo / video capture
  'android.permission.READ_MEDIA_IMAGES',       // attach photos (Android 13+)
  'android.permission.READ_MEDIA_VIDEO',        // attach videos (video studio)
  'android.permission.READ_MEDIA_AUDIO',        // attach audio
  'android.permission.READ_MEDIA_VISUAL_USER_SELECTED', // partial photo access (Android 14+)
  'android.permission.POST_NOTIFICATIONS',      // reminders (Android 13+)
  'android.permission.VIBRATE',
  'android.permission.WAKE_LOCK',
];
const legacy = [
  '<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />',
  '<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29" />',
];
const features = [
  '<uses-feature android:name="android.hardware.camera" android:required="false" />',
  '<uses-feature android:name="android.hardware.microphone" android:required="false" />',
];

let add = '';
for (const p of perms) if (!xml.includes(`"${p}"`)) add += `    <uses-permission android:name="${p}" />\n`;
for (const l of [...legacy, ...features]) if (!xml.includes(l.match(/android:name="([^"]+)"/)[1] + '"')) add += `    ${l}\n`;
xml = xml.replace('</manifest>', add + '</manifest>');
fs.writeFileSync(manifestPath, xml);

// Launcher icons
const iconsSrc = path.resolve('resources/icons');
for (const dir of fs.readdirSync(iconsSrc)) {
  const dest = path.join(root, 'res', dir);
  fs.mkdirSync(dest, { recursive: true });
  for (const f of fs.readdirSync(path.join(iconsSrc, dir))) {
    fs.copyFileSync(path.join(iconsSrc, dir, f), path.join(dest, f));
  }
}
const bgPath = path.join(root, 'res/values/ic_launcher_background.xml');
fs.mkdirSync(path.dirname(bgPath), { recursive: true });
fs.writeFileSync(bgPath, '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#120808</color>\n</resources>\n');
console.log('Android permissions + icons applied');
