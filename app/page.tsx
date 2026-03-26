"use client";

import { useState, useCallback, useRef, useEffect } from "react";

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
  { title: "THE CREATIVE ACT", author: "RUBIN", stars: 4, bgColor: "#1d1d2b", textColor: "text-white", width: 54, height: 360, titleSize: "text-[13px]", titleWeight: "font-bold", titleTracking: "tracking-widest" },
  { title: "NO MORE MR. NICE GUY", author: "GLOVER", stars: 3, bgColor: "#f8b486", textColor: "text-slate-800", width: 42, height: 310, titleSize: "text-[11px]", titleWeight: "font-bold", titleTracking: "tracking-tight" },
  { title: "YELLOWFACE", author: "KUANG", stars: 4, bgColor: "#fedc7f", textColor: "text-slate-900", starColor: "text-yellow-600", width: 54, height: 340, titleSize: "text-[13px]", titleWeight: "font-black", titleTracking: "tracking-widest" },
  { title: "THE SILENT PATIENT", author: "MICHAELIDES", stars: 3, bgColor: "#3e6080", textColor: "text-white", width: 48, height: 335, titleSize: "text-[12px]", titleWeight: "font-bold", titleTracking: "tracking-widest" },
  { title: "ALICE'S ADVENTURES IN WONDERLAND", author: "CARROLL", stars: 3, bgColor: "#4fa987", textColor: "text-white/90", width: 44, height: 335, titleSize: "text-[10px]", titleWeight: "font-medium", titleTracking: "tracking-tight" },
  { title: "THE GENTLEMAN FROM PERU", author: "ACIMAN", stars: 3, bgColor: "#ff4d4d", textColor: "text-white", width: 20, height: 260, titleSize: "text-[9px]", titleWeight: "font-bold", titleTracking: "tracking-tighter" },
  { title: "THE BOOK OF CLARITY", author: "CHOPRA", stars: 4, bgColor: "#7fa05a", textColor: "text-slate-100", width: 40, height: 285, titleSize: "text-[12px]", titleWeight: "font-bold", titleTracking: "tracking-tight" },
  { title: "BEFORE THE COFFEE GETS COLD", author: "KAWAGUCHI", stars: 4, bgColor: "#3b4b2a", textColor: "text-stone-200", width: 36, height: 285, titleSize: "text-[10px]", titleWeight: "font-bold", titleTracking: "tracking-tight" },
  { title: "THE HARD THING ABOUT HARD THINGS", author: "HOROWITZ", stars: 4, bgColor: "#f7b76e", textColor: "text-slate-800", width: 46, height: 310, titleSize: "text-[11px]", titleWeight: "font-bold", titleTracking: "tracking-tight" },
  { title: "GHACHAR GHOCHAR", author: "SHANBHAG", stars: 3, bgColor: "#fef5d6", textColor: "text-slate-800", starColor: "text-yellow-600", width: 34, height: 265, titleSize: "text-[11px]", titleWeight: "font-bold", titleTracking: "tracking-tight" },
  { title: "TINY EXPERIMENTS", author: "CUNFF", stars: 4, bgColor: "#002a46", textColor: "text-white", width: 50, height: 340, titleSize: "text-[13px]", titleWeight: "font-black", titleTracking: "tracking-[0.2em]" },
  { title: "PIRANESI", author: "CLARKE", stars: 3, bgColor: "#d72131", textColor: "text-white", width: 44, height: 320, titleSize: "text-[13px]", titleWeight: "font-black", titleTracking: "tracking-widest" },
  { title: "WHITE NIGHTS", author: "DOSTOEVSKY", stars: 4, bgColor: "#f89b21", textColor: "text-slate-800", width: 42, height: 320, titleSize: "text-[11px]", titleWeight: "font-black", titleTracking: "tracking-tight" },
  { title: "V FOR VENDETTA", author: "MOORE", stars: 3, bgColor: "#fecb4d", textColor: "text-slate-900", starColor: "text-orange-700", width: 50, height: 340, titleSize: "text-[14px]", titleWeight: "font-black", titleTracking: "tracking-widest" },
  { title: "OF MICE AND MEN", author: "STEINBECK", stars: 4, bgColor: "#8e54e9", textColor: "text-white", width: 34, height: 285, titleSize: "text-[10px]", titleWeight: "font-bold", titleTracking: "tracking-tight" },
  { title: "THE HOUSEKEEPER AND THE PROFESSOR", author: "OGAWA", stars: 5, bgColor: "#6eb7ff", textColor: "text-white", width: 40, height: 330, titleSize: "text-[10px]", titleWeight: "font-medium", titleTracking: "tracking-tight" },
  { title: "THE MEMORY POLICE", author: "OGAWA", stars: 4, bgColor: "#ff1a7f", textColor: "text-white", width: 46, height: 335, titleSize: "text-[12px]", titleWeight: "font-bold", titleTracking: "tracking-widest" },
  { title: "HATCHING TWITTER", author: "BILTON", stars: 4, bgColor: "#ffcc33", textColor: "text-slate-800", starColor: "text-orange-600", width: 48, height: 335, titleSize: "text-[13px]", titleWeight: "font-black", titleTracking: "tracking-widest" },
  { title: "THE FALL", author: "CAMUS", stars: 4, bgColor: "#004b66", textColor: "text-white", width: 34, height: 280, titleSize: "text-[11px]", titleWeight: "font-bold", titleTracking: "tracking-widest" },
  { title: "HOLES", author: "SACHAR", stars: 3, bgColor: "#40c4cc", textColor: "text-slate-900", width: 46, height: 310, titleSize: "text-[15px]", titleWeight: "font-black", titleTracking: "tracking-[0.3em]" },
  { title: "BLACK EDGE", author: "KOLHATKAR", stars: 5, bgColor: "#f89021", textColor: "text-slate-900", width: 46, height: 335, titleSize: "text-[13px]", titleWeight: "font-black", titleTracking: "tracking-widest" },
  { title: "COMPANY OF ONE", author: "JARVIS", stars: 4, bgColor: "#70647a", textColor: "text-white/80", width: 50, height: 310, titleSize: "text-[11px]", titleWeight: "font-bold", titleTracking: "tracking-widest" },
  { title: "GRIEF IS THE THING WITH FEATHERS", author: "PORTER", stars: 3, bgColor: "#e19a9a", textColor: "text-slate-900", width: 34, height: 260, titleSize: "text-[9px]", titleWeight: "font-bold", titleTracking: "tracking-tight" },
  { title: "THE HOUSEMAID'S SECRET", author: "MCFADDEN", stars: 4, bgColor: "#1d1d2b", textColor: "text-white", width: 50, height: 330, titleSize: "text-[12px]", titleWeight: "font-bold", titleTracking: "tracking-widest" },
];

/* ── Helpers ── */

function StarRating({ count, color }: { count: number; color?: string }) {
  return (
    <div className={`flex flex-col items-center gap-px ${color ?? "opacity-60"}`}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="material-symbols-outlined leading-none"
          style={{ fontSize: "10px", width: "10px", height: "10px" }}
        >
          star
        </span>
      ))}
    </div>
  );
}

function InlineStars({ count, color }: { count: number; color?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${color ?? "text-yellow-500"}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="material-symbols-outlined"
          style={{
            fontSize: "16px",
            fontVariationSettings: i < count ? "'FILL' 1" : "'FILL' 0",
            opacity: i < count ? 1 : 0.3,
          }}
        >
          star
        </span>
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
  const delay = `${index * 0.04}s`;

  const handleClick = () => {
    if (spineRef.current) {
      const r = spineRef.current.getBoundingClientRect();
      onClick({ x: r.x, y: r.y, width: r.width, height: r.height });
    }
  };

  return (
    <div className="book-enter" style={{ animationDelay: delay }}>
      <div className="book-hover" onClick={handleClick}>
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
          <div className={`text-vertical ${book.titleWeight} ${book.titleSize} ${book.titleTracking} grow pt-4 uppercase overflow-hidden min-h-0 whitespace-nowrap`}>
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
  const [closing, setClosing] = useState(false);

  const light = isLightColor(book.bgColor);
  const coverText = light ? "text-slate-900" : "text-white";
  const pagesBg = light ? darkenColor(book.bgColor, 0.05) : "#f5f0e8";

  // Center position
  const centerLeft = (typeof window !== "undefined" ? window.innerWidth : 1920) / 2 - BOOK_W / 2;
  const centerTop = (typeof window !== "undefined" ? window.innerHeight : 1080) / 2 - BOOK_H / 2;

  // Phase progression on open
  useEffect(() => {
    if (closing) return;
    // phase 0 → 1: lift from shelf (start immediately after mount + paint)
    const t0 = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase(1));
    });
    // phase 1 → 2: fly to center
    const t1 = setTimeout(() => setPhase(2), 400);
    // phase 2 → 3: open cover
    const t2 = setTimeout(() => setPhase(3), 1000);
    return () => {
      cancelAnimationFrame(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [closing]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setPhase(2); // close cover first
    setTimeout(() => setPhase(1), 500);  // shrink back to spine size
    setTimeout(() => setPhase(0), 900);  // drop back to shelf position
    setTimeout(() => onClose(), 1300);   // unmount after settled
  }, [onClose]);

  // Compute style per phase
  let bookStyle: React.CSSProperties;
  let backdropOpacity: number;
  let coverOpen: boolean;
  let showPages: boolean;

  const isSmall = phase <= 1;

  switch (phase) {
    case 0:
      bookStyle = {
        position: "fixed",
        left: spineRect.x,
        top: spineRect.y,
        width: spineRect.width,
        height: spineRect.height,
        transition: closing
          ? "left 0.35s ease-in, top 0.35s ease-in, width 0.35s ease-in, height 0.35s ease-in, opacity 0.35s ease-in"
          : "none",
        opacity: closing ? 0 : 1,
        zIndex: 60,
      };
      backdropOpacity = 0;
      coverOpen = false;
      showPages = false;
      break;
    case 1:
      bookStyle = {
        position: "fixed",
        left: spineRect.x,
        top: spineRect.y - 80,
        width: spineRect.width,
        height: spineRect.height,
        transition: closing
          ? "left 0.35s ease-in-out, top 0.35s ease-in-out, width 0.35s ease-in-out, height 0.35s ease-in-out"
          : "left 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.35s ease, height 0.35s ease",
        opacity: 1,
        zIndex: 60,
      };
      backdropOpacity = 0.2;
      coverOpen = false;
      showPages = false;
      break;
    case 2:
      bookStyle = {
        position: "fixed",
        left: centerLeft,
        top: centerTop,
        width: BOOK_W,
        height: BOOK_H,
        transition: closing
          ? "left 0.4s ease-in-out, top 0.4s ease-in-out, width 0.4s ease-in-out, height 0.4s ease-in-out"
          : "left 0.5s cubic-bezier(0.22, 1, 0.36, 1), top 0.5s cubic-bezier(0.22, 1, 0.36, 1), width 0.5s cubic-bezier(0.22, 1, 0.36, 1), height 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        opacity: 1,
        zIndex: 60,
      };
      backdropOpacity = 0.6;
      coverOpen = false;
      showPages = false;
      break;
    case 3:
    default:
      bookStyle = {
        position: "fixed",
        left: centerLeft,
        top: centerTop,
        width: BOOK_W,
        height: BOOK_H,
        transition: "left 0.5s ease, top 0.5s ease, width 0.5s ease, height 0.5s ease",
        opacity: 1,
        zIndex: 60,
      };
      backdropOpacity = 0.6;
      coverOpen = true;
      showPages = true;
      break;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black backdrop-blur-sm"
        style={{
          opacity: backdropOpacity,
          transition: "opacity 0.4s ease",
          pointerEvents: backdropOpacity > 0.3 ? "auto" : "none",
        }}
        onClick={handleClose}
      />

      {/* Book container — position/size transitions between phases */}
      <div style={{ ...bookStyle, perspective: "1200px" }}>
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

          {/* Pages (visible when cover opens) */}
          <div
            className={`absolute inset-0 overflow-hidden ${showPages && !closing ? "book-pages-in" : "book-pages-out"}`}
            style={{
              backgroundColor: pagesBg,
              transform: "translateZ(-2px)",
              left: "4px",
            }}
          >
            <div className="p-10 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <InlineStars count={book.stars} color={light ? "text-slate-700" : "text-yellow-600"} />
                  <span className="font-label text-xs text-slate-500 uppercase tracking-wider">
                    {book.stars} / 5
                  </span>
                </div>
                <div className="h-px bg-slate-300/50" />
                <p className="font-body text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;A book that stays with you long after the last page.&rdquo;
                </p>
                <div className="h-px bg-slate-300/50" />
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between font-label text-xs uppercase tracking-wider text-slate-500">
                    <span>Author</span>
                    <span className="text-slate-800 font-semibold">{book.author}</span>
                  </div>
                  <div className="flex justify-between font-label text-xs uppercase tracking-wider text-slate-500">
                    <span>Rating</span>
                    <span className="text-slate-800 font-semibold">
                      {"★".repeat(book.stars)}{"☆".repeat(5 - book.stars)}
                    </span>
                  </div>
                </div>
                <div className="pt-6 space-y-2.5">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="h-px bg-slate-300/30" style={{ width: `${85 - i * 3}%` }} />
                  ))}
                </div>
              </div>
              <div className="text-center font-label text-xs text-slate-400 tracking-widest">
                — 1 —
              </div>
            </div>
          </div>

          {/* Front cover (hinged left) */}
          <div
            className={`absolute inset-0 ${coverOpen ? "book-cover-open" : ""} ${closing && !coverOpen ? "book-cover-close" : ""}`}
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
                <div className={`text-vertical ${book.titleWeight} ${book.titleSize} ${book.titleTracking} grow pt-4 uppercase overflow-hidden min-h-0 whitespace-nowrap`}>
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
                  transition: isSmall ? "opacity 0.15s ease" : "opacity 0.3s ease 0.3s",
                  pointerEvents: "none",
                }}
              >
                <div className="flex flex-col items-center gap-6 text-center">
                  <div className="flex gap-1 opacity-70">
                    {Array.from({ length: book.stars }, (_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined"
                        style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
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
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                close
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/* ── PixelCloud ── */

function PixelCloud({ className, driftDelay }: { className: string; driftDelay: string }) {
  return (
    <div
      className={`pixel-cloud cloud-drift ${className}`}
      style={{ animationDelay: driftDelay }}
    />
  );
}

/* ── Page ── */

export default function Home() {
  const [openBook, setOpenBook] = useState<{ book: Book; rect: SpineRect } | null>(null);

  const handleOpen = useCallback((book: Book, rect: SpineRect) => {
    setOpenBook({ book, rect });
  }, []);

  const handleClose = useCallback(() => {
    setOpenBook(null);
  }, []);

  return (
    <div className="bg-primary min-h-screen flex flex-col items-center justify-center font-body overflow-hidden relative">
      <PixelCloud className="top-[10%] left-[15%] scale-75 opacity-80" driftDelay="0s" />
      <PixelCloud className="top-[35%] left-[38%] scale-50 opacity-90" driftDelay="2s" />
      <PixelCloud className="top-[15%] right-[5%] scale-125" driftDelay="4s" />
      <PixelCloud className="bottom-[40%] right-[2%] scale-90" driftDelay="6s" />

      <div className="text-center z-10 mb-12">
        <p className="font-label uppercase tracking-[0.5em] text-white/70 text-sm mb-2">
          A Year In
        </p>
        <h1 className="text-7xl md:text-8xl font-headline font-black text-white tracking-tight leading-none">
          BOOKS OF<br />2025
        </h1>
      </div>

      <div className="relative w-full max-w-6xl px-4 z-10">
        <div className="flex items-end justify-center gap-0">
          {books.map((book, i) => (
            <BookSpine
              key={book.title}
              book={book}
              index={i}
              onClick={(rect) => handleOpen(book, rect)}
              isOpen={openBook?.book.title === book.title}
            />
          ))}
        </div>
        <div className="shelf-fade">
          <div className="h-2 w-full bg-shelf-surface -mt-px relative z-20 shadow-2xl" />
          <div className="h-8 w-full bg-black/20 blur-md absolute -bottom-4 left-0" />
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 hint-bounce opacity-60">
        <span className="material-symbols-outlined text-white" style={{ fontSize: "36px" }}>
          pan_tool_alt
        </span>
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
