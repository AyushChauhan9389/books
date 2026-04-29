"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { usePathname } from "next/navigation";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

/* ── PixelCloud ── */

const CLOUD_GRID = [
  [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const CP = 7;
const CLOUD_W = 18 * CP;
const CLOUD_H = 7 * CP;

export function PixelCloud({
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

/* ── Weather types ── */

export type Weather = "sunny" | "night" | "rain" | "snow";

export const WEATHER_BG: Record<Weather, string> = {
  sunny: "#3b66ff",
  night: "#0a0e25",
  rain: "#465262",
  snow: "#7a8aa8",
};

/* ── Sunny ── */

export function SunnyWeather() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(ref.current, { opacity: 0, duration: 0.8, ease: "power1.out" });
    },
    { dependencies: [] },
  );

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none">
      <PixelCloud className="top-[10%] left-[15%] opacity-80" scale={0.75} driftDelay={0} />
      <PixelCloud className="top-[35%] left-[38%] opacity-90" scale={0.5} driftDelay={2} />
      <PixelCloud className="top-[15%] right-[5%]" scale={1.25} driftDelay={4} />
      <PixelCloud className="bottom-[40%] right-[2%]" scale={0.9} driftDelay={6} />
    </div>
  );
}

/* ── Moon ── */

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
      <rect x="3" y="1" width="4" height="1" fill="#e2e8f0" />
      <rect x="2" y="2" width="6" height="1" fill="#e2e8f0" />
      <rect x="1" y="3" width="8" height="1" fill="#e2e8f0" />
      <rect x="1" y="4" width="8" height="1" fill="#e2e8f0" />
      <rect x="1" y="5" width="8" height="1" fill="#e2e8f0" />
      <rect x="1" y="6" width="8" height="1" fill="#e2e8f0" />
      <rect x="2" y="7" width="6" height="1" fill="#e2e8f0" />
      <rect x="3" y="8" width="4" height="1" fill="#e2e8f0" />
      <rect x="3" y="3" width="1" height="1" fill="#94a3b8" />
      <rect x="6" y="4" width="1" height="1" fill="#94a3b8" />
      <rect x="4" y="6" width="1" height="1" fill="#94a3b8" />
    </svg>
  );
}

/* ── Night ── */

export function NightWeather() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(ref.current, { opacity: 0, duration: 0.8, ease: "power1.out" });

      const stars = ref.current?.querySelectorAll<HTMLDivElement>(".star") ?? [];
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

/* ── Rain ── */

export function RainWeather() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(ref.current, { opacity: 0, duration: 0.8, ease: "power1.out" });

      const drops = ref.current?.querySelectorAll<HTMLDivElement>(".raindrop") ?? [];
      const viewportH = window.innerHeight;
      drops.forEach((drop) => {
        const duration = 0.7 + Math.random() * 0.5;
        const delay = Math.random() * 2;
        gsap.set(drop, { left: `${Math.random() * 100}%` });
        gsap.fromTo(
          drop,
          { y: -20, opacity: 0.7 },
          { y: viewportH + 20, duration, delay, ease: "none", repeat: -1 },
        );
      });
    },
    { dependencies: [] },
  );

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden">
      <PixelCloud className="top-[4%] left-[8%]" scale={0.9} driftDelay={0} color="#2f3845" />
      <PixelCloud className="top-[2%] left-[42%]" scale={1.1} driftDelay={2} color="#2f3845" />
      <PixelCloud className="top-[6%] right-[10%]" scale={0.85} driftDelay={4} color="#2f3845" />
      <PixelCloud className="top-[14%] left-[25%] opacity-80" scale={0.7} driftDelay={3} color="#3a4556" />
      {Array.from({ length: 45 }, (_, i) => (
        <div key={i} className="raindrop absolute top-0 w-[2px] h-[14px] bg-sky-200/80" />
      ))}
    </div>
  );
}

/* ── Snow ── */

export function SnowWeather() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(ref.current, { opacity: 0, duration: 0.8, ease: "power1.out" });

      const flakes = ref.current?.querySelectorAll<HTMLDivElement>(".snowflake") ?? [];
      const viewportH = window.innerHeight;
      flakes.forEach((flake) => {
        const duration = 4 + Math.random() * 4;
        const delay = Math.random() * duration;
        gsap.set(flake, { left: `${Math.random() * 100}%` });
        gsap.fromTo(
          flake,
          { y: -20, opacity: 0 },
          { y: viewportH + 20, opacity: 0.9, duration, delay, ease: "none", repeat: -1 },
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
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden">
      <PixelCloud className="top-[5%] left-[12%] opacity-90" scale={0.85} driftDelay={0} />
      <PixelCloud className="top-[3%] left-[48%]" scale={1.05} driftDelay={2} />
      <PixelCloud className="top-[8%] right-[12%] opacity-95" scale={0.9} driftDelay={4} />
      {Array.from({ length: 55 }, (_, i) => (
        <div key={i} className="snowflake absolute top-0">
          <div className="snowflake-inner w-[5px] h-[5px] bg-white" />
        </div>
      ))}
    </div>
  );
}

/* ── Weather Controls ── */

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

export function WeatherControls({
  weather,
  onChange,
}: {
  weather: Weather;
  onChange: (w: Weather) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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

  // Hide on admin pages — admin has its own layout
  if (pathname.startsWith("/admin")) {
    return null;
  }

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
