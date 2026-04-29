"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { ViewTransition } from "react";
import { useRouter } from "next/navigation";
import type { Book, CollectionWithBooks } from "@/lib/types";
import { OpenBook, darkenColor } from "../../components";
import type { SpineRect } from "../../components";
import { BackButton } from "../library-components";

gsap.registerPlugin(useGSAP);

/** Converts null starColor to undefined for compatibility with OpenBook */
function toComponentBook(book: Book) {
  return { ...book, starColor: book.starColor ?? undefined };
}

/* ── Pixel art decorations ── */

function PixelCandle() {
  return (
    <svg width="16" height="32" viewBox="0 0 4 8" style={{ imageRendering: "pixelated" }}>
      <rect x="1" y="0" width="2" height="1" fill="#ffdd44" opacity="0.9" />
      <rect x="1" y="1" width="2" height="1" fill="#ff9922" />
      <rect x="1" y="2" width="2" height="1" fill="#ffcc33" opacity="0.5" />
      <rect x="1" y="2" width="2" height="4" fill="#f5e9cf" />
      <rect x="0" y="6" width="4" height="2" fill="#c9a86a" />
    </svg>
  );
}

function PixelQuill() {
  return (
    <svg width="28" height="56" viewBox="0 0 7 14" style={{ imageRendering: "pixelated" }}>
      <rect x="5" y="0" width="2" height="1" fill="#e8ddd0" />
      <rect x="4" y="1" width="3" height="1" fill="#d4c3a3" />
      <rect x="4" y="2" width="2" height="1" fill="#c9b896" />
      <rect x="3" y="3" width="2" height="1" fill="#b8a47a" />
      <rect x="3" y="4" width="1" height="3" fill="#8b7355" />
      <rect x="2" y="7" width="1" height="3" fill="#8b7355" />
      <rect x="1" y="10" width="1" height="2" fill="#6b5540" />
      <rect x="0" y="12" width="1" height="2" fill="#2a1810" />
    </svg>
  );
}

function FloatingParticle({ delay, x }: { delay: number; x: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(ref.current, { y: 0, opacity: 0 }, {
      y: -60, opacity: 0.6, duration: 3, delay, repeat: -1, ease: "sine.inOut", yoyo: true,
    });
  }, { dependencies: [] });
  return (
    <div ref={ref} className="absolute bottom-0 w-1 h-1 rounded-full bg-[#c9a86a]" style={{ left: `${x}%`, opacity: 0 }} />
  );
}

/* ── Category card for the category row ── */

function MiniShelfCategory({
  collection,
  isMatch,
  liftPx,
  isTargeted,
}: {
  collection: CollectionWithBooks;
  isMatch: boolean;
  liftPx: number;
  isTargeted: boolean;
}) {
  const router = useRouter();
  const scale = isMatch ? (isTargeted ? 1.15 : 1 + liftPx / 400) : 0.85;
  const collectionBooks = collection.books;

  return (
    <div
      onClick={() => router.push(`/library/${collection.slug}?from=search`, { transitionTypes: ["navigate-forward"] })}
      className="shrink-0 cursor-pointer group self-end flex flex-col items-center"
      style={{
        transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        opacity: isMatch ? 1 : 0.2,
        transform: isMatch
          ? `translateY(-${liftPx}px) scale(${scale})`
          : "translateY(0) scale(0.85)",
      }}
    >
      <div className="relative">
        {isTargeted && (
          <div className="absolute -inset-3 pointer-events-none z-20">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#c9a86a]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#c9a86a]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#c9a86a]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#c9a86a]" />
          </div>
        )}
        <div
          className="rounded-sm overflow-hidden flex flex-col group-hover:scale-105 transition-all"
          style={{
            width: 88,
            height: 110,
            backgroundColor: "#1a0f0a",
            border: "1px solid #c9a86a33",
            boxShadow: isTargeted
              ? "0 8px 24px rgba(201,168,106,0.25), 0 4px 12px rgba(0,0,0,0.7)"
              : isMatch
                ? "0 4px 16px rgba(0,0,0,0.5)"
                : "0 2px 4px rgba(0,0,0,0.3)",
            transition: "box-shadow 0.4s ease",
          }}
        >
          {/* Mini book spines */}
          <div className="flex items-end justify-center gap-[1px] px-2 pt-3 flex-1">
            {collectionBooks.slice(0, 8).map((book, i) => (
              <div
                key={`${collection.name}-spine-${i}`}
                className="rounded-t-[1px]"
                style={{
                  width: 6,
                  height: 20 + (book.height / 360) * 30,
                  backgroundColor: book.bgColor,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
          {/* Shelf line */}
          <div style={{ height: 2, background: "#4a2d1a", margin: "0 6px" }} />
          {/* Label */}
          <div className="flex flex-col items-center justify-center py-2 px-1">
            <span className="font-label text-[8px] tracking-[0.15em] uppercase text-[#c9a86a] whitespace-nowrap">
              {collection.name}
            </span>
            <span className="font-label text-[6px] tracking-[0.1em] uppercase text-[#c9a86a]/40 mt-0.5">
              {collectionBooks.length} tomes
            </span>
          </div>
        </div>
      </div>
      <div className={`mt-1.5 transition-opacity pointer-events-none ${isTargeted ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <p className="font-label text-[8px] tracking-[0.1em] text-[#c9a86a] text-center whitespace-nowrap">
          {collection.name} Room
        </p>
      </div>
    </div>
  );
}


function MiniBook({
  book,
  index,
  isMatch,
  liftPx,
  isTargeted,
  onOpen,
  innerRef,
}: {
  book: Book;
  index: number;
  isMatch: boolean;
  liftPx: number;
  isTargeted: boolean;
  onOpen: (book: Book, rect: SpineRect) => void;
  innerRef?: React.Ref<HTMLDivElement>;
}) {
  const coverRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (coverRef.current) {
      const r = coverRef.current.getBoundingClientRect();
      onOpen(book, { x: r.x, y: r.y, width: r.width, height: r.height });
    }
  };

  const scale = isMatch ? (isTargeted ? 1.6 : 1 + liftPx / 200) : 0.85;
  const w = isTargeted ? 80 : 64;
  const h = isTargeted ? 110 : 88;

  return (
    <div
      ref={innerRef}
      data-book-index={index}
      onClick={handleClick}
      className="shrink-0 cursor-pointer group self-end"
      style={{
        transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        opacity: isMatch ? 1 : 0.2,
        transform: isMatch
          ? `translateY(-${liftPx}px) scale(${scale})`
          : "translateY(0) scale(0.85)",
      }}
    >
      {/* Targeting brackets */}
      <div className="relative">
        {isTargeted && (
          <div
            className="absolute -inset-3 pointer-events-none z-20"
            style={{
              transition: "opacity 0.4s ease",
              opacity: 1,
            }}
          >
            {/* Top-left corner */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#c9a86a]" />
            {/* Top-right corner */}
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#c9a86a]" />
            {/* Bottom-left corner */}
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#c9a86a]" />
            {/* Bottom-right corner */}
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#c9a86a]" />
          </div>
        )}

        <div
          ref={coverRef}
          className="relative rounded-sm overflow-hidden flex flex-col items-center justify-between py-2 px-1 group-hover:scale-110 transition-all"
          style={{
            width: w,
            height: h,
            backgroundColor: book.bgColor,
            boxShadow: isTargeted
              ? `0 8px 32px ${book.bgColor}77, 0 0 20px ${book.bgColor}44, 0 4px 12px rgba(0,0,0,0.7)`
              : isMatch
                ? `0 ${4 + liftPx / 4}px ${16 + liftPx / 2}px ${book.bgColor}55, 0 2px 8px rgba(0,0,0,0.6)`
                : "0 2px 4px rgba(0,0,0,0.3)",
            transition: "width 0.4s ease, height 0.4s ease, box-shadow 0.4s ease",
          }}
        >
        {/* Spine edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ backgroundColor: darkenColor(book.bgColor, 0.25) }}
        />
        {/* Stars */}
        <div className="flex gap-px z-10">
          {Array.from({ length: book.stars }).map((_, i) => (
            <span key={i} className={`text-[5px] ${book.textColor}`}>★</span>
          ))}
        </div>
        {/* Title */}
        <p className={`text-[6px] font-bold leading-tight text-center z-10 ${book.textColor}`}>
          {book.title.length > 20 ? `${book.title.slice(0, 20)}…` : book.title}
        </p>
        {/* Author */}
        <p className={`text-[5px] opacity-60 z-10 ${book.textColor}`}>
          {book.author}
        </p>
      </div>
      </div>
      {/* Title label — always visible when targeted */}
      <div className={`mt-1.5 transition-opacity pointer-events-none ${isTargeted ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <p className="font-label text-[8px] tracking-[0.1em] text-[#c9a86a] text-center whitespace-nowrap max-w-20 truncate">
          {book.title}
        </p>
      </div>
    </div>
  );
}

/* ── Horizontal scrolling category row ── */

function CategoryRow({ query, collections }: { query: string; collections: CollectionWithBooks[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const matchingCategories = useMemo(() => {
    if (!query.trim()) return new Set(collections.map((_, i) => i));
    const q = query.toLowerCase();
    const set = new Set<number>();
    collections.forEach((c, i) => {
      if (c.name.toLowerCase().includes(q)) set.add(i);
    });
    return set;
  }, [query, collections]);

  const isSearching = query.trim().length > 0;
  const liftPx = isSearching && matchingCategories.size > 0
    ? Math.round(10 + (1 - matchingCategories.size / collections.length) * 30)
    : 0;

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={trackRef}
        className="flex items-end justify-center gap-4 px-6 pt-16 pb-4 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {collections.map((col, i) => (
          <MiniShelfCategory
            key={col.id}
            collection={col}
            isMatch={matchingCategories.has(i)}
            liftPx={matchingCategories.has(i) ? liftPx : 0}
            isTargeted={matchingCategories.has(i) && matchingCategories.size === 1 && isSearching}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Horizontal scrolling book row ── */

function BookRow({
  query,
  onOpen,
  books,
}: {
  query: string;
  onOpen: (book: Book, rect: SpineRect) => void;
  books: Book[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const bookRefs = useRef<(HTMLDivElement | null)[]>([]);
  const marqueeRef = useRef<gsap.core.Tween | null>(null);

  const matchIndices = useMemo(() => {
    if (!query.trim()) return new Set(books.map((_, i) => i));
    const q = query.toLowerCase();
    const set = new Set<number>();
    books.forEach((b, i) => {
      if (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) {
        set.add(i);
      }
    });
    return set;
  }, [query, books]);

  const matchCount = matchIndices.size;
  const isSearching = query.trim().length > 0;
  const liftPx = isSearching && matchCount > 0
    ? Math.round(20 + (1 - matchCount / books.length) * 60)
    : 0;

  // Auto-scroll marquee when not searching
  useGSAP(() => {
    if (!trackRef.current) return;
    // We need the full scrollable width
    const track = trackRef.current;
    const totalWidth = track.scrollWidth - track.clientWidth;

    if (totalWidth <= 0) return;

    const tween = gsap.to(track, {
      scrollLeft: totalWidth,
      duration: 30,
      ease: "none",
      repeat: -1,
      yoyo: true,
    });
    marqueeRef.current = tween;

    return () => { tween.kill(); };
  }, { dependencies: [] });

  // Pause marquee and scroll to first match when searching
  useEffect(() => {
    if (isSearching) {
      marqueeRef.current?.pause();

      // Find first matching book index
      const firstMatch = books.findIndex((b) => {
        const q = query.toLowerCase();
        return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      });

      if (firstMatch >= 0 && bookRefs.current[firstMatch] && trackRef.current) {
        const el = bookRefs.current[firstMatch];
        const track = trackRef.current;
        if (el) {
          const targetScroll = el.offsetLeft - track.clientWidth / 2 + el.offsetWidth / 2;
          gsap.to(track, {
            scrollLeft: Math.max(0, targetScroll),
            duration: 0.6,
            ease: "power2.out",
          });
        }
      }
    } else {
      marqueeRef.current?.resume();
    }
  }, [query, isSearching, books]);

  return (
    <div className="relative w-screen -mx-6 -mt-40 overflow-visible">
      {/* Fade edges */}
      <div className="absolute left-0 top-40 bottom-0 w-16 bg-gradient-to-r from-[#0a0502] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-40 bottom-0 w-16 bg-gradient-to-l from-[#0a0502] to-transparent z-10 pointer-events-none" />

      <div
        ref={trackRef}
        className="flex items-end gap-3 px-20 pt-40 pb-4 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {books.map((book, i) => (
          <MiniBook
            key={`${book.title}-${book.author}`}
            book={book}
            index={i}
            isMatch={matchIndices.has(i)}
            liftPx={matchIndices.has(i) ? liftPx : 0}
            isTargeted={matchIndices.has(i) && matchCount === 1}
            onOpen={onOpen}
            innerRef={(el) => { bookRefs.current[i] = el; }}
          />
        ))}
      </div>
    </div>
  );
}


/* ── Main SearchClient Component ── */

export default function SearchClient({
  books,
  collections,
}: {
  books: Book[];
  collections: CollectionWithBooks[];
}) {
  const [query, setQuery] = useState("");
  const [openBook, setOpenBook] = useState<{
    book: Book;
    rect: SpineRect;
  } | null>(null);

  const headingRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const candleLeftRef = useRef<HTMLDivElement>(null);
  const candleRightRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(headingRef.current, {
      opacity: 0, y: -10, duration: 0.6, delay: 0.4, ease: "power2.out",
    });
    gsap.from(scrollRef.current, {
      opacity: 0, scaleY: 0, duration: 0.6, delay: 0.5, ease: "back.out(1.4)", transformOrigin: "top center",
    });
    gsap.from(inputRef.current, {
      opacity: 0, y: 8, duration: 0.4, delay: 0.8, ease: "power2.out",
    });
    [candleLeftRef, candleRightRef].forEach((ref) => {
      gsap.to(ref.current, {
        opacity: 0.7, duration: 0.3 + Math.random() * 0.4, repeat: -1, yoyo: true, ease: "sine.inOut",
      });
    });
  }, { dependencies: [] });

  const matchCount = useMemo(() => {
    if (!query.trim()) return books.length + collections.length;
    const q = query.toLowerCase();
    const bookMatches = books.filter(
      (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q),
    ).length;
    const catMatches = collections.filter(
      (c) => c.name.toLowerCase().includes(q),
    ).length;
    return bookMatches + catMatches;
  }, [query, books, collections]);

  const handleOpen = useCallback((book: Book, rect: SpineRect) => {
    setOpenBook({ book, rect });
  }, []);

  const handleClose = useCallback(() => {
    setOpenBook(null);
  }, []);

  return (
    <ViewTransition
      default="auto"
      enter={{ "navigate-forward": "slide-forward", "navigate-back": "slide-back", default: "auto" }}
      exit={{ "navigate-forward": "slide-forward", "navigate-back": "slide-back", default: "auto" }}
      update="none"
    >
      <div className="relative w-screen h-screen flex flex-col items-center overflow-x-hidden overflow-y-auto">
        {/* Background */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center top, rgba(30,18,10,0.6) 0%, rgba(5,3,2,0.92) 100%)" }}
        />

        {/* Floating dust particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[12, 28, 45, 62, 78, 88].map((x, i) => (
            <FloatingParticle key={i} delay={i * 0.7} x={x} />
          ))}
        </div>

        <BackButton href="/library" label="Back to Reception" />

        <div className="relative w-full max-w-[750px] px-6 z-10 pt-16 flex flex-col items-center">
          {/* Header */}
          <div ref={headingRef} className="text-center mb-4 relative">
            <p className="font-label uppercase tracking-[0.55em] text-xs mb-2" style={{ color: "#c9a86a" }}>
              The Archives
            </p>
            <h1
              className="font-headline font-black tracking-[0.15em] leading-none text-5xl md:text-6xl"
              style={{ color: "#f5e9cf", textShadow: "0 4px 12px rgba(0,0,0,0.8), 0 1px 0 #130a05" }}
            >
              SEARCH
            </h1>
            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[120px] opacity-15 pointer-events-none" viewBox="0 0 500 120">
              <path d="M40,60 L200,60 M300,60 L460,60" stroke="#c9a86a" strokeWidth="1" />
              <circle cx="40" cy="60" r="3" fill="#c9a86a" />
              <circle cx="460" cy="60" r="3" fill="#c9a86a" />
              <path d="M230,60 L250,42 L270,60 L250,78 Z" fill="none" stroke="#c9a86a" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Open scroll search area */}
          <div ref={scrollRef} className="relative w-full mb-4">
            <div ref={candleLeftRef} className="absolute -left-8 top-2 z-20">
              <PixelCandle />
            </div>
            <div ref={candleRightRef} className="absolute -right-8 top-2 z-20">
              <PixelCandle />
            </div>

            <div className="relative">
              <div className="h-4 rounded-t-full" style={{ background: "linear-gradient(to bottom, #b8944f, #c9a86a, #a07830)" }} />
              <div
                className="relative px-8 py-6"
                style={{
                  background: "linear-gradient(to bottom, #f5e9cf, #ede0c8, #f5e9cf)",
                  boxShadow: "inset 0 2px 8px rgba(0,0,0,0.1), inset 0 -2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <div className="absolute top-3 right-6 opacity-40">
                  <PixelQuill />
                </div>
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23000' stroke-width='0.5'/%3E%3C/svg%3E")`,
                }} />
                <div ref={inputRef}>
                  <label className="block font-label text-[10px] tracking-[0.3em] uppercase text-[#4a3520] mb-2 font-semibold">
                    Seek a tome...
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a4030]" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <title>Search</title>
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Title or author..."
                      className="w-full pl-10 pr-4 py-2.5 rounded bg-[#ede0c8]/60 border border-[#8b7355]/50 text-[#1a0f0a] font-body text-sm placeholder:text-[#6b5540] focus:outline-none focus:border-[#5a4030] focus:bg-[#f5e9cf]/80 transition-colors"
                    />
                  </div>
                  <p className="mt-2 font-label text-[9px] tracking-[0.2em] text-[#4a3520]">
                    {matchCount} {matchCount === 1 ? "tome" : "tomes"} found in the archives
                  </p>
                </div>
              </div>
              <div className="h-4 rounded-b-full" style={{ background: "linear-gradient(to top, #b8944f, #c9a86a, #a07830)" }} />
            </div>
          </div>
        </div>

        {/* Category row */}
        <div className="relative z-10 w-full">
          <p className="font-label text-[9px] tracking-[0.3em] uppercase text-[#c9a86a]/50 text-center mb-1">Rooms</p>
          <CategoryRow query={query} collections={collections} />
        </div>

        {/* Book row — full width, fills remaining space */}
        <div className="relative z-10 mt-auto w-full">
          <p className="font-label text-[9px] tracking-[0.3em] uppercase text-[#c9a86a]/50 text-center mb-1">Tomes</p>
          <BookRow query={query} onOpen={handleOpen} books={books} />
          {matchCount === 0 && (
            <p className="text-center font-label text-sm text-[#c9a86a]/40 mt-4">
              No tomes match thy query
            </p>
          )}
        </div>

        {openBook && (
          <OpenBook book={toComponentBook(openBook.book)} onClose={handleClose} spineRect={openBook.rect} />
        )}
      </div>
    </ViewTransition>
  );
}
