import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { Plus_Jakarta_Sans } from "next/font/google";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.youthekselensia.id";

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
    url: baseUrl,
    siteName: "Youth Ekselensia Scholarship",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
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
        <FloatingWhatsApp />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
