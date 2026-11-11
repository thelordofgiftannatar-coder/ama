import { Capacitor } from '@capacitor/core';

// Base URL of the Diario server (server.ts) for AI + cloud sync.
// Set at build time with VITE_API_BASE, or at runtime: localStorage.setItem('diario_api_base', 'https://your-server')
export function apiUrl(path: string): string {
  let base = '';
  try {
    base = (localStorage.getItem('diario_api_base') || (import.meta as any).env?.VITE_API_BASE || '').replace(/\/+$/, '');
  } catch {
    base = ((import.meta as any).env?.VITE_API_BASE || '').replace(/\/+$/, '');
  }
  if (!base && Capacitor.isNativePlatform()) {
    throw new Error('AI and cloud sync need a server. Set API_BASE (your deployed server URL) when building the app.');
  }
  return base + path;
}
