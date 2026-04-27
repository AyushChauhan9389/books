"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useCallback, useRef, useState } from "react";
import type { Book } from "./books-data";

gsap.registerPlugin(useGSAP);

/* ── Helpers ── */

export type SpineRect = { x: number; y: number; width: number; height: number };

export function StarIcon({
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

export function StarRating({ count, color }: { count: number; color?: string }) {
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

export function InlineStars({ count, color }: { count: number; color?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${color ?? "text-yellow-500"}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} size={16} filled={i < count} />
      ))}
    </div>
  );
}

export function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.floor(((num >> 16) & 255) * (1 - amount)));
  const g = Math.max(0, Math.floor(((num >> 8) & 255) * (1 - amount)));
  const b = Math.max(0, Math.floor((num & 255) * (1 - amount)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export function isLightColor(hex: string): boolean {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return r * 0.299 + g * 0.587 + b * 0.114 > 150;
}

/* ── BookSpine ── */

export function BookSpine({
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
        duration: 0.25,
        delay: index * 0.015,
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

export function OpenBook({
  book,
  onClose,
  spineRect,
}: {
  book: Book;
  onClose: () => void;
  spineRect: SpineRect;
}) {
  const [phase, setPhase] = useState(0);
  const closingRef = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const frontCoverRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const openTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const light = isLightColor(book.bgColor);
  const coverText = light ? "text-slate-900" : "text-white";
  const pagesBg = "#f5f0e8";

  const centerLeft =
    (typeof window !== "undefined" ? window.innerWidth : 1920) / 2 - BOOK_W / 2;
  const centerTop =
    (typeof window !== "undefined" ? window.innerHeight : 1080) / 2 -
    BOOK_H / 2;

  useGSAP(
    () => {
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

      tl.to(containerRef.current, {
        top: spineRect.y - 80,
        duration: 0.35,
        ease: "back.out(1.7)",
        onStart: () => setPhase(1),
      });
      tl.to(
        backdropRef.current,
        { opacity: 0.2, duration: 0.4, ease: "power1.out" },
        "<",
      );

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
        { opacity: 0.6, duration: 0.4, ease: "power1.out" },
        "<",
      );

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
        { opacity: 1, x: 0, duration: 0.3, ease: "power1.out" },
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

    tl.to(frontCoverRef.current, {
      rotateY: 0,
      duration: 0.35,
      ease: "power1.in",
      onStart: () => setPhase(2),
    });
    tl.to(
      pagesRef.current,
      { opacity: 0, duration: 0.2, ease: "power1.in" },
      "<",
    );

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
      { opacity: 0.2, duration: 0.4, ease: "power1.inOut" },
      "<",
    );

    tl.to(containerRef.current, {
      top: spineRect.y,
      opacity: 0,
      duration: 0.35,
      ease: "power1.in",
      onStart: () => setPhase(0),
    });
    tl.to(
      backdropRef.current,
      { opacity: 0, duration: 0.35, ease: "power1.in" },
      "<",
    );
  }, [onClose, spineRect]);

  const isSmall = phase <= 1;

  return (
    <>
      <div
        ref={backdropRef}
        className="fixed inset-0 z-50 bg-black backdrop-blur-sm"
        style={{ opacity: 0, pointerEvents: phase >= 2 ? "auto" : "none" }}
        onClick={handleClose}
      />

      <div
        ref={containerRef}
        style={{ position: "fixed", zIndex: 60, perspective: "1200px" }}
      >
        <div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: darkenColor(book.bgColor, 0.15),
              transform: "translateZ(-4px)",
              boxShadow: "4px 8px 32px rgba(0,0,0,0.4)",
            }}
          />

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

          <div
            ref={frontCoverRef}
            className="absolute inset-0"
            style={{
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            <div
              className={`absolute inset-0 overflow-hidden ${coverText}`}
              style={{
                backgroundColor: book.bgColor,
                backfaceVisibility: "hidden",
                boxShadow: "2px 0 12px rgba(0,0,0,0.2)",
              }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-[6px]"
                style={{ backgroundColor: darkenColor(book.bgColor, 0.2) }}
              />

              <div
                className={`absolute inset-0 flex flex-col items-center justify-between py-4 overflow-hidden ${book.textColor}`}
                style={{
                  opacity: isSmall && spineRect.height > spineRect.width * 3 ? 1 : 0,
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

            <div
              className="absolute inset-0"
              style={{
                backgroundColor: darkenColor(book.bgColor, 0.1),
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
              }}
            />
          </div>

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
