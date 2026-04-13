import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image';

export const runtime = 'edge';
export const size = ogSize;
export const contentType = ogContentType;

export default function OgImage() {
  return generateOgImage({
    title: 'Twibbon Campaign',
    subtitle: 'Buat dan bagikan twibbon resmi Seleksi YES Angkatan 5. Tunjukkan semangatmu!',
    badge: '📸 Buat Twibbon',
  });
}
