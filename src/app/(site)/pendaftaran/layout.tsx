import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.youthekselensia.id";

export const metadata: Metadata = {
  title: "Pendaftaran | Youth Ekselensia Scholarship",
  description: "Daftarkan dirimu sekarang dan jadilah bagian dari generasi ExcellentLeaders bersama YES Scholarship.",
  openGraph: {
    title: "Pendaftaran Beasiswa | YES Scholarship",
    description: "Daftarkan dirimu sekarang dan jadilah bagian dari generasi ExcellentLeaders bersama YES Scholarship.",
    url: `${baseUrl}/pendaftaran`,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function PendaftaranLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
