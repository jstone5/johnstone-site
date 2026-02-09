import { Providers } from "@/components/Providers";
import { Nav } from "@/components/Nav";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AmbientBackground } from "@/components/pixel-art";

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="game-theme scanlines noise">
      <Providers>
        <AmbientBackground variant="magical" density="medium" />
        <Nav />
        <main className="relative z-10">{children}</main>
        <ScrollToTop />
      </Providers>
    </div>
  );
}
