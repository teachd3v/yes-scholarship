'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export type AdminUser = {
  username: string;
  role: 'superadmin' | 'admin_wilayah';
  region?: string; // e.g. "Jawa Timur", "Jawa Tengah"
};

// Hardcoded users list to support different regions based on user request.
const PROVINCES = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Jambi", "Sumatera Selatan", "Bengkulu", "Lampung", "Kepulauan Bangka Belitung", "Kepulauan Riau", "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", "Banten", "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara", "Sulawesi Utara", "Sulawesi Tengah", "Sulawesi Selatan", "Sulawesi Tenggara", "Gorontalo", "Sulawesi Barat", "Maluku", "Maluku Utara", "Papua Barat", "Papua", "Papua Selatan", "Papua Tengah", "Papua Pegunungan", "Papua Barat Daya"
];

const USERS = [
  { username: 'superadmin', password: '1234', role: 'superadmin' as const },
  ...PROVINCES.map(province => ({
    username: `admin_${province.toLowerCase().replace(/\s+/g, '_')}`,
    password: '1234',
    role: 'admin_wilayah' as const,
    region: province
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
