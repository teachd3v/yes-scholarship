import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

export function generateOgImage({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle: string;
  badge?: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Orange accent top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: '#ff6b00', display: 'flex' }} />

      {/* Left decorative bar */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 12, background: '#ff6b00', display: 'flex' }} />

      {/* Background circle decorations */}
      <div style={{
        position: 'absolute', right: -80, top: -80,
        width: 420, height: 420, borderRadius: '50%',
        background: 'rgba(255,107,0,0.07)', display: 'flex',
      }} />
      <div style={{
        position: 'absolute', right: 60, bottom: -100,
        width: 300, height: 300, borderRadius: '50%',
        background: 'rgba(255,107,0,0.05)', display: 'flex',
      }} />

      {/* Content */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px 80px', width: '100%',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            background: '#ff6b00', color: 'white',
            fontWeight: 900, fontSize: 28,
            padding: '8px 18px', borderRadius: 10,
            display: 'flex',
          }}>YES</div>
          <span style={{ fontSize: 22, color: '#374151', fontWeight: 600, display: 'flex' }}>
            Youth Ekselensia Scholarship
          </span>
        </div>

        {/* Main text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 68, fontWeight: 900, color: '#111827', lineHeight: 1.1, display: 'flex', flexWrap: 'wrap' }}>
            {title}
          </div>
          <div style={{ fontSize: 26, color: '#6b7280', display: 'flex' }}>
            {subtitle}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, color: '#9ca3af', display: 'flex' }}>youthekselensia.id</span>
          {badge && (
            <div style={{
              background: '#fff7ed', color: '#ff6b00',
              fontSize: 18, fontWeight: 700,
              padding: '10px 24px', borderRadius: 50,
              border: '2px solid #ffedd5',
              display: 'flex',
            }}>{badge}</div>
          )}
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
