"use client";

import Link from "next/link";
import { site } from "@/content/site";
import { SoundToggle } from "./SoundToggle";

const navItems = [
  { label: "About", href: "/#about" },
  { label: "Writing", href: "/writing" },
  { label: "Subscribe", href: "/#subscribe" },
];

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)]/80 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/"
            className="font-[family-name:var(--font-pixelify-sans)] text-lg text-[var(--text)] hover:text-[var(--accent)] transition-colors"
          >
            {site.name}
          </Link>

          <div className="hidden sm:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <SoundToggle />
          </div>

          {/* Mobile: sound toggle and writing link */}
          <div className="sm:hidden flex items-center gap-4">
            <SoundToggle />
            <Link
              href="/writing"
              className="text-sm text-[var(--accent)] hover:text-[var(--accent2)] transition-colors"
            >
              Writing
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
