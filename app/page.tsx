"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";

gsap.registerPlugin(useGSAP);

type Book = {
  title: string;
  author: string;
  stars: number;
  bgColor: string;
  textColor: string;
  starColor?: string;
  width: number;
  height: number;
  titleSize: string;
  titleWeight: string;
  titleTracking: string;
};

const books: Book[] = [
  {
    title: "THE CREATIVE ACT",
    author: "RUBIN",
    stars: 4,
    bgColor: "#1d1d2b",
    textColor: "text-white",
    width: 54,
    height: 360,
    titleSize: "text-[13px]",
    titleWeight: "font-bold",
    titleTracking: "tracking-widest",
  },
  {
    title: "NO MORE MR. NICE GUY",
    author: "GLOVER",
    stars: 3,
    bgColor: "#f8b486",
    textColor: "text-slate-800",
    width: 42,
    height: 310,
    titleSize: "text-[11px]",
    titleWeight: "font-bold",
    titleTracking: "tracking-tight",
  },
  {
    title: "YELLOWFACE",
    author: "KUANG",
    stars: 4,
    bgColor: "#fedc7f",
    textColor: "text-slate-900",
    starColor: "text-yellow-600",
    width: 54,
    height: 340,
    titleSize: "text-[13px]",
    titleWeight: "font-black",
    titleTracking: "tracking-widest",
  },
  {
    title: "THE SILENT PATIENT",
    author: "MICHAELIDES",
    stars: 3,
    bgColor: "#3e6080",
    textColor: "text-white",
    width: 48,
    height: 335,
    titleSize: "text-[12px]",
    titleWeight: "font-bold",
    titleTracking: "tracking-widest",
  },
  {
    title: "ALICE'S ADVENTURES IN WONDERLAND",
    author: "CARROLL",
    stars: 3,
    bgColor: "#4fa987",
    textColor: "text-white/90",
    width: 44,
    height: 335,
    titleSize: "text-[10px]",
    titleWeight: "font-medium",
    titleTracking: "tracking-tight",
  },
  {
    title: "THE GENTLEMAN FROM PERU",
    author: "ACIMAN",
    stars: 3,
    bgColor: "#ff4d4d",
    textColor: "text-white",
    width: 20,
    height: 260,
    titleSize: "text-[9px]",
    titleWeight: "font-bold",
    titleTracking: "tracking-tighter",
  },
  {
    title: "THE BOOK OF CLARITY",
    author: "CHOPRA",
    stars: 4,
    bgColor: "#7fa05a",
    textColor: "text-slate-100",
    width: 40,
    height: 285,
    titleSize: "text-[12px]",
    titleWeight: "font-bold",
    titleTracking: "tracking-tight",
  },
  {
    title: "BEFORE THE COFFEE GETS COLD",
    author: "KAWAGUCHI",
    stars: 4,
    bgColor: "#3b4b2a",
    textColor: "text-stone-200",
    width: 36,
    height: 285,
    titleSize: "text-[10px]",
    titleWeight: "font-bold",
    titleTracking: "tracking-tight",
  },
  {
    title: "THE HARD THING ABOUT HARD THINGS",
    author: "HOROWITZ",
    stars: 4,
    bgColor: "#f7b76e",
    textColor: "text-slate-800",
    width: 46,
    height: 310,
    titleSize: "text-[11px]",
    titleWeight: "font-bold",
    titleTracking: "tracking-tight",
  },
  {
    title: "GHACHAR GHOCHAR",
    author: "SHANBHAG",
    stars: 3,
    bgColor: "#fef5d6",
    textColor: "text-slate-800",
    starColor: "text-yellow-600",
    width: 34,
    height: 265,
    titleSize: "text-[11px]",
    titleWeight: "font-bold",
    titleTracking: "tracking-tight",
  },
  {
    title: "TINY EXPERIMENTS",
    author: "CUNFF",
    stars: 4,
    bgColor: "#002a46",
    textColor: "text-white",
    width: 50,
    height: 340,
    titleSize: "text-[13px]",
    titleWeight: "font-black",
    titleTracking: "tracking-[0.2em]",
  },
  {
    title: "PIRANESI",
    author: "CLARKE",
    stars: 3,
    bgColor: "#d72131",
    textColor: "text-white",
    width: 44,
    height: 320,
    titleSize: "text-[13px]",
    titleWeight: "font-black",
    titleTracking: "tracking-widest",
  },
  {
    title: "WHITE NIGHTS",
    author: "DOSTOEVSKY",
    stars: 4,
    bgColor: "#f89b21",
    textColor: "text-slate-800",
    width: 42,
    height: 320,
    titleSize: "text-[11px]",
    titleWeight: "font-black",
    titleTracking: "tracking-tight",
  },
  {
    title: "V FOR VENDETTA",
    author: "MOORE",
    stars: 3,
    bgColor: "#fecb4d",
    textColor: "text-slate-900",
    starColor: "text-orange-700",
    width: 50,
    height: 340,
    titleSize: "text-[14px]",
    titleWeight: "font-black",
    titleTracking: "tracking-widest",
  },
  {
    title: "OF MICE AND MEN",
    author: "STEINBECK",
    stars: 4,
    bgColor: "#8e54e9",
    textColor: "text-white",
    width: 34,
    height: 285,
    titleSize: "text-[10px]",
    titleWeight: "font-bold",
    titleTracking: "tracking-tight",
  },
  {
    title: "THE HOUSEKEEPER AND THE PROFESSOR",
    author: "OGAWA",
    stars: 5,
    bgColor: "#6eb7ff",
    textColor: "text-white",
    width: 40,
    height: 330,
    titleSize: "text-[10px]",
    titleWeight: "font-medium",
    titleTracking: "tracking-tight",
  },
  {
    title: "THE MEMORY POLICE",
    author: "OGAWA",
    stars: 4,
    bgColor: "#ff1a7f",
    textColor: "text-white",
    width: 46,
    height: 335,
    titleSize: "text-[12px]",
    titleWeight: "font-bold",
    titleTracking: "tracking-widest",
  },
  {
    title: "HATCHING TWITTER",
    author: "BILTON",
    stars: 4,
    bgColor: "#ffcc33",
    textColor: "text-slate-800",
    starColor: "text-orange-600",
    width: 48,
    height: 335,
    titleSize: "text-[13px]",
    titleWeight: "font-black",
    titleTracking: "tracking-widest",
  },
  {
    title: "THE FALL",
    author: "CAMUS",
    stars: 4,
    bgColor: "#004b66",
    textColor: "text-white",
    width: 34,
    height: 280,
    titleSize: "text-[11px]",
    titleWeight: "font-bold",
    titleTracking: "tracking-widest",
  },
  {
    title: "HOLES",
    author: "SACHAR",
    stars: 3,
    bgColor: "#40c4cc",
    textColor: "text-slate-900",
    width: 46,
    height: 310,
    titleSize: "text-[15px]",
    titleWeight: "font-black",
    titleTracking: "tracking-[0.3em]",
  },
  {
    title: "BLACK EDGE",
    author: "KOLHATKAR",
    stars: 5,
    bgColor: "#f89021",
    textColor: "text-slate-900",
    width: 46,
    height: 335,
    titleSize: "text-[13px]",
    titleWeight: "font-black",
    titleTracking: "tracking-widest",
  },
  {
    title: "COMPANY OF ONE",
    author: "JARVIS",
    stars: 4,
    bgColor: "#70647a",
    textColor: "text-white/80",
    width: 50,
    height: 310,
    titleSize: "text-[11px]",
    titleWeight: "font-bold",
    titleTracking: "tracking-widest",
  },
  {
    title: "GRIEF IS THE THING WITH FEATHERS",
    author: "PORTER",
    stars: 3,
    bgColor: "#e19a9a",
    textColor: "text-slate-900",
    width: 34,
    height: 260,
    titleSize: "text-[9px]",
    titleWeight: "font-bold",
    titleTracking: "tracking-tight",
  },
  {
    title: "THE HOUSEMAID'S SECRET",
    author: "MCFADDEN",
    stars: 4,
    bgColor: "#1d1d2b",
    textColor: "text-white",
    width: 50,
    height: 330,
    titleSize: "text-[12px]",
    titleWeight: "font-bold",
    titleTracking: "tracking-widest",
  },
];

/* ── Helpers ── */

function StarIcon({
  size = 10,
  filled = true,
}: {
  size?: number;
  filled?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 2}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function StarRating({ count, color }: { count: number; color?: string }) {
  return (
    <div
      className={`flex flex-col items-center gap-px ${color ?? "opacity-60"}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <StarIcon key={i} size={10} />
      ))}
    </div>
  );
}

function InlineStars({ count, color }: { count: number; color?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${color ?? "text-yellow-500"}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} size={16} filled={i < count} />
      ))}
    </div>
  );
}

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.floor(((num >> 16) & 255) * (1 - amount)));
  const g = Math.max(0, Math.floor(((num >> 8) & 255) * (1 - amount)));
  const b = Math.max(0, Math.floor((num & 255) * (1 - amount)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function isLightColor(hex: string): boolean {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return r * 0.299 + g * 0.587 + b * 0.114 > 150;
}

type SpineRect = { x: number; y: number; width: number; height: number };

/*
  Animation phases:
  0 = at shelf (spine size + position, no backdrop)
  1 = lifted up from shelf (still small, shifted up 80px)
  2 = fly to center + scale up to full book
  3 = cover opens
  Closing reverses: 3→2→1→0→unmount
*/

/* ── BookSpine ── */

function BookSpine({
  book,
  index,
  onClick,
  isOpen,
}: {
  book: Book;
  index: number;
  onClick: (rect: SpineRect) => void;
  isOpen: boolean;
}) {
  const spineRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(enterRef.current, {
        opacity: 0,
        duration: 0.4,
        delay: index * 0.04,
        ease: "power1.out",
      });
    },
    { dependencies: [] },
  );

  const handleMouseEnter = () => {
    gsap.to(hoverRef.current, {
      y: -12,
      duration: 0.35,
      ease: "back.out(1.7)",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(hoverRef.current, {
      y: 0,
      duration: 0.35,
      ease: "back.out(1.7)",
      overwrite: "auto",
    });
  };

  const handleClick = () => {
    if (spineRef.current) {
      const r = spineRef.current.getBoundingClientRect();
      onClick({ x: r.x, y: r.y, width: r.width, height: r.height });
    }
  };

  return (
    <div ref={enterRef}>
      <div
        ref={hoverRef}
        className="book-hover"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={spineRef}
          className={`flex flex-col items-center justify-between py-4 overflow-hidden ${book.textColor}`}
          style={{
            backgroundColor: book.bgColor,
            width: `${book.width}px`,
            height: `${book.height}px`,
            borderLeft: "1px solid rgba(0,0,0,0.1)",
            opacity: isOpen ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          <StarRating count={book.stars} color={book.starColor} />
          <div
            className={`text-vertical ${book.titleWeight} ${book.titleSize} ${book.titleTracking} grow pt-4 uppercase overflow-hidden min-h-0 whitespace-nowrap`}
          >
            {book.title}
          </div>
          <div className="text-vertical text-[9px] font-medium opacity-50 pb-2 uppercase whitespace-nowrap">
            {book.author}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── OpenBook overlay ── */

const BOOK_W = 420;
const BOOK_H = 520;

function OpenBook({
  book,
  onClose,
  spineRect,
}: {
  book: Book;
  onClose: () => void;
  spineRect: SpineRect;
}) {
  const [phase, setPhase] = useState(0); // 0=at-shelf, 1=lifted, 2=centered, 3=opened
  const closingRef = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const frontCoverRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const openTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const light = isLightColor(book.bgColor);
  const coverText = light ? "text-slate-900" : "text-white";
  const pagesBg = "#f5f0e8";

  // Center position
  const centerLeft =
    (typeof window !== "undefined" ? window.innerWidth : 1920) / 2 - BOOK_W / 2;
  const centerTop =
    (typeof window !== "undefined" ? window.innerHeight : 1080) / 2 -
    BOOK_H / 2;

  // Open sequence timeline
  useGSAP(
    () => {
      // Initial state — sitting at the spine
      gsap.set(containerRef.current, {
        left: spineRect.x,
        top: spineRect.y,
        width: spineRect.width,
        height: spineRect.height,
        opacity: 1,
      });
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(frontCoverRef.current, { rotateY: 0 });
      gsap.set(pagesRef.current, { opacity: 0, x: -8 });

      const tl = gsap.timeline();
      openTimelineRef.current = tl;

      // Phase 0 → 1: lift up off the shelf
      tl.to(containerRef.current, {
        top: spineRect.y - 80,
        duration: 0.35,
        ease: "back.out(1.7)",
        onStart: () => setPhase(1),
      });
      tl.to(
        backdropRef.current,
        {
          opacity: 0.2,
          duration: 0.4,
          ease: "power1.out",
        },
        "<",
      );

      // Phase 1 → 2: fly to center + scale up to full book
      tl.to(
        containerRef.current,
        {
          left: centerLeft,
          top: centerTop,
          width: BOOK_W,
          height: BOOK_H,
          duration: 0.5,
          ease: "expo.out",
          onStart: () => setPhase(2),
        },
        "+=0.05",
      );
      tl.to(
        backdropRef.current,
        {
          opacity: 0.6,
          duration: 0.4,
          ease: "power1.out",
        },
        "<",
      );

      // Phase 2 → 3: open cover + reveal pages
      tl.to(
        frontCoverRef.current,
        {
          rotateY: -155,
          duration: 0.65,
          ease: "power2.inOut",
          onStart: () => setPhase(3),
        },
        "+=0.1",
      );
      tl.to(
        pagesRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.3,
          ease: "power1.out",
        },
        "<0.2",
      );
    },
    { dependencies: [] },
  );

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    openTimelineRef.current?.kill();

    const tl = gsap.timeline({ onComplete: onClose });

    // Phase 3 → 2: cover closes, pages fade
    tl.to(frontCoverRef.current, {
      rotateY: 0,
      duration: 0.35,
      ease: "power1.in",
      onStart: () => setPhase(2),
    });
    tl.to(
      pagesRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power1.in",
      },
      "<",
    );

    // Phase 2 → 1: shrink back down to spine size, parked above shelf
    tl.to(
      containerRef.current,
      {
        left: spineRect.x,
        top: spineRect.y - 80,
        width: spineRect.width,
        height: spineRect.height,
        duration: 0.4,
        ease: "power2.inOut",
        onStart: () => setPhase(1),
      },
      "+=0.15",
    );
    tl.to(
      backdropRef.current,
      {
        opacity: 0.2,
        duration: 0.4,
        ease: "power1.inOut",
      },
      "<",
    );

    // Phase 1 → 0: drop back into the shelf and fade away
    tl.to(containerRef.current, {
      top: spineRect.y,
      opacity: 0,
      duration: 0.35,
      ease: "power1.in",
      onStart: () => setPhase(0),
    });
    tl.to(
      backdropRef.current,
      {
        opacity: 0,
        duration: 0.35,
        ease: "power1.in",
      },
      "<",
    );
  }, [onClose, spineRect]);

  const isSmall = phase <= 1;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 z-50 bg-black backdrop-blur-sm"
        style={{
          opacity: 0,
          pointerEvents: phase >= 2 ? "auto" : "none",
        }}
        onClick={handleClose}
      />

      {/* Book container — GSAP drives left/top/width/height/opacity */}
      <div
        ref={containerRef}
        style={{ position: "fixed", zIndex: 60, perspective: "1200px" }}
      >
        <div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Back cover */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: darkenColor(book.bgColor, 0.15),
              transform: "translateZ(-4px)",
              boxShadow: "4px 8px 32px rgba(0,0,0,0.4)",
            }}
          />

          {/* Pages (GSAP fades them in) */}
          <div
            ref={pagesRef}
            className="absolute inset-0 overflow-hidden"
            style={{
              backgroundColor: pagesBg,
              transform: "translateZ(-2px)",
              left: "4px",
              opacity: 0,
            }}
          >
            <div className="p-10 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <InlineStars count={book.stars} color="text-yellow-600" />
                  <span className="font-label text-xs text-slate-500 uppercase tracking-wider">
                    {book.stars} / 5
                  </span>
                </div>
                <div className="h-px bg-slate-300/50" />
                <p className="font-body text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;A book that stays with you long after the last
                  page.&rdquo;
                </p>
                <div className="h-px bg-slate-300/50" />
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between font-label text-xs uppercase tracking-wider text-slate-500">
                    <span>Author</span>
                    <span className="text-slate-800 font-semibold">
                      {book.author}
                    </span>
                  </div>
                  <div className="flex justify-between font-label text-xs uppercase tracking-wider text-slate-500">
                    <span>Rating</span>
                    <span className="text-slate-800 font-semibold">
                      {"★".repeat(book.stars)}
                      {"☆".repeat(5 - book.stars)}
                    </span>
                  </div>
                </div>
                <div className="pt-6 space-y-2.5">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      className="h-px bg-slate-300/30"
                      style={{ width: `${85 - i * 3}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="text-center font-label text-xs text-slate-400 tracking-widest">
                — 1 —
              </div>
            </div>
          </div>

          {/* Front cover (hinged left) — GSAP rotates it around Y */}
          <div
            ref={frontCoverRef}
            className="absolute inset-0"
            style={{
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Front face */}
            <div
              className={`absolute inset-0 overflow-hidden ${coverText}`}
              style={{
                backgroundColor: book.bgColor,
                backfaceVisibility: "hidden",
                boxShadow: "2px 0 12px rgba(0,0,0,0.2)",
              }}
            >
              {/* Spine edge detail */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[6px]"
                style={{ backgroundColor: darkenColor(book.bgColor, 0.2) }}
              />

              {/* Spine content — visible when small (phases 0-1) */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-between py-4 ${book.textColor}`}
                style={{
                  opacity: isSmall ? 1 : 0,
                  transition: "opacity 0.2s ease",
                  pointerEvents: "none",
                }}
              >
                <StarRating count={book.stars} color={book.starColor} />
                <div
                  className={`text-vertical ${book.titleWeight} ${book.titleSize} ${book.titleTracking} grow pt-4 uppercase overflow-hidden min-h-0 whitespace-nowrap`}
                >
                  {book.title}
                </div>
                <div className="text-vertical text-[9px] font-medium opacity-50 pb-2 uppercase whitespace-nowrap">
                  {book.author}
                </div>
              </div>

              {/* Cover content — visible when full-sized (phases 2+) */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center p-8"
                style={{
                  opacity: isSmall ? 0 : 1,
                  transition: isSmall
                    ? "opacity 0.15s ease"
                    : "opacity 0.3s ease 0.3s",
                  pointerEvents: "none",
                }}
              >
                <div className="flex flex-col items-center gap-6 text-center">
                  <div className="flex gap-1 opacity-70">
                    {Array.from({ length: book.stars }, (_, i) => (
                      <StarIcon key={i} size={14} />
                    ))}
                  </div>
                  <h2 className="font-headline font-black text-2xl tracking-tight leading-tight max-w-[280px]">
                    {book.title}
                  </h2>
                  <div className="w-12 h-px bg-current opacity-30" />
                  <p className="font-label text-sm tracking-[0.3em] uppercase opacity-70">
                    {book.author}
                  </p>
                </div>
              </div>
            </div>

            {/* Inside of cover */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: darkenColor(book.bgColor, 0.1),
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
              }}
            />
          </div>

          {/* Close button — only visible when fully open */}
          {phase >= 2 && (
            <button
              onClick={handleClose}
              className="absolute -top-12 -right-12 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
              style={{
                opacity: phase === 3 ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            >
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/* ── PixelCloud ── */

// Each row is a bitmask of which pixel columns are filled.
// Grid: 18 cols × 7 rows — two-bump cloud silhouette.
const CLOUD_GRID = [
  [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const CP = 7; // pixel block size in SVG units
const CLOUD_W = 18 * CP;
const CLOUD_H = 7 * CP;

function PixelCloud({
  className,
  scale = 1,
  driftDelay,
  color = "white",
}: {
  className: string;
  scale?: number;
  driftDelay: number;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(ref.current, { scale, transformOrigin: "top left" });
      gsap.to(ref.current, {
        x: 12,
        duration: 4,
        delay: driftDelay,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { dependencies: [] },
  );

  return (
    <div ref={ref} className={`absolute ${className}`}>
      <svg
        width={CLOUD_W}
        height={CLOUD_H}
        viewBox={`0 0 ${CLOUD_W} ${CLOUD_H}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {CLOUD_GRID.flatMap((row, r) =>
          row.flatMap((filled, c) =>
            filled
              ? [
                  <rect
                    key={`${r}-${c}`}
                    x={c * CP}
                    y={r * CP}
                    width={CP}
                    height={CP}
                    fill={color}
                  />,
                ]
              : [],
          ),
        )}
      </svg>
    </div>
  );
}

/* ── ShelfFade ── */

function Shelf() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(ref.current, {
        opacity: 0,
        duration: 0.8,
        delay: 1.2,
        ease: "power1.out",
      });
    },
    { dependencies: [] },
  );

  return (
    <div ref={ref}>
      <div className="h-2 w-full bg-shelf-surface -mt-px relative z-20 shadow-2xl" />
      <div className="h-8 w-full bg-black/20 blur-md absolute -bottom-4 left-0" />
    </div>
  );
}

/* ── HintIcon ── */

function HintIcon() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(ref.current, { xPercent: -50 });
      gsap.to(ref.current, {
        y: -12,
        duration: 1,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { dependencies: [] },
  );

  return (
    <div ref={ref} className="absolute bottom-12 left-1/2 opacity-60">
      <svg width={36} height={36} viewBox="0 0 24 24" fill="white">
        <path d="M18 13c-.55 0-1.05.23-1.41.59l-.07.07-2.52-1.49V6c0-.83-.67-1.5-1.5-1.5S11 5.17 11 6v7.12l-3.07-1.63c-.56-.3-1.19-.19-1.67.15-.48.34-.72.86-.61 1.39l.04.12 2.64 6.03c.09.21.23.39.4.53l.12.09C9.74 20.23 10.84 21 12.5 21h3c2.33 0 4-1.67 4-4v-2.5c0-.83-.67-1.5-1.5-1.5z" />
      </svg>
    </div>
  );
}

/* ── Weather ── */

type Weather = "sunny" | "night" | "rain" | "snow";

const WEATHER_BG: Record<Weather, string> = {
  sunny: "#3b66ff",
  night: "#0a0e25",
  rain: "#465262",
  snow: "#7a8aa8",
};

function SunnyWeather() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(ref.current, { opacity: 0, duration: 0.8, ease: "power1.out" });
    },
    { dependencies: [] },
  );

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none">
      <PixelCloud
        className="top-[10%] left-[15%] opacity-80"
        scale={0.75}
        driftDelay={0}
      />
      <PixelCloud
        className="top-[35%] left-[38%] opacity-90"
        scale={0.5}
        driftDelay={2}
      />
      <PixelCloud
        className="top-[15%] right-[5%]"
        scale={1.25}
        driftDelay={4}
      />
      <PixelCloud
        className="bottom-[40%] right-[2%]"
        scale={0.9}
        driftDelay={6}
      />
    </div>
  );
}

function Moon() {
  return (
    <svg
      className="absolute top-[12%] right-[12%]"
      width={84}
      height={84}
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Moon</title>
      {/* Body */}
      <rect x="3" y="1" width="4" height="1" fill="#e2e8f0" />
      <rect x="2" y="2" width="6" height="1" fill="#e2e8f0" />
      <rect x="1" y="3" width="8" height="1" fill="#e2e8f0" />
      <rect x="1" y="4" width="8" height="1" fill="#e2e8f0" />
      <rect x="1" y="5" width="8" height="1" fill="#e2e8f0" />
      <rect x="1" y="6" width="8" height="1" fill="#e2e8f0" />
      <rect x="2" y="7" width="6" height="1" fill="#e2e8f0" />
      <rect x="3" y="8" width="4" height="1" fill="#e2e8f0" />
      {/* Craters */}
      <rect x="3" y="3" width="1" height="1" fill="#94a3b8" />
      <rect x="6" y="4" width="1" height="1" fill="#94a3b8" />
      <rect x="4" y="6" width="1" height="1" fill="#94a3b8" />
    </svg>
  );
}

function NightWeather() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(ref.current, { opacity: 0, duration: 0.8, ease: "power1.out" });

      const stars =
        ref.current?.querySelectorAll<HTMLDivElement>(".star") ?? [];
      stars.forEach((star) => {
        gsap.set(star, {
          left: `${Math.random() * 100}%`,
          top: `${5 + Math.random() * 65}%`,
          scale: 0.6 + Math.random() * 0.9,
        });
        gsap.to(star, {
          opacity: 0.2,
          duration: 0.8 + Math.random() * 1.6,
          delay: Math.random() * 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      });
    },
    { dependencies: [] },
  );

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none">
      <Moon />
      {Array.from({ length: 28 }, (_, i) => (
        <div
          key={i}
          className="star absolute w-[3px] h-[3px] bg-white"
          style={{ transformOrigin: "center" }}
        />
      ))}
    </div>
  );
}

function RainWeather() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(ref.current, { opacity: 0, duration: 0.8, ease: "power1.out" });

      const drops =
        ref.current?.querySelectorAll<HTMLDivElement>(".raindrop") ?? [];
      const viewportH = window.innerHeight;
      drops.forEach((drop) => {
        const duration = 0.7 + Math.random() * 0.5;
        const delay = Math.random() * 2;
        gsap.set(drop, { left: `${Math.random() * 100}%` });
        gsap.fromTo(
          drop,
          { y: -20, opacity: 0.7 },
          {
            y: viewportH + 20,
            duration,
            delay,
            ease: "none",
            repeat: -1,
          },
        );
      });
    },
    { dependencies: [] },
  );

  return (
    <div
      ref={ref}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      <PixelCloud
        className="top-[4%] left-[8%]"
        scale={0.9}
        driftDelay={0}
        color="#2f3845"
      />
      <PixelCloud
        className="top-[2%] left-[42%]"
        scale={1.1}
        driftDelay={2}
        color="#2f3845"
      />
      <PixelCloud
        className="top-[6%] right-[10%]"
        scale={0.85}
        driftDelay={4}
        color="#2f3845"
      />
      <PixelCloud
        className="top-[14%] left-[25%] opacity-80"
        scale={0.7}
        driftDelay={3}
        color="#3a4556"
      />
      {Array.from({ length: 45 }, (_, i) => (
        <div
          key={i}
          className="raindrop absolute top-0 w-[2px] h-[14px] bg-sky-200/80"
        />
      ))}
    </div>
  );
}

function SnowWeather() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(ref.current, { opacity: 0, duration: 0.8, ease: "power1.out" });

      const flakes =
        ref.current?.querySelectorAll<HTMLDivElement>(".snowflake") ?? [];
      const viewportH = window.innerHeight;
      flakes.forEach((flake) => {
        const duration = 4 + Math.random() * 4;
        const delay = Math.random() * duration;
        gsap.set(flake, { left: `${Math.random() * 100}%` });
        gsap.fromTo(
          flake,
          { y: -20, opacity: 0 },
          {
            y: viewportH + 20,
            opacity: 0.9,
            duration,
            delay,
            ease: "none",
            repeat: -1,
          },
        );
        const inner = flake.querySelector<HTMLDivElement>(".snowflake-inner");
        if (inner) {
          gsap.to(inner, {
            x: 16,
            duration: 1.8 + Math.random() * 1.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
        }
      });
    },
    { dependencies: [] },
  );

  return (
    <div
      ref={ref}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      <PixelCloud
        className="top-[5%] left-[12%] opacity-90"
        scale={0.85}
        driftDelay={0}
      />
      <PixelCloud className="top-[3%] left-[48%]" scale={1.05} driftDelay={2} />
      <PixelCloud
        className="top-[8%] right-[12%] opacity-95"
        scale={0.9}
        driftDelay={4}
      />
      {Array.from({ length: 55 }, (_, i) => (
        <div key={i} className="snowflake absolute top-0">
          <div className="snowflake-inner w-[5px] h-[5px] bg-white" />
        </div>
      ))}
    </div>
  );
}

/* ── WeatherControls ── */

function WeatherIcon({ type }: { type: Weather }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (type) {
    case "sunny":
      return (
        <svg {...common}>
          <title>Sunny</title>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      );
    case "night":
      return (
        <svg {...common}>
          <title>Night</title>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      );
    case "rain":
      return (
        <svg {...common}>
          <title>Rain</title>
          <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
          <path d="M8 19v2M12 21v2M16 19v2" />
        </svg>
      );
    case "snow":
      return (
        <svg {...common}>
          <title>Snow</title>
          <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
          <path d="M8 16h.01M8 20h.01M12 18h.01M12 22h.01M16 16h.01M16 20h.01" />
        </svg>
      );
  }
}

function WeatherControls({
  weather,
  onChange,
}: {
  weather: Weather;
  onChange: (w: Weather) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(ref.current, {
        opacity: 0,
        y: -12,
        duration: 0.5,
        delay: 0.3,
        ease: "power2.out",
      });
    },
    { dependencies: [] },
  );

  const options: Weather[] = ["sunny", "night", "rain", "snow"];

  return (
    <div
      ref={ref}
      className="fixed top-6 right-6 z-40 flex gap-1 bg-black/25 backdrop-blur-md p-1.5 border border-white/15 rounded-full"
    >
      {options.map((w) => {
        const active = weather === w;
        return (
          <button
            key={w}
            type="button"
            onClick={() => onChange(w)}
            aria-label={w}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
              active
                ? "bg-white text-slate-900"
                : "text-white/80 hover:bg-white/15 hover:text-white"
            }`}
          >
            <WeatherIcon type={w} />
          </button>
        );
      })}
    </div>
  );
}

/* ── Library ── */

// Rotate the books array to give each library shelf a different starting book
// without having to author additional book data.
function rotateBooks(offset: number): Book[] {
  return [...books.slice(offset), ...books.slice(0, offset)];
}

const LIB_SCALE = 0.55;
const LIB_SHELF_H = Math.round(400 * LIB_SCALE);

function LibraryShelf({
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
  return (
    <div className="relative w-full">
      {/* Shelf Backing with subtle SVG wallpaper */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: `${LIB_SHELF_H}px`,
          background: "#0a0502",
        }}
      >
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <pattern id={`wallpaper-${shelfIndex}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
             <path d="M0,20 L40,20 M20,0 L20,40" stroke="#c9a86a" strokeWidth="0.5" />
             <circle cx="20" cy="20" r="10" fill="none" stroke="#c9a86a" strokeWidth="0.5" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill={`url(#wallpaper-${shelfIndex})`} />
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
      </div>

      {/* SVG Shelf Base */}
      <div className="relative h-8 w-full z-10 drop-shadow-2xl">
         <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="100" height="8" fill="#4a2d1a" />
            <rect x="0" y="8" width="100" height="4" fill="#2a1810" />
            <rect x="0" y="12" width="100" height="8" fill="#130a05" />
            <path d="M5,12 L5,20 L15,12 Z" fill="#2a1810" />
            <path d="M95,12 L95,20 L85,12 Z" fill="#2a1810" />
         </svg>
         
         {/* Label */}
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

function LibraryFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full rounded-t-3xl overflow-hidden shadow-[0_40px_90px_rgba(0,0,0,0.8)] bg-[#0f0805] border-x-[16px] border-b-[24px] border-[#2a1810]">
      {/* Side columns for the shelves */}
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-[#130a05] via-[#3a2012] to-[#130a05] z-20 border-r border-[#0f0805]" />
        <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-[#130a05] via-[#3a2012] to-[#130a05] z-20 border-l border-[#0f0805]" />
        
        {/* Content area */}
        <div className="relative z-10 px-8">
          {children}
        </div>
      </div>
    </div>
  );
}

function LibraryView({
  openId,
  onOpen,
}: {
  openId: string | null;
  onOpen: (book: Book, rect: SpineRect, id: string) => void;
}) {
  const headingRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.6,
        delay: 0.4,
        ease: "power2.out",
      });
    },
    { dependencies: [] },
  );

  const shelves = [
    { offset: 0, books: rotateBooks(0), label: "Section I · Fiction" },
    { offset: 9, books: rotateBooks(9), label: "Section II · Essays" },
    { offset: 17, books: rotateBooks(17), label: "Section III · Classics" },
  ];

  return (
    <div className="relative w-full max-w-[1200px] px-6 z-10 pt-10">
      <div ref={headingRef} className="text-center mb-8 relative">
        <p
          className="font-label uppercase tracking-[0.55em] text-xs mb-2 relative z-10"
          style={{ color: "#c9a86a" }}
        >
          The
        </p>
        <h1
          className="font-headline font-black tracking-[0.15em] leading-none text-5xl md:text-6xl relative z-10"
          style={{
            color: "#f5e9cf",
            textShadow: `0 4px 12px rgba(0,0,0,0.8), 0 1px 0 #130a05`,
          }}
        >
          LIBRARY
        </h1>
        {/* Decorative background SVG for the title */}
        <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[150px] opacity-20 pointer-events-none" viewBox="0 0 600 150">
           <path d="M50,75 L250,75 M350,75 L550,75" stroke="#c9a86a" strokeWidth="1" />
           <circle cx="50" cy="75" r="4" fill="#c9a86a" />
           <circle cx="550" cy="75" r="4" fill="#c9a86a" />
           <path d="M280,75 L300,55 L320,75 L300,95 Z" fill="none" stroke="#c9a86a" strokeWidth="2" />
        </svg>
      </div>

      <LibraryFrame>
        {shelves.map((shelf, si) => (
          <LibraryShelf
            key={shelf.offset}
            shelf={shelf.books}
            shelfIndex={si}
            openId={openId}
            onOpen={onOpen}
            label={shelf.label}
          />
        ))}
      </LibraryFrame>
    </div>
  );
}

/* ── Navigation buttons ── */

function LibraryButton({ onClick }: { onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      gsap.from(ref.current, {
        opacity: 0,
        x: 20,
        duration: 0.6,
        delay: 1.4,
        ease: "power2.out",
      });
    },
    { dependencies: [] },
  );

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className="absolute bottom-12 right-12 z-30 flex items-center gap-3 px-5 py-3 bg-black/25 backdrop-blur-md border border-white/15 rounded-full text-white font-label text-xs uppercase tracking-[0.25em] hover:bg-white/15 transition-colors"
    >
      Enter Library
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
        <title>Enter library</title>
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);

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

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className="absolute top-6 left-6 z-30 flex items-center gap-3 px-5 py-3 bg-black/25 backdrop-blur-md border border-white/15 rounded-full text-white font-label text-xs uppercase tracking-[0.25em] hover:bg-white/15 transition-colors"
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
        <title>Back</title>
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  );
}

/* ── Page ── */

type View = "home" | "library";

export default function Home() {
  const [weather, setWeather] = useState<Weather>("sunny");
  const [view, setView] = useState<View>("home");
  const [openBook, setOpenBook] = useState<{
    book: Book;
    rect: SpineRect;
    id: string;
  } | null>(null);

  const bgRef = useRef<HTMLDivElement>(null);
  const weatherContainerRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const transitioningRef = useRef(false);
  const navigatingRef = useRef(false);

  const handleOpen = useCallback((book: Book, rect: SpineRect, id: string) => {
    setOpenBook({ book, rect, id });
  }, []);

  const handleClose = useCallback(() => {
    setOpenBook(null);
  }, []);

  const handleNavigate = useCallback(
    (target: View) => {
      if (navigatingRef.current || target === view) return;
      navigatingRef.current = true;

      // slideRef is 200vw wide with two 100vw panels side-by-side.
      // xPercent: -50 shifts it left by 50% of its own (200vw) width = 100vw,
      // bringing the library panel into view.
      gsap.to(slideRef.current, {
        xPercent: target === "library" ? -50 : 0,
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => {
          setView(target);
          navigatingRef.current = false;
        },
      });
    },
    [view],
  );

  const handleWeatherChange = useCallback(
    (newWeather: Weather) => {
      if (newWeather === weather || transitioningRef.current) return;
      transitioningRef.current = true;

      const h = window.innerHeight;

      // Drop current weather off the bottom of the screen.
      gsap.to(weatherContainerRef.current, {
        y: h,
        duration: 0.45,
        ease: "power2.in",
        onComplete: () => {
          // Swap React state synchronously so the new weather mounts immediately.
          flushSync(() => {
            setWeather(newWeather);
          });
          // Park the container above the viewport, then slide it down into place.
          gsap.set(weatherContainerRef.current, { y: -h });
          // Crossfade the background color to match the new weather.
          gsap.to(bgRef.current, {
            backgroundColor: WEATHER_BG[newWeather],
            duration: 0.55,
            ease: "power2.out",
          });
          // New weather drops in from the top.
          gsap.to(weatherContainerRef.current, {
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            onComplete: () => {
              transitioningRef.current = false;
            },
          });
        },
      });
    },
    [weather],
  );

  return (
    <div
      ref={bgRef}
      className="min-h-screen font-body overflow-hidden relative"
      style={{ backgroundColor: WEATHER_BG.sunny }}
    >
      <div
        ref={weatherContainerRef}
        className="absolute inset-0 pointer-events-none"
      >
        {weather === "sunny" && <SunnyWeather />}
        {weather === "night" && <NightWeather />}
        {weather === "rain" && <RainWeather />}
        {weather === "snow" && <SnowWeather />}
      </div>

      <WeatherControls weather={weather} onChange={handleWeatherChange} />

      {/* Sliding container: 200vw wide with home + library as side-by-side panels.
          Animating one element (instead of two coordinated tweens) avoids any
          transform reconciliation issues. Initial x=0 shows home; x=-100vw shows library. */}
      <div
        ref={slideRef}
        className="absolute top-0 left-0 h-full flex"
        style={{ width: "200vw" }}
      >
        {/* Home panel */}
        <div className="relative w-screen h-full flex flex-col items-center justify-center shrink-0">
          <div className="text-center z-10 mb-12">
            <p className="font-label uppercase tracking-[0.5em] text-white/70 text-sm mb-2">
              A Year In
            </p>
            <h1 className="text-7xl md:text-8xl font-headline font-black text-white tracking-tight leading-none">
              BOOKS OF
              <br />
              2025
            </h1>
          </div>

          <div className="relative w-full max-w-6xl px-4 z-10">
            <div className="flex items-end justify-center gap-0">
              {books.map((book, i) => {
                const id = `home-${i}`;
                return (
                  <BookSpine
                    key={id}
                    book={book}
                    index={i}
                    onClick={(rect) => handleOpen(book, rect, id)}
                    isOpen={openBook?.id === id}
                  />
                );
              })}
            </div>
            <Shelf />
          </div>

          <HintIcon />
          <LibraryButton onClick={() => handleNavigate("library")} />
        </div>

        {/* Library panel */}
        <div className="relative w-screen h-full flex flex-col items-center justify-center shrink-0">
          {/* Warm indoor ambient overlay — dims the outside weather to feel like
              you're inside the library room rather than still outdoors. */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(20,10,5,0.55) 0%, rgba(5,3,2,0.85) 100%)",
            }}
          />
          <BackButton onClick={() => handleNavigate("home")} />
          <LibraryView openId={openBook?.id ?? null} onOpen={handleOpen} />
        </div>
      </div>

      {openBook && (
        <OpenBook
          book={openBook.book}
          onClose={handleClose}
          spineRect={openBook.rect}
        />
      )}
    </div>
  );
}
