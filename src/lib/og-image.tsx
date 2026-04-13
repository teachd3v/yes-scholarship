import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

// Brand colors
// Primary: #1e3a8a (blue-900)
// Accent:  #facc15 (yellow-400)
// Dark:    #0f172a (slate-900)

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
        background: '#0f172a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Yellow accent top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: '#facc15', display: 'flex' }} />

      {/* Blue glow circle top-right */}
      <div style={{
        position: 'absolute', right: -120, top: -120,
        width: 500, height: 500, borderRadius: '50%',
        background: 'rgba(30,58,138,0.6)', display: 'flex',
      }} />

      {/* Subtle blue glow bottom-left */}
      <div style={{
        position: 'absolute', left: -60, bottom: -80,
        width: 340, height: 340, borderRadius: '50%',
        background: 'rgba(30,58,138,0.35)', display: 'flex',
      }} />

      {/* Yellow dot grid decoration (right side) */}
      <div style={{
        position: 'absolute', right: 72, top: '50%',
        display: 'flex', flexDirection: 'column', gap: 14,
        transform: 'translateY(-50%)',
      }}>
        {[0, 1, 2, 3, 4].map((row) => (
          <div key={row} style={{ display: 'flex', gap: 14 }}>
            {[0, 1, 2].map((col) => (
              <div key={col} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'rgba(250,204,21,0.25)',
                display: 'flex',
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
            fontWeight: 900, fontSize: 26,
            padding: '7px 18px', borderRadius: 8,
            display: 'flex', letterSpacing: '-0.5px',
          }}>YES</div>
          <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', fontWeight: 600, display: 'flex' }}>
            Youth Ekselensia Scholarship
          </span>
        </div>

        {/* Main text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            fontSize: title.length > 40 ? 56 : 68,
            fontWeight: 900, color: '#ffffff',
            lineHeight: 1.1, display: 'flex', flexWrap: 'wrap',
          }}>
            {title}
          </div>
          {/* Yellow underline accent */}
          <div style={{ width: 80, height: 4, background: '#facc15', borderRadius: 4, display: 'flex' }} />
          <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.6)', marginTop: 4, display: 'flex' }}>
            {subtitle}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.4)', display: 'flex' }}>
            youthekselensia.id
          </span>
          {badge && (
            <div style={{
              background: '#facc15', color: '#0f172a',
              fontSize: 17, fontWeight: 800,
              padding: '10px 22px', borderRadius: 50,
              display: 'flex',
            }}>{badge}</div>
          )}
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
