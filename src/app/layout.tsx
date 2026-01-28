import type { Metadata } from "next";
import { Space_Grotesk, Pixelify_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { site } from "@/content/site";
import { Providers } from "@/components/Providers";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ParticleField } from "@/components/ParticleField";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${pixelifySans.variable} antialiased scanlines noise`}
      >
        <Providers>
          <ParticleField />
          <Nav />
          <main className="relative z-10">{children}</main>
          <Footer />
          <ScrollToTop />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
