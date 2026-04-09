'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export type AdminUser = {
  username: string;
  role: 'superadmin' | 'admin_wilayah';
  region?: string; // e.g. "Jawa Timur", "Jawa Tengah"
};

const ADMIN_MAPPING = [
  { username: 'admin_jabar', region: 'Jawa Barat' },
  { username: 'admin_jogja', region: 'DI Yogyakarta' },
  { username: 'admin_jatim', region: 'Jawa Timur' },
  { username: 'admin_sulsel', region: 'Sulawesi Selatan' },
  { username: 'admin_riau', region: 'Riau' },
  { username: 'admin_sumsel', region: 'Sumatera Selatan' },
  { username: 'admin_sumut', region: 'Sumatera Utara' },
  { username: 'admin_sumbar', region: 'Sumatera Barat' },
];

const USERS = [
  { username: 'superadmin', password: '1234', role: 'superadmin' as const },
  ...ADMIN_MAPPING.map(adm => ({
    username: adm.username,
    password: '1234',
    role: 'admin_wilayah' as const,
    region: adm.region
  }))
];

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Username dan password wajib diisi' }
  }

  const user = USERS.find(u => u.username === username && u.password === password);

  if (!user) {
    return { error: 'Username atau Password salah' }
  }

  // Create token by base64 encoding the user object (Without password)
  const payload: AdminUser = {
    username: user.username,
    role: user.role,
    region: 'region' in user ? user.region : undefined
  };
  
  const token = Buffer.from(JSON.stringify(payload)).toString('base64');

  const cookieStore = await cookies()
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  })

  return { success: true }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
  redirect('/admin/login')
}

export async function getAdminUser(): Promise<AdminUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return null;

    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        return JSON.parse(decoded) as AdminUser;
    } catch (e) {
        return null;
    }
}
