"use client";

import type { ReactNode } from "react";

/* ── Pixel-art decoration SVGs ── */

function PixelBook({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="28"
      viewBox="0 0 12 14"
      style={{ imageRendering: "pixelated" }}
      className={className}
    >
      <title>Book</title>
      {/* Cover */}
      <rect x="2" y="1" width="8" height="12" fill="#8b2020" />
      <rect x="1" y="1" width="1" height="12" fill="#c9a86a" />
      {/* Pages */}
      <rect x="3" y="2" width="6" height="10" fill="#f5e9cf" />
      {/* Text lines */}
      <rect x="4" y="3" width="4" height="1" fill="#2a1810" opacity="0.3" />
      <rect x="4" y="5" width="3" height="1" fill="#2a1810" opacity="0.3" />
      <rect x="4" y="7" width="4" height="1" fill="#2a1810" opacity="0.3" />
      <rect x="4" y="9" width="2" height="1" fill="#2a1810" opacity="0.3" />
    </svg>
  );
}

function PixelChest({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="24"
      viewBox="0 0 14 12"
      style={{ imageRendering: "pixelated" }}
      className={className}
    >
      <title>Chest</title>
      {/* Body */}
      <rect x="1" y="3" width="12" height="8" fill="#785023" />
      <rect x="1" y="3" width="12" height="3" fill="#996a33" />
      {/* Lock */}
      <rect x="6" y="5" width="2" height="3" fill="#cfcfcc" />
      {/* Lid line */}
      <rect x="1" y="3" width="12" height="1" fill="#2c1a07" />
      {/* Feet */}
      <rect x="2" y="11" width="2" height="1" fill="#4a2d1a" />
      <rect x="10" y="11" width="2" height="1" fill="#4a2d1a" />
    </svg>
  );
}

function PixelScroll({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="28"
      viewBox="0 0 12 14"
      style={{ imageRendering: "pixelated" }}
      className={className}
    >
      <title>Scroll</title>
      {/* Top roll */}
      <rect x="2" y="0" width="8" height="2" fill="#d4b896" />
      <rect x="1" y="0" width="1" height="2" fill="#8b6914" />
      <rect x="10" y="0" width="1" height="2" fill="#8b6914" />
      {/* Paper body */}
      <rect x="2" y="2" width="8" height="9" fill="#f5e9cf" />
      {/* Text lines */}
      <rect x="3" y="3" width="6" height="1" fill="#2a1810" opacity="0.3" />
      <rect x="3" y="5" width="5" height="1" fill="#2a1810" opacity="0.3" />
      <rect x="3" y="7" width="6" height="1" fill="#2a1810" opacity="0.3" />
      <rect x="3" y="9" width="4" height="1" fill="#2a1810" opacity="0.3" />
      {/* Bottom roll */}
      <rect x="2" y="11" width="8" height="2" fill="#d4b896" />
      <rect x="1" y="11" width="1" height="2" fill="#8b6914" />
      <rect x="10" y="11" width="1" height="2" fill="#8b6914" />
    </svg>
  );
}

/** Decorative divider line with diamond center — matches login page style */
function OrnamentDivider() {
  return (
    <svg
      className="w-full h-3 opacity-20"
      viewBox="0 0 400 12"
      preserveAspectRatio="xMidYMid meet"
    >
      <title>Ornament</title>
      <line x1="40" y1="6" x2="175" y2="6" stroke="#c9a86a" strokeWidth="1" />
      <line x1="225" y1="6" x2="360" y2="6" stroke="#c9a86a" strokeWidth="1" />
      <circle cx="40" cy="6" r="2" fill="#c9a86a" />
      <circle cx="360" cy="6" r="2" fill="#c9a86a" />
      <path
        d="M190,6 L200,0 L210,6 L200,12 Z"
        fill="none"
        stroke="#c9a86a"
        strokeWidth="1"
      />
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
  decoration?: keyof typeof DECORATIONS;
  action?: ReactNode;
};

export function PageHeader({
  title,
  decoration = "book",
  action,
}: PageHeaderProps) {
  const DecoIcon = DECORATIONS[decoration];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DecoIcon className="opacity-70" />
          <h1 className="font-headline text-xl" style={{ color: "#f5e9cf" }}>
            {title}
          </h1>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="mt-2 max-w-md">
        <OrnamentDivider />
      </div>
    </div>
  );
}
