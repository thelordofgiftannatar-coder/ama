import React from 'react';
import { WallpaperConfig } from '../types';

interface BackgroundWallpaperProps {
  wallpaper: WallpaperConfig;
  theme: string;
}

export const BackgroundWallpaper: React.FC<BackgroundWallpaperProps> = ({ wallpaper, theme }) => {
  // If AMOLED and no wallpaper, show true pitch black #000000
  if (!wallpaper.url || wallpaper.type === 'none') {
    const bgColor =
      theme === 'amoled'
        ? '#000000'
        : theme === 'charcoal'
        ? '#121316'
        : theme === 'onenote-purple'
        ? '#130f1c'
        : theme === 'light'
        ? '#f8fafc'
        : '#0d0e12';
    return (
      <div
        className="fixed inset-0 pointer-events-none -z-20 transition-colors duration-500"
        style={{ backgroundColor: bgColor }}
      />
    );
  }

  const dimOpacity = (wallpaper.dim ?? 40) / 100;
  const blurPx = wallpaper.blur ?? 0;

  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
      {/* Background Image / GIF */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: `url('${wallpaper.url}')`,
          filter: blurPx > 0 ? `blur(${blurPx}px)` : 'none',
          transform: blurPx > 0 ? 'scale(1.08)' : 'scale(1.0)',
        }}
      />

      {/* Dimming and Tint Overlay to guarantee reading contrast */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundColor:
            theme === 'onenote-purple'
              ? 'rgba(19, 15, 28, 0.85)'
              : theme === 'amoled'
              ? 'rgba(0, 0, 0, 0.82)'
              : 'rgba(11, 12, 16, 0.80)',
          opacity: Math.max(dimOpacity, 0.45),
        }}
      />

      {/* Subtle vignette gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
    </div>
  );
};
