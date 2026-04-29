"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { ViewTransition } from "react";
import type { Book } from "@/lib/types";
import { OpenBook } from "../../components";
import type { SpineRect } from "../../components";
import { LibraryFrame, LibraryShelf, BackButton } from "../library-components";

gsap.registerPlugin(useGSAP);

/** Converts null starColor to undefined for compatibility with BookSpine/OpenBook */
function toComponentBook(book: Book) {
  return { ...book, starColor: book.starColor ?? undefined };
}

export default function RoomClient({
  books,
  collectionName,
  slug,
}: {
  books: Book[];
  collectionName: string;
  slug: string;
}) {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const backHref = from === "search" ? "/library/search" : "/library";
  const backLabel = from === "search" ? "Back to Search" : "Back to Reception";

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

  const componentBooks = books.map(toComponentBook);

  // Split books across multiple shelves (~8 per shelf)
  const BOOKS_PER_SHELF = 8;
  const shelves: (typeof componentBooks)[] = [];
  for (let i = 0; i < componentBooks.length; i += BOOKS_PER_SHELF) {
    shelves.push(componentBooks.slice(i, i + BOOKS_PER_SHELF));
  }

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
      <div className="relative w-screen min-h-screen overflow-auto flex flex-col items-center">
        {/* Warm indoor ambient overlay */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(20,10,5,0.55) 0%, rgba(5,3,2,0.85) 100%)",
          }}
        />

        <BackButton href={backHref} label={backLabel} />

        <div className="relative w-full max-w-[1200px] px-6 z-10 pt-10 pb-16">
          <div ref={headingRef} className="text-center mb-8 relative">
            <p
              className="font-label uppercase tracking-[0.55em] text-xs mb-2 relative z-10"
              style={{ color: "#c9a86a" }}
            >
              Room
            </p>
            <h1
              className="font-headline font-black tracking-[0.15em] leading-none text-5xl md:text-6xl relative z-10 uppercase"
              style={{
                color: "#f5e9cf",
                textShadow:
                  "0 4px 12px rgba(0,0,0,0.8), 0 1px 0 #130a05",
              }}
            >
              {slug}
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
            {shelves.map((shelf, index) => (
              <LibraryShelf
                key={index}
                shelf={shelf}
                shelfIndex={index}
                openId={openBook?.id ?? null}
                onOpen={(book, rect, id) => handleOpen(book as Book, rect, id)}
                label={index === 0 ? collectionName : `${collectionName} · ${index + 1}`}
              />
            ))}
          </LibraryFrame>
        </div>

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
