import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "LinkedIn", href: site.links.linkedin },
    { label: "Substack", href: site.links.substack },
    { label: "X", href: site.links.x },
  ].filter((link) => link.href);

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--panel)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted)]">
            &copy; {currentYear} {site.name}
          </p>

          <div className="flex items-center gap-4">
            {footerLinks.map((link, index) => (
              <span key={link.label} className="flex items-center gap-4">
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                >
                  {link.label}
                </Link>
                {index < footerLinks.length - 1 && (
                  <span className="text-[var(--muted)]">&middot;</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
