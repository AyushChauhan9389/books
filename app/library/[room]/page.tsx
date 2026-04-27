"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useParams, notFound } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { ViewTransition } from "react";
import { books } from "../../books-data";
import type { Book } from "../../books-data";
import { OpenBook } from "../../components";
import type { SpineRect } from "../../components";
import { LibraryFrame, LibraryShelf, rotateBooks, BackButton } from "../library-components";

gsap.registerPlugin(useGSAP);

export default function RoomPage() {
  const params = useParams();
  const room = params.room as string;

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

  let shelfData;
  if (room === "fiction") {
    shelfData = { offset: 0, shelfIndex: 0, label: "Section I · Fiction" };
  } else if (room === "essays") {
    shelfData = { offset: 9, shelfIndex: 1, label: "Section II · Essays" };
  } else if (room === "classics") {
    shelfData = { offset: 17, shelfIndex: 2, label: "Section III · Classics" };
  } else {
    return notFound();
  }

  const roomBooks = rotateBooks(books, shelfData.offset);

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
      <div className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Warm indoor ambient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(20,10,5,0.55) 0%, rgba(5,3,2,0.85) 100%)",
          }}
        />

        <BackButton href="/library" label="Back to Reception" />

        <div className="relative w-full max-w-[1200px] px-6 z-10 pt-10">
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
              {room}
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
            <LibraryShelf
              shelf={roomBooks}
              shelfIndex={shelfData.shelfIndex}
              openId={openBook?.id ?? null}
              onOpen={handleOpen}
              label={shelfData.label}
            />
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
