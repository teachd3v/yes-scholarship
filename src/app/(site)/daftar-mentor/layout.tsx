import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.youthekselensia.id";

export const metadata: Metadata = {
  title: "Daftar Mentor | Youth Ekselensia Scholarship",
  description: "Bergabunglah sebagai Mentor YES 2026 dan jadilah bagian dari pembentuk pemimpin masa depan Indonesia bersama Youth Ekselensia Scholarship.",
  openGraph: {
    title: "Daftar Jadi Mentor YES 2026 | Youth Ekselensia Scholarship",
    description: "Bergabunglah sebagai Mentor YES 2026 dan jadilah bagian dari pembentuk pemimpin masa depan Indonesia bersama Youth Ekselensia Scholarship.",
    url: `${baseUrl}/daftar-mentor`,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function DaftarMentorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
