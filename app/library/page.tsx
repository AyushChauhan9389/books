"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { ViewTransition } from "react";
import { books } from "../books-data";
import type { Book } from "../books-data";
import { BookSpine, OpenBook } from "../components";
import type { SpineRect } from "../components";

gsap.registerPlugin(useGSAP);

/* ── Helpers ── */

function rotateBooks(offset: number): Book[] {
  return [...books.slice(offset), ...books.slice(0, offset)];
}

const LIB_SCALE = 0.55;
const LIB_SHELF_H = Math.round(400 * LIB_SCALE);

/* ── MinecraftDecoration ── */

function MinecraftDecoration({
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

function LibraryFrame({ children }: { children: React.ReactNode }) {
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

function BackButton() {
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

  return (
    <div ref={ref} className="absolute top-6 left-6 z-30">
      <Link
        href="/"
        onClick={(e) => {
          e.preventDefault();
          router.push("/", {
            transitionTypes: ["navigate-back"],
          });
        }}
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
          <title>Back</title>
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </Link>
    </div>
  );
}

/* ── Library Page ── */

export default function LibraryPage() {
  const [openBook, setOpenBook] = useState<{
    book: Book;
    rect: SpineRect;
    id: string;
  } | null>(null);

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

  const handleOpen = useCallback((book: Book, rect: SpineRect, id: string) => {
    setOpenBook({ book, rect, id });
  }, []);

  const handleClose = useCallback(() => {
    setOpenBook(null);
  }, []);

  const shelves = [
    { offset: 0, books: rotateBooks(0), label: "Section I · Fiction" },
    { offset: 9, books: rotateBooks(9), label: "Section II · Essays" },
    { offset: 17, books: rotateBooks(17), label: "Section III · Classics" },
  ];

  return (
    <ViewTransition
      default="auto"
      enter={{
        "navigate-forward": "slide-forward",
        "navigate-back": "slide-back",
        default: "auto",
      }}
      exit={{
        "navigate-forward": "slide-forward",
        "navigate-back": "slide-back",
        default: "auto",
      }}
      update="none"
    >
      <div className="relative w-screen h-screen flex flex-col items-center justify-center">
        {/* Warm indoor ambient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(20,10,5,0.55) 0%, rgba(5,3,2,0.85) 100%)",
          }}
        />

        <BackButton />

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
                textShadow:
                  "0 4px 12px rgba(0,0,0,0.8), 0 1px 0 #130a05",
              }}
            >
              LIBRARY
            </h1>
            <svg
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[150px] opacity-20 pointer-events-none"
              viewBox="0 0 600 150"
            >
              <path
                d="M50,75 L250,75 M350,75 L550,75"
                stroke="#c9a86a"
                strokeWidth="1"
              />
              <circle cx="50" cy="75" r="4" fill="#c9a86a" />
              <circle cx="550" cy="75" r="4" fill="#c9a86a" />
              <path
                d="M280,75 L300,55 L320,75 L300,95 Z"
                fill="none"
                stroke="#c9a86a"
                strokeWidth="2"
              />
            </svg>
          </div>

          <LibraryFrame>
            {shelves.map((shelf) => (
              <LibraryShelf
                key={shelf.offset}
                shelf={shelf.books}
                shelfIndex={shelves.indexOf(shelf)}
                openId={openBook?.id ?? null}
                onOpen={handleOpen}
                label={shelf.label}
              />
            ))}
          </LibraryFrame>
        </div>

        {openBook && (
          <OpenBook
            book={openBook.book}
            onClose={handleClose}
            spineRect={openBook.rect}
          />
        )}
      </div>
    </ViewTransition>
  );
}
