"use client";

import type { ReactNode } from "react";

/* ── Pixel-art decoration SVGs ── */

function PixelBook({ className }: { className?: string }) {
  return (
    <svg width="28" height="32" viewBox="0 0 14 16" style={{ imageRendering: "pixelated" }} className={className}>
      <title>Book</title>
      <rect x="3" y="1" width="9" height="14" fill="#8b2020" />
      <rect x="2" y="1" width="1" height="14" fill="#c9a86a" />
      <rect x="4" y="2" width="7" height="12" fill="#f5e9cf" />
      <rect x="5" y="4" width="5" height="1" fill="#2a1810" opacity="0.25" />
      <rect x="5" y="6" width="4" height="1" fill="#2a1810" opacity="0.25" />
      <rect x="5" y="8" width="5" height="1" fill="#2a1810" opacity="0.25" />
      <rect x="5" y="10" width="3" height="1" fill="#2a1810" opacity="0.25" />
    </svg>
  );
}

function PixelChest({ className }: { className?: string }) {
  return (
    <svg width="32" height="28" viewBox="0 0 16 14" style={{ imageRendering: "pixelated" }} className={className}>
      <title>Chest</title>
      <rect x="1" y="4" width="14" height="9" fill="#785023" />
      <rect x="1" y="4" width="14" height="4" fill="#996a33" />
      <rect x="7" y="6" width="2" height="3" fill="#cfcfcc" />
      <rect x="1" y="4" width="14" height="1" fill="#2c1a07" />
    </svg>
  );
}

function PixelScroll({ className }: { className?: string }) {
  return (
    <svg width="28" height="32" viewBox="0 0 14 16" style={{ imageRendering: "pixelated" }} className={className}>
      <title>Scroll</title>
      <rect x="3" y="0" width="8" height="2" fill="#d4b896" />
      <rect x="2" y="0" width="1" height="2" fill="#8b6914" />
      <rect x="11" y="0" width="1" height="2" fill="#8b6914" />
      <rect x="3" y="2" width="8" height="11" fill="#f5e9cf" />
      <rect x="4" y="4" width="6" height="1" fill="#2a1810" opacity="0.25" />
      <rect x="4" y="6" width="5" height="1" fill="#2a1810" opacity="0.25" />
      <rect x="4" y="8" width="6" height="1" fill="#2a1810" opacity="0.25" />
      <rect x="3" y="13" width="8" height="2" fill="#d4b896" />
      <rect x="2" y="13" width="1" height="2" fill="#8b6914" />
      <rect x="11" y="13" width="1" height="2" fill="#8b6914" />
    </svg>
  );
}

const DECORATIONS = {
  book: PixelBook,
  chest: PixelChest,
  scroll: PixelScroll,
} as const;

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  decoration?: keyof typeof DECORATIONS;
  action?: ReactNode;
};

export function PageHeader({ title, subtitle, decoration = "book", action }: PageHeaderProps) {
  const DecoIcon = DECORATIONS[decoration];

  return (
    <div className="mb-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="opacity-60">
            <DecoIcon />
          </div>
          <div>
            <h1 className="font-headline text-2xl font-bold tracking-wide" style={{ color: "#f5e9cf" }}>
              {title}
            </h1>
            {subtitle && (
              <p className="font-body text-sm mt-0.5" style={{ color: "rgba(201,168,106,0.5)" }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      {/* Ornament line */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, rgba(201,168,106,0.2), transparent)" }} />
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 0L8 4L12 6L8 8L6 12L4 8L0 6L4 4Z" fill="rgba(201,168,106,0.15)" />
        </svg>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, rgba(201,168,106,0.2), transparent)" }} />
      </div>
    </div>
  );
}
