import { getAdminUser } from '@/app/admin/auth-actions';
import { ACEH_KABUPATENS } from '@/lib/aceh';
import { redirect } from 'next/navigation';
import React from 'react';

/**
 * Page that displays the allowed kabupaten for an Aceh admin.
 * It runs on the server ("use server") and redirects non‑Aceh admins.
 */
export default async function AcehKabupatenPage() {
  const admin = await getAdminUser();

  // If not logged in or not an Aceh admin, send them to the admin login page.
  if (!admin || admin.region !== 'Aceh') {
    redirect('/admin/login');
  }

  // Render the list of permitted kabupaten.
  return (
    <section style={styles.container}>
      <h1 style={styles.title}>Kabupaten yang Diperbolehkan</h1>
      <ul style={styles.list}>
        {ACEH_KABUPATENS.map(kab => (
          <li key={kab} style={styles.item}>
            {kab}
          </li>
        ))}
      </ul>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
  },
  title: {
    fontFamily: `'Inter', sans-serif`,
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: '#ffffff',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  },
  item: {
    background: 'rgba(255,255,255,0.12)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    color: '#e0e0e0',
    fontFamily: `'Inter', sans-serif`,
    fontSize: '1.1rem',
    transition: 'transform 0.2s, background 0.2s',
  },
};
