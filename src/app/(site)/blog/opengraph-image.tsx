import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image';

export const runtime = 'edge';
export const size = ogSize;
export const contentType = ogContentType;

export default function OgImage() {
  return generateOgImage({
    title: 'Blog YES Scholarship',
    subtitle: 'Kisah inspiratif, tips beasiswa, dan kabar terbaru dari tim YES.',
    badge: '✍️ Baca Artikel',
  });
}
