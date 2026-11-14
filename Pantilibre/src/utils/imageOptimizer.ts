/**
 * Utility to optimize images and support Data Saver Mode (Modo Ahorro)
 * In Data Saver mode, high-resolution media URLs (e.g. Unsplash 800-1200px @ 80% quality)
 * are substituted with compressed, low-bandwidth thumbnail versions (300-400px @ 35-40% quality)
 * to speed up loading on slow connections and save data.
 */

export type ImagePreset = 'avatar' | 'card' | 'feed' | 'cover' | 'thumbnail';

export const getOptimizedImageUrl = (
  url: string | undefined | null,
  isDataSaver: boolean = false,
  preset: ImagePreset = 'feed'
): string => {
  if (!url) return '';
  if (!isDataSaver) return url;

  // Unsplash image URL processing
  if (url.includes('images.unsplash.com')) {
    const [baseUrl] = url.split('?');
    let width = 360;
    let quality = 35;

    switch (preset) {
      case 'avatar':
        width = 96;
        quality = 40;
        break;
      case 'thumbnail':
        width = 180;
        quality = 35;
        break;
      case 'card':
        width = 280;
        quality = 35;
        break;
      case 'cover':
        width = 460;
        quality = 40;
        break;
      case 'feed':
      default:
        width = 380;
        quality = 35;
        break;
    }

    return `${baseUrl}?auto=format&fit=crop&w=${width}&q=${quality}&blur=0`;
  }

  return url;
};
