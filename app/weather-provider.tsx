"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  type Weather,
  WEATHER_BG,
  WeatherControls,
  SunnyWeather,
  NightWeather,
  RainWeather,
  SnowWeather,
} from "./weather";
import { AuthButtons } from "./auth-buttons";

gsap.registerPlugin(useGSAP);

const WeatherContext = createContext<Weather>("sunny");
export const useWeather = () => useContext(WeatherContext);

export function WeatherShell({ children }: { children: React.ReactNode }) {
  const [weather, setWeather] = useState<Weather>("sunny");
  const bgRef = useRef<HTMLDivElement>(null);
  const weatherContainerRef = useRef<HTMLDivElement>(null);
  const transitioningRef = useRef(false);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  const handleWeatherChange = useCallback(
    (newWeather: Weather) => {
      if (newWeather === weather || transitioningRef.current) return;
      transitioningRef.current = true;

      const h = window.innerHeight;

      gsap.to(weatherContainerRef.current, {
        y: h,
        duration: 0.45,
        ease: "power2.in",
        onComplete: () => {
          flushSync(() => {
            setWeather(newWeather);
          });
          gsap.set(weatherContainerRef.current, { y: -h });
          gsap.to(bgRef.current, {
            backgroundColor: WEATHER_BG[newWeather],
            duration: 0.55,
            ease: "power2.out",
          });
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

  // Admin pages use their own layout — skip weather background entirely
  if (isAdmin) {
    return (
      <WeatherContext value={weather}>
        {children}
      </WeatherContext>
    );
  }

  return (
    <WeatherContext value={weather}>
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
        <AuthButtons />

        {children}
      </div>
    </WeatherContext>
  );
}
