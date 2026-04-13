import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image';

export const runtime = 'edge';
export const size = ogSize;
export const contentType = ogContentType;

export default function OgImage() {
  return generateOgImage({
    title: 'Sebaran Alumni YES',
    subtitle: 'Alumni YES tersebar di berbagai Perguruan Tinggi Negeri terbaik Indonesia.',
    badge: '🎓 Lihat Alumni',
  });
}
