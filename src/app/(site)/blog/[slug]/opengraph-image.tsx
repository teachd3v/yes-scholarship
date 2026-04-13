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

  const shortDesc = description.length > 100 ? description.slice(0, 100) + '...' : description;

  return new ImageResponse(
    <div
      style={{
        width: '100%', height: '100%',
        display: 'flex', background: '#0f172a',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Yellow top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: '#facc15', display: 'flex' }} />

      {/* Blue glow top-right */}
      <div style={{
        position: 'absolute', right: -120, top: -120,
        width: 500, height: 500, borderRadius: '50%',
        background: 'rgba(30,58,138,0.6)', display: 'flex',
      }} />

      {/* Blue glow bottom-left */}
      <div style={{
        position: 'absolute', left: -60, bottom: -80,
        width: 340, height: 340, borderRadius: '50%',
        background: 'rgba(30,58,138,0.35)', display: 'flex',
      }} />

      {/* Dot grid decoration */}
      <div style={{ position: 'absolute', right: 72, top: '50%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[0, 1, 2, 3, 4].map((row) => (
          <div key={row} style={{ display: 'flex', gap: 14 }}>
            {[0, 1, 2].map((col) => (
              <div key={col} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'rgba(250,204,21,0.25)', display: 'flex',
              }} />
            ))}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px 80px', width: '100%',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            background: '#facc15', color: '#0f172a',
            fontWeight: 900, fontSize: 22,
            padding: '6px 16px', borderRadius: 8, display: 'flex',
          }}>YES</div>
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', fontWeight: 600, display: 'flex' }}>
            Blog · Youth Ekselensia Scholarship
          </span>
        </div>

        {/* Post title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            fontSize: title.length > 50 ? 50 : 62,
            fontWeight: 900, color: '#ffffff',
            lineHeight: 1.1, display: 'flex', flexWrap: 'wrap',
          }}>
            {title}
          </div>
          <div style={{ width: 80, height: 4, background: '#facc15', borderRadius: 4, display: 'flex' }} />
          <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.6)', marginTop: 4, display: 'flex' }}>
            {shortDesc}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.4)', display: 'flex' }}>
            youthekselensia.id/blog
          </span>
          <div style={{
            background: '#facc15', color: '#0f172a',
            fontSize: 16, fontWeight: 800,
            padding: '10px 22px', borderRadius: 50, display: 'flex',
          }}>✍️ Baca Selengkapnya</div>
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
