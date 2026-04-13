import { ImageResponse } from 'next/og';
import { safeFetch } from '@/sanity/client';
import { ogSize, ogContentType } from '@/lib/og-image';

export const runtime = 'edge';
export const size = ogSize;
export const contentType = ogContentType;

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let title = 'Blog YES Scholarship';
  let description = 'Baca artikel inspiratif dari tim YES Scholarship.';

  try {
    const post = await safeFetch<{ title: string; description?: string }>(
      `*[_type == "post" && slug.current == $slug][0]{ title, description }`,
      { slug }
    );
    if (post) {
      title = post.title;
      description = post.description ?? description;
    }
  } catch {
    // fallback ke default
  }

  return new ImageResponse(
    <div
      style={{
        width: '100%', height: '100%',
        display: 'flex', background: '#ffffff',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: '#ff6b00', display: 'flex' }} />
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 12, background: '#ff6b00', display: 'flex' }} />
      <div style={{
        position: 'absolute', right: -80, top: -80,
        width: 420, height: 420, borderRadius: '50%',
        background: 'rgba(255,107,0,0.07)', display: 'flex',
      }} />

      <div style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px 80px', width: '100%',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            background: '#ff6b00', color: 'white',
            fontWeight: 900, fontSize: 24,
            padding: '6px 16px', borderRadius: 8,
            display: 'flex',
          }}>YES</div>
          <span style={{ fontSize: 20, color: '#374151', fontWeight: 600, display: 'flex' }}>
            Blog · Youth Ekselensia Scholarship
          </span>
        </div>

        {/* Post title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            fontSize: title.length > 50 ? 52 : 64,
            fontWeight: 900, color: '#111827',
            lineHeight: 1.1, display: 'flex', flexWrap: 'wrap',
          }}>
            {title}
          </div>
          <div style={{ fontSize: 24, color: '#6b7280', display: 'flex' }}>
            {description.length > 100 ? description.slice(0, 100) + '...' : description}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, color: '#9ca3af', display: 'flex' }}>youthekselensia.id/blog</span>
          <div style={{
            background: '#fff7ed', color: '#ff6b00',
            fontSize: 18, fontWeight: 700,
            padding: '10px 24px', borderRadius: 50,
            border: '2px solid #ffedd5', display: 'flex',
          }}>✍️ Baca Selengkapnya</div>
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
