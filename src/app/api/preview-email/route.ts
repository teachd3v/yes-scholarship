import { NextRequest, NextResponse } from 'next/server';
import { getAnnouncementLolosHtml, getAnnouncementGagalHtml } from '@/lib/mail';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'lolos';
  const name = searchParams.get('name') || 'Ahmad Fulan';
  const school = searchParams.get('school') || 'SMAN 1 Jakarta';
  const reason = searchParams.get('reason') || 'Dokumen kartu keluarga tidak terbaca dengan jelas.';

  const html = type === 'lolos' 
    ? getAnnouncementLolosHtml(name, school) 
    : getAnnouncementGagalHtml(name, reason, school);

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
