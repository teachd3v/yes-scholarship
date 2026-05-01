import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image';

export const runtime = 'edge';
export const size = ogSize;
export const contentType = ogContentType;

export default function OgImage() {
  return generateOgImage({
    title: 'Pengumuman Seleksi Administrasi',
    subtitle: 'Cek status kelulusanmu dan persiapkan diri untuk tahapan selanjutnya.',
    badge: '📢 Seleksi YES Angkatan 5',
  });
}
