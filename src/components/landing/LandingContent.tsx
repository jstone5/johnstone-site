"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { site } from "@/content/site";

interface Post {
  title: string;
  url: string;
  publishedAt: string;
  excerpt: string;
}

interface LandingContentProps {
  posts: Post[];
}

type Section = "about" | "writing" | "connect" | null;

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="inline-block ml-1 opacity-40 group-hover:opacity-100 transition-opacity"
    >
      <path
        d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SubstackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
    </svg>
  );
}

// Tiny pixel-art character for the game CTA
function MiniCharacter() {
  return (
    <svg width="14" height="22" viewBox="0 0 14 22" className="pixel-render" aria-hidden="true">
      {/* Hair */}
      <rect x="3" y="0" width="8" height="3" fill="#8B5E3C" />
      {/* Head */}
      <rect x="3" y="3" width="8" height="4" fill="#FDBCB4" />
      {/* Eyes */}
      <rect x="5" y="4" width="2" height="2" fill="#1a1a2e" />
      <rect x="8" y="4" width="2" height="2" fill="#1a1a2e" />
      {/* Body */}
      <rect x="1" y="7" width="12" height="5" fill="#4ECDC4" />
      {/* Arms */}
      <rect x="0" y="8" width="2" height="3" fill="#4ECDC4" />
      <rect x="12" y="8" width="2" height="3" fill="#4ECDC4" />
      {/* Legs */}
      <rect x="3" y="12" width="4" height="5" fill="#2C3E50" />
      <rect x="7" y="12" width="4" height="5" fill="#34495E" />
      {/* Feet */}
      <rect x="2" y="17" width="4" height="2" fill="#8B5E3C" />
      <rect x="8" y="17" width="4" height="2" fill="#8B5E3C" />
    </svg>
  );
}

export function LandingContent({ posts }: LandingContentProps) {
  const [openSection, setOpenSection] = useState<Section>(null);
  const [email, setEmail] = useState("");
  const prefersReducedMotion = useReducedMotion();

  const toggleSection = (section: Section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const url = email
      ? `${site.links.substack}/subscribe?email=${encodeURIComponent(email)}`
      : `${site.links.substack}/subscribe`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1A1A1A]">
      {/* Header */}
      <header className="max-w-2xl mx-auto px-6 pt-8 pb-4">
        <nav className="flex items-center justify-between">
          <span className="text-sm font-medium tracking-wide text-[#1A1A1A]">
            {site.name}
          </span>
          <a
            href="/game"
            className="game-cta group inline-flex items-center gap-2 px-3 py-1.5 bg-[#0C1220] text-[#E6EDF3] rounded-sm font-[family-name:var(--font-pixelify-sans)] text-sm transition-all duration-200 hover:bg-[#162030] hover:shadow-[0_0_20px_rgba(78,205,196,0.4),0_0_40px_rgba(78,205,196,0.15)] hover:-translate-y-0.5"
            style={{
              clipPath: "polygon(0 3px, 3px 3px, 3px 0, calc(100% - 3px) 0, calc(100% - 3px) 3px, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 3px calc(100% - 3px), 0 calc(100% - 3px))",
            }}
          >
            <MiniCharacter />
            <span>Play the game</span>
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 pt-10 pb-8">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-start"
        >
          <div className="mb-6 w-[100px] h-[100px] rounded-full overflow-hidden">
            <Image
              src="/JohnStone_Headshot_2025_square.png"
              alt="John Stone"
              width={100}
              height={100}
              className="w-full h-full object-cover object-[center_20%]"
              priority
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1A1A1A] mb-2">
            {site.name}
          </h1>
          <p className="text-lg text-[#6B7280]">
            Builder. Writer. Product Leader.
          </p>
        </motion.div>
      </section>

      {/* Accordion Sections */}
      <section className="max-w-2xl mx-auto px-6 pb-8">
        <div className="border-t border-[#E5E5E3]">
          {/* About */}
          <AccordionItem
            title="About"
            isOpen={openSection === "about"}
            onToggle={() => toggleSection("about")}
            prefersReducedMotion={!!prefersReducedMotion}
          >
            <div className="space-y-4 text-[#4B5563] leading-relaxed">
              <p>
                I love building products users love. As an experienced product leader,
                I&apos;ve delivered $XXM impact across B2B and B2C contexts and in highly
                regulated spaces like Payments. In my role at Intuit, I empower small
                businesses by helping them bill and get paid by their customers.
              </p>
              <p>
                As a writer, I pen essays about product, AI, and peering into the future.
                Much like an artist builds a portfolio of works, I write to build a portfolio
                of my thinking.
              </p>
            </div>
          </AccordionItem>

          {/* Writing */}
          <AccordionItem
            title="Writing"
            isOpen={openSection === "writing"}
            onToggle={() => toggleSection("writing")}
            prefersReducedMotion={!!prefersReducedMotion}
          >
            <div className="space-y-1">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <a
                    key={post.url}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-baseline justify-between py-2.5 hover:bg-[#F3F3F1] -mx-2 px-2 rounded transition-colors duration-150"
                  >
                    <span className="text-[#1A1A1A] group-hover:text-[#111]">
                      {post.title}
                      <ArrowUpRight />
                    </span>
                    <span className="text-xs text-[#9CA3AF] ml-4 shrink-0">
                      {formatDate(post.publishedAt)}
                    </span>
                  </a>
                ))
              ) : (
                <p className="text-[#6B7280] py-2">
                  New writing lands on{" "}
                  <a
                    href={site.links.substack}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                  >
                    Substack
                  </a>{" "}
                  first.
                </p>
              )}
              <div className="pt-3">
                <a
                  href={site.links.substack}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#6B7280] hover:text-[#1A1A1A] underline underline-offset-2 transition-colors duration-200"
                >
                  All posts on Substack
                </a>
              </div>
            </div>
          </AccordionItem>

          {/* Connect */}
          <AccordionItem
            title="Connect"
            isOpen={openSection === "connect"}
            onToggle={() => toggleSection("connect")}
            prefersReducedMotion={!!prefersReducedMotion}
          >
            <div className="flex items-center gap-6">
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6B7280] hover:text-[#1A1A1A] transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a
                href={site.links.x}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6B7280] hover:text-[#1A1A1A] transition-colors duration-200"
                aria-label="X (Twitter)"
              >
                <XIcon />
              </a>
              <a
                href={site.links.substack}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6B7280] hover:text-[#1A1A1A] transition-colors duration-200"
                aria-label="Substack"
              >
                <SubstackIcon />
              </a>
            </div>
          </AccordionItem>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="max-w-2xl mx-auto px-6 pb-12">
        <h2 className="text-sm font-medium tracking-wide uppercase text-[#1A1A1A] mb-2">
          Newsletter
        </h2>
        <p className="text-[#6B7280] text-sm mb-4">
          Essays about product, AI, and peering into the future.
        </p>
        <form onSubmit={handleSubscribe} className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 px-4 py-2.5 bg-white border border-[#E5E5E3] rounded-sm text-sm text-[#1A1A1A] placeholder:text-[#C4C4C2] focus:outline-none focus:border-[#1A1A1A] transition-colors"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#1A1A1A] text-white text-sm font-medium rounded-sm hover:bg-[#333] transition-colors duration-200"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}

function AccordionItem({
  title,
  isOpen,
  onToggle,
  prefersReducedMotion,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  prefersReducedMotion: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#E5E5E3]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-sm font-medium tracking-wide uppercase text-[#1A1A1A]">
          {title}
        </span>
        <span className="text-[#9CA3AF] group-hover:text-[#1A1A1A] transition-colors duration-200">
          <ChevronIcon open={isOpen} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key={title}
            initial={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="pb-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
