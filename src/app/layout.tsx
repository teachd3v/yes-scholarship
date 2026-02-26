import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Youth Ekselensia Scholarship",
  description: "Mewujudkan mimpi anak bangsa melalui pendidikan yang berkualitas dan berkelanjutan.",
  icons: {
    icon: "/images/logo-yes.png",
    shortcut: "/images/logo-yes.png",
    apple: "/images/logo-yes.png",
  },
  openGraph: {
    title: "Youth Ekselensia Scholarship",
    description: "Mewujudkan mimpi anak bangsa melalui pendidikan yang berkualitas dan berkelanjutan.",
    url: "https://www.youthekselensia.id",
    siteName: "Youth Ekselensia Scholarship",
    images: [
      {
        url: "/images/logo-yes.png",
        width: 800,
        height: 600,
        alt: "Youth Ekselensia Scholarship",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} font-sans antialiased selection:bg-yellow-400 selection:text-blue-900`}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
