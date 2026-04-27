"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { ViewTransition } from "react";
import { BackButton } from "./library-components";

import { MinecraftSkin } from "../minecraft-skin";

gsap.registerPlugin(useGSAP);

/* ── Pixel Desk Props ── */

function PixelLamp() {
  return (
    <svg width="40" height="64" viewBox="0 0 10 16" style={{ imageRendering: "pixelated" }}>
      {/* Shade */}
      <rect x="1" y="0" width="8" height="1" fill="#c9a86a" />
      <rect x="0" y="1" width="10" height="1" fill="#c9a86a" />
      <rect x="0" y="2" width="10" height="1" fill="#b8944f" />
      <rect x="1" y="3" width="8" height="1" fill="#a07830" />
      {/* Glow */}
      <rect x="3" y="4" width="4" height="1" fill="#fff4d6" opacity="0.6" />
      {/* Pole */}
      <rect x="4" y="4" width="2" height="8" fill="#3d3d3d" />
      {/* Base */}
      <rect x="2" y="12" width="6" height="1" fill="#3d3d3d" />
      <rect x="1" y="13" width="8" height="1" fill="#2a2a2a" />
      <rect x="1" y="14" width="8" height="1" fill="#1a1a1a" />
    </svg>
  );
}

function PixelBookStack({ color1, color2, color3 }: { color1: string; color2: string; color3: string }) {
  return (
    <svg width="56" height="48" viewBox="0 0 14 12" style={{ imageRendering: "pixelated" }}>
      {/* Bottom book */}
      <rect x="0" y="9" width="14" height="3" fill={color1} />
      <rect x="1" y="10" width="1" height="2" fill="#f5e9cf" />
      {/* Middle book */}
      <rect x="1" y="5" width="12" height="4" fill={color2} />
      <rect x="2" y="6" width="1" height="3" fill="#f5e9cf" />
      {/* Top book (slightly offset) */}
      <rect x="2" y="1" width="11" height="4" fill={color3} />
      <rect x="3" y="2" width="1" height="3" fill="#f5e9cf" />
    </svg>
  );
}

function PixelInkwell() {
  return (
    <svg width="36" height="52" viewBox="0 0 9 13" style={{ imageRendering: "pixelated" }}>
      {/* Quill feather */}
      <rect x="6" y="0" width="2" height="1" fill="#e8ddd0" />
      <rect x="5" y="1" width="3" height="1" fill="#d4c3a3" />
      <rect x="5" y="2" width="2" height="1" fill="#c9b896" />
      {/* Quill shaft */}
      <rect x="4" y="3" width="1" height="4" fill="#8b7355" />
      <rect x="3" y="7" width="1" height="1" fill="#8b7355" />
      {/* Inkwell body */}
      <rect x="1" y="8" width="7" height="1" fill="#1a1a2e" />
      <rect x="0" y="9" width="9" height="3" fill="#0f0f1f" />
      <rect x="1" y="9" width="2" height="1" fill="#2a2a4a" />
      <rect x="0" y="12" width="9" height="1" fill="#0a0a15" />
    </svg>
  );
}

function PixelBell() {
  return (
    <svg width="32" height="36" viewBox="0 0 8 9" style={{ imageRendering: "pixelated" }}>
      {/* Ding button */}
      <rect x="3" y="0" width="2" height="1" fill="#cfcfcc" />
      {/* Bell dome */}
      <rect x="2" y="1" width="4" height="1" fill="#c9a86a" />
      <rect x="1" y="2" width="6" height="2" fill="#b8944f" />
      <rect x="1" y="4" width="6" height="1" fill="#a07830" />
      {/* Base */}
      <rect x="0" y="5" width="8" height="1" fill="#3d3d3d" />
      <rect x="0" y="6" width="8" height="2" fill="#2a2a2a" />
      <rect x="0" y="8" width="8" height="1" fill="#1a1a1a" />
    </svg>
  );
}

function PixelScroll() {
  return (
    <svg width="48" height="24" viewBox="0 0 12 6" style={{ imageRendering: "pixelated" }}>
      {/* Scroll body */}
      <rect x="1" y="1" width="10" height="4" fill="#f5e9cf" />
      <rect x="2" y="2" width="8" height="1" fill="#d4c3a3" opacity="0.5" />
      <rect x="2" y="4" width="6" height="1" fill="#d4c3a3" opacity="0.3" />
      {/* Left roll */}
      <rect x="0" y="0" width="2" height="6" fill="#c9a86a" />
      <rect x="0" y="0" width="1" height="6" fill="#b8944f" />
      {/* Right roll */}
      <rect x="10" y="0" width="2" height="6" fill="#c9a86a" />
      <rect x="11" y="0" width="1" height="6" fill="#a07830" />
    </svg>
  );
}

/* ── Clickable Book Stack ── */

function ClickableBookStack({
  title,
  href,
  delay,
  color1,
  color2,
  color3,
}: {
  title: string;
  href: string;
  delay: number;
  color1: string;
  color2: string;
  color3: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const router = useRouter();

  useGSAP(
    () => {
      gsap.from(ref.current, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        delay,
        ease: "bounce.out(1.2)",
        clearProps: "transform,opacity",
      });
    },
    { dependencies: [] },
  );

  return (
    <Link
      ref={ref}
      href={href}
      onClick={(e) => {
        e.preventDefault();
        router.push(href, { transitionTypes: ["navigate-forward"] });
      }}
      className="group relative flex flex-col items-center cursor-pointer hover:scale-110 hover:-translate-y-2"
      style={{ transition: "transform 0.2s ease" }}
    >
      <div style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.6))" }}>
        <PixelBookStack color1={color1} color2={color2} color3={color3} />
      </div>
      <div className="absolute top-full mt-1 bg-[#1a0f0a] border border-[#c9a86a]/40 px-3 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="font-label text-[9px] tracking-[0.2em] uppercase text-[#c9a86a] whitespace-nowrap">
          {title}
        </span>
      </div>
    </Link>
  );
}

/* ── Villager Librarian & Desk ── */

/* ── (DeskItem removed — replaced by ClickableBookStack) ── */

function ReceptionDeskSVG() {
  return (
    <svg width="900" height="150" viewBox="0 0 900 150" className="relative z-20 pointer-events-none" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.8))" }}>
       {/* Desk Top Surface — flat solid slab */}
       <rect x="0" y="0" width="900" height="10" fill="#5c3a22" />
       <rect x="0" y="10" width="900" height="6" fill="#4a2d1a" />
       {/* Front edge trim */}
       <rect x="0" y="16" width="900" height="4" fill="#130a05" />

       {/* Front Face */}
       <rect x="0" y="20" width="900" height="105" fill="#2a1810" />

       {/* Bottom trim */}
       <rect x="0" y="119" width="900" height="4" fill="#3a2012" />
       <rect x="0" y="123" width="900" height="6" fill="#130a05" />
       <rect x="0" y="129" width="900" height="21" fill="#0f0805" />

       {/* Desk Panels */}
       <g transform="translate(30, 32)">
           <rect x="0" y="0" width="260" height="76" fill="#3a2012" rx="3" />
           <rect x="5" y="5" width="250" height="66" fill="#1a0f0a" rx="2" />
           <rect x="10" y="10" width="240" height="56" fill="#2a1810" rx="2" />
           <rect x="10" y="10" width="240" height="2" fill="#4a2d1a" />
       </g>

       <g transform="translate(320, 32)">
           <rect x="0" y="0" width="260" height="76" fill="#3a2012" rx="3" />
           <rect x="5" y="5" width="250" height="66" fill="#1a0f0a" rx="2" />
           <rect x="10" y="10" width="240" height="56" fill="#2a1810" rx="2" />
           <rect x="10" y="10" width="240" height="2" fill="#4a2d1a" />
       </g>

       <g transform="translate(610, 32)">
           <rect x="0" y="0" width="260" height="76" fill="#3a2012" rx="3" />
           <rect x="5" y="5" width="250" height="66" fill="#1a0f0a" rx="2" />
           <rect x="10" y="10" width="240" height="56" fill="#2a1810" rx="2" />
           <rect x="10" y="10" width="240" height="2" fill="#4a2d1a" />
       </g>
    </svg>
  );
}

function VillagerLibrarian() {
  const villagerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(villagerRef.current, {
        y: -4,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { dependencies: [] },
  );

  return (
    <div ref={villagerRef} className="relative" style={{ height: 200, filter: "drop-shadow(0 20px 20px rgba(0,0,0,0.7))", maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)" }}>
      <MinecraftSkin src="/noob-villager1.png" width={180} height={320} />
    </div>
  );
}

export default function LibraryReceptionPage() {
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

        <BackButton />

        <div className="relative w-full max-w-[1200px] px-6 z-10 pt-10 flex flex-col items-center">
          <div ref={headingRef} className="text-center mb-10 relative">
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
              RECEPTION
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

          {/* Librarian & Desk Area */}
          <div className="relative flex flex-col items-center">
            {/* Villager behind the desk — overlaps into desk area */}
            <div className="relative z-10" style={{ marginBottom: -50 }}>
              <VillagerLibrarian />
            </div>

            {/* Desk + surface items */}
            <div className="relative">
              {/* The Desk */}
              <ReceptionDeskSVG />

              {/* Items sitting ON the desk surface — use bottom-[100%] so they sit flush on top */}

              {/* Left — Fiction book stack */}
              <div className="absolute left-10 bottom-[100%] z-30">
                <ClickableBookStack
                  title="Fiction Room"
                  href="/library/fiction"
                  delay={0.5}
                  color1="#3e6080"
                  color2="#6eb7ff"
                  color3="#004b66"
                />
              </div>

              {/* Left-center — lamp */}
              <div className="absolute left-[200px] bottom-[100%] z-30" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }}>
                <PixelLamp />
              </div>

              {/* Center-left — inkwell */}
              <div className="absolute left-[340px] bottom-[100%] z-30" style={{ filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.4))" }}>
                <PixelInkwell />
              </div>

              {/* Center — Essays book stack */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[100%] z-30">
                <ClickableBookStack
                  title="Essays Room"
                  href="/library/essays"
                  delay={0.6}
                  color1="#8e54e9"
                  color2="#ff1a7f"
                  color3="#70647a"
                />
              </div>

              {/* Center-right — scroll */}
              <div className="absolute right-[340px] bottom-[100%] z-30" style={{ filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.4))" }}>
                <PixelScroll />
              </div>

              {/* Right-center — bell */}
              <div className="absolute right-[200px] bottom-[100%] z-30" style={{ filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.4))" }}>
                <PixelBell />
              </div>

              {/* Right — Classics book stack */}
              <div className="absolute right-10 bottom-[100%] z-30">
                <ClickableBookStack
                  title="Classics Room"
                  href="/library/classics"
                  delay={0.7}
                  color1="#004b66"
                  color2="#f89b21"
                  color3="#d72131"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ViewTransition>
  );
}
