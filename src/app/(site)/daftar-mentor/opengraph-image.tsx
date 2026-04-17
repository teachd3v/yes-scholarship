import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image';

export const runtime = 'edge';
export const size = ogSize;
export const contentType = ogContentType;

export default function OgImage() {
  return generateOgImage({
    title: 'Daftar Jadi Mentor YES!',
    subtitle: 'Bergabunglah dan bentuk pemimpin masa depan Indonesia bersama YES 2026.',
    badge: '🌟 Pendaftaran Mentor Dibuka',
  });
}
