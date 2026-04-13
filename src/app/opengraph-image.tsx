import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image';

export const runtime = 'edge';
export const size = ogSize;
export const contentType = ogContentType;

export default function OgImage() {
  return generateOgImage({
    title: 'Beasiswa untuk ExcellentLeaders',
    subtitle: 'Mewujudkan mimpi anak bangsa melalui pendidikan berkualitas.',
    badge: 'Seleksi YES Angkatan 5 🎓',
  });
}
