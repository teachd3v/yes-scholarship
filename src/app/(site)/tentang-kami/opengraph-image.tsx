import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image';

export const runtime = 'edge';
export const size = ogSize;
export const contentType = ogContentType;

export default function OgImage() {
  return generateOgImage({
    title: 'Tentang Kami',
    subtitle: 'Mengenal visi, misi, dan tim di balik gerakan beasiswa YES untuk Indonesia.',
    badge: '🙌 Kenali Kami',
  });
}
