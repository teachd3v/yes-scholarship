import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image';

export const runtime = 'edge';
export const size = ogSize;
export const contentType = ogContentType;

export default function OgImage() {
  return generateOgImage({
    title: 'Daftar Sekarang!',
    subtitle: 'Jadilah bagian dari generasi ExcellentLeaders bersama YES Scholarship.',
    badge: '🚀 Seleksi YES Angkatan 5',
  });
}
