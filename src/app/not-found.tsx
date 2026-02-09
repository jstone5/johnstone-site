import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
      <div className="text-center px-4">
        <h1 className="text-5xl font-semibold text-[#1A1A1A] mb-3">
          404
        </h1>
        <p className="text-[#6B7280] text-lg mb-8">
          This page doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="text-sm text-[#6B7280] hover:text-[#1A1A1A] underline underline-offset-2 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
