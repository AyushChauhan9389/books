import type { Metadata } from "next";
import Script from "next/script";
import { WeatherShell } from "./weather-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Promptlet — A Year In Reading",
  description: "A curated digital bookshelf of prompts read in 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Space+Grotesk:wght@300;400;500;600;700&family=Work+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col font-body">
        <WeatherShell>
            {children}
        </WeatherShell>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </body>
    </html>
  );
}
