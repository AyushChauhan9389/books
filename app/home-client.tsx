"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { ViewTransition } from "react";
import type { Book } from "@/lib/types";
import { BookSpine, OpenBook } from "./components";
import type { SpineRect } from "./components";

/** Converts null starColor to undefined for compatibility with BookSpine/OpenBook */
function toComponentBook(book: Book) {
  return { ...book, starColor: book.starColor ?? undefined };
}

gsap.registerPlugin(useGSAP);

/* ── Shelf ── */

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

/* ── LibraryButton ── */

function LibraryButton() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    <div ref={ref} className="absolute bottom-12 right-12 z-30">
      <Link
        href="/library"
        onClick={(e) => {
          e.preventDefault();
          router.push("/library", {
            transitionTypes: ["navigate-forward"],
          });
        }}
        className="flex items-center gap-3 px-5 py-3 bg-black/25 backdrop-blur-md border border-white/15 rounded-full text-white font-label text-xs uppercase tracking-[0.25em] hover:bg-white/15 transition-colors"
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
      </Link>
    </div>
  );
}

/* ── HomeClient ── */

export default function HomeClient({ books }: { books: Book[] }) {
  const [openBook, setOpenBook] = useState<{
    book: Book;
    rect: SpineRect;
    id: string;
  } | null>(null);

  const handleOpen = useCallback((book: Book, rect: SpineRect, id: string) => {
    setOpenBook({ book, rect, id });
  }, []);

  const handleClose = useCallback(() => {
    setOpenBook(null);
  }, []);

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
        <div className="text-center z-10 mb-12">
          <p className="font-label uppercase tracking-[0.5em] text-white/70 text-sm mb-2">
            A Year In
          </p>
          <h1 className="text-7xl md:text-8xl font-headline font-black text-white tracking-tight leading-none">
            PROMPTS OF
            <br />
            2026
          </h1>
        </div>

        <div className="relative w-full max-w-6xl px-4 z-10">
          <div className="flex items-end justify-center gap-0">
            {books.map((book, i) => {
              const id = `home-${i}`;
              return (
                <BookSpine
                  key={id}
                  book={toComponentBook(book)}
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
        <LibraryButton />

        {openBook && (
          <OpenBook
            book={toComponentBook(openBook.book)}
            onClose={handleClose}
            spineRect={openBook.rect}
          />
        )}
      </div>
    </ViewTransition>
  );
}
