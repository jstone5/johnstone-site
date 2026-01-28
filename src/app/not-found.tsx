import { PixelButton } from "@/components/PixelButton";

export default function NotFound() {
  return (
    <div className="min-h-screen pt-14 flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="font-[family-name:var(--font-pixelify-sans)] text-4xl sm:text-5xl text-[var(--accent)] mb-4">
          404: Empty room
        </h1>
        <p className="text-[var(--muted)] text-lg mb-8">
          You found a door that doesn&apos;t go anywhere.
        </p>
        <PixelButton href="/" variant="primary">
          Return home
        </PixelButton>
      </div>
    </div>
  );
}
