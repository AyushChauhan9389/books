"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { BookSpine } from "../components";
import type { Book } from "@/lib/types";
import type { SpineRect } from "../components";

/* ── Helpers ── */

export function rotateBooks(books: Book[], offset: number): Book[] {
  return [...books.slice(offset), ...books.slice(0, offset)];
}

const LIB_SCALE = 0.55;
const LIB_SHELF_H = Math.round(400 * LIB_SCALE);

/* ── MinecraftDecoration ── */

export function MinecraftDecoration({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  if (type === "creeper") {
    return (
      <svg width="32" height="48" viewBox="0 0 16 24" className={className}>
        <rect x="4" y="12" width="8" height="6" fill="#3A8A3A" />
        <rect x="2" y="18" width="4" height="6" fill="#245A24" />
        <rect x="10" y="18" width="4" height="6" fill="#245A24" />
        <rect x="4" y="4" width="8" height="8" fill="#4CB04C" />
        <rect x="5" y="6" width="2" height="2" fill="#000" />
        <rect x="9" y="6" width="2" height="2" fill="#000" />
        <rect x="7" y="8" width="2" height="3" fill="#000" />
        <rect x="6" y="9" width="1" height="3" fill="#000" />
        <rect x="9" y="9" width="1" height="3" fill="#000" />
      </svg>
    );
  }
  if (type === "enderman") {
    return (
      <svg width="24" height="56" viewBox="0 0 12 28" className={className}>
        <rect x="4" y="14" width="1" height="14" fill="#111" />
        <rect x="7" y="14" width="1" height="14" fill="#111" />
        <rect x="4" y="6" width="4" height="8" fill="#1a1a1a" />
        <rect x="2" y="6" width="1" height="14" fill="#111" />
        <rect x="9" y="6" width="1" height="14" fill="#111" />
        <rect x="3" y="0" width="6" height="6" fill="#000" />
        <rect x="3" y="3" width="2" height="1" fill="#c64fbd" />
        <rect x="7" y="3" width="2" height="1" fill="#c64fbd" />
      </svg>
    );
  }
  if (type === "flowerPot") {
    return (
      <svg width="24" height="32" viewBox="0 0 12 16" className={className}>
        <rect x="5" y="4" width="2" height="7" fill="#417424" />
        <rect x="3" y="7" width="3" height="1" fill="#417424" />
        <rect x="6" y="5" width="3" height="1" fill="#417424" />
        <rect x="4" y="0" width="4" height="4" fill="#d02c2c" />
        <rect x="5" y="0" width="2" height="2" fill="#9e1f1f" />
        <rect x="3" y="11" width="6" height="5" fill="#71351d" />
        <rect x="2" y="11" width="8" height="1" fill="#582713" />
      </svg>
    );
  }
  if (type === "chest") {
    return (
      <svg width="32" height="32" viewBox="0 0 16 16" className={className}>
        <rect x="2" y="4" width="12" height="10" fill="#785023" stroke="#2c1a07" strokeWidth="1" />
        <rect x="2" y="4" width="12" height="4" fill="#996a33" />
        <rect x="7" y="7" width="2" height="3" fill="#cfcfcc" />
      </svg>
    );
  }
  return null;
}

/* ── LibraryShelf ── */

export function LibraryShelf({
  shelf,
  shelfIndex,
  openId,
  onOpen,
  label,
}: {
  shelf: Book[];
  shelfIndex: number;
  openId: string | null;
  onOpen: (book: Book, rect: SpineRect, id: string) => void;
  label: string;
}) {
  const leftDeco =
    shelfIndex === 0 ? "flowerPot" : shelfIndex === 1 ? "creeper" : "chest";
  const rightDeco =
    shelfIndex === 0 ? "enderman" : shelfIndex === 1 ? "flowerPot" : "creeper";

  return (
    <div className="relative w-full">
      <div
        className="relative w-full overflow-hidden"
        style={{ height: `${LIB_SHELF_H}px`, background: "#0a0502" }}
      >
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern
            id={`wallpaper-${shelfIndex}`}
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0,20 L40,20 M20,0 L20,40"
              stroke="#c9a86a"
              strokeWidth="0.5"
            />
            <circle
              cx="20"
              cy="20"
              r="10"
              fill="none"
              stroke="#c9a86a"
              strokeWidth="0.5"
            />
          </pattern>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={`url(#wallpaper-${shelfIndex})`}
          />
        </svg>

        <div
          className="absolute left-1/2 bottom-0"
          style={{
            transform: `translateX(-50%) scale(${LIB_SCALE})`,
            transformOrigin: "bottom center",
          }}
        >
          <div className="flex items-end justify-center gap-0">
            {shelf.map((book, i) => {
              const id = `lib-${shelfIndex}-${i}`;
              return (
                <BookSpine
                  key={id}
                  book={book}
                  index={shelfIndex * 30 + i}
                  onClick={(rect) => onOpen(book, rect, id)}
                  isOpen={openId === id}
                />
              );
            })}
          </div>
        </div>

        <div
          className="absolute left-4 md:left-12 bottom-0 opacity-100"
          style={{ transform: "scale(2.5)", transformOrigin: "bottom left" }}
        >
          <MinecraftDecoration type={leftDeco} />
        </div>

        <div
          className="absolute right-4 md:right-12 bottom-0 opacity-100"
          style={{ transform: "scale(2.5)", transformOrigin: "bottom right" }}
        >
          <div
            style={{ transform: "scaleX(-1)", transformOrigin: "center" }}
          >
            <MinecraftDecoration type={rightDeco} />
          </div>
        </div>
      </div>

      <div className="relative h-8 w-full z-10 drop-shadow-2xl">
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0" y="0" width="100" height="8" fill="#4a2d1a" />
          <rect x="0" y="8" width="100" height="4" fill="#2a1810" />
          <rect x="0" y="12" width="100" height="8" fill="#130a05" />
          <path d="M5,12 L5,20 L15,12 Z" fill="#2a1810" />
          <path d="M95,12 L95,20 L85,12 Z" fill="#2a1810" />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center -top-3">
          <div className="bg-[#1a0f0a] border border-[#c9a86a]/30 px-4 py-1 rounded-sm shadow-md">
            <span className="font-label text-[10px] tracking-[0.4em] uppercase text-[#c9a86a]">
              {label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── LibraryFrame ── */

export function LibraryFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full rounded-t-3xl overflow-hidden shadow-[0_40px_90px_rgba(0,0,0,0.8)] bg-[#0f0805] border-x-[16px] border-b-[24px] border-[#2a1810]">
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-[#130a05] via-[#3a2012] to-[#130a05] z-20 border-r border-[#0f0805]" />
        <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-[#130a05] via-[#3a2012] to-[#130a05] z-20 border-l border-[#0f0805]" />
        <div className="relative z-10 px-8">{children}</div>
      </div>
    </div>
  );
}

/* ── BackButton ── */

export function BackButton({ href, transitionType = "navigate-back", label = "Back", useHistoryBack = false }: { href?: string, transitionType?: string, label?: string, useHistoryBack?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useGSAP(
    () => {
      gsap.from(ref.current, {
        opacity: 0,
        x: -20,
        duration: 0.5,
        delay: 0.3,
        ease: "power2.out",
      });
    },
    { dependencies: [] },
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (useHistoryBack) {
      router.back();
    } else {
      router.push(href ?? "/", {
        transitionTypes: [transitionType],
      });
    }
  };

  return (
    <div ref={ref} className="absolute top-6 left-6 z-30">
      <Link
        href={href ?? "/"}
        onClick={handleClick}
        className="flex items-center gap-3 px-5 py-3 bg-black/25 backdrop-blur-md border border-white/15 rounded-full text-white font-label text-xs uppercase tracking-[0.25em] hover:bg-white/15 transition-colors"
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title>{label}</title>
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {label}
      </Link>
    </div>
  );
}
