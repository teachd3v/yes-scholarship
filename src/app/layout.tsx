import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Youth Ekselensia Scholarship",
  description: "Youth Ekselensia Scholarship Landing Page",
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
      </body>
    </html>
  );
}
