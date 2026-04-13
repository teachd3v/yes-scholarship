import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image';

export const runtime = 'edge';
export const size = ogSize;
export const contentType = ogContentType;

export default function OgImage() {
  return generateOgImage({
    title: 'Program Beasiswa',
    subtitle: 'Kenali jalur beasiswa YES yang dirancang untuk generasi muda Indonesia.',
    badge: '📚 Lihat Program',
  });
}
