"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { AdminLayout } from "./components/admin-layout";
import { NotificationProvider } from "./components/notification";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  // Loading state — themed spinner
  if (isPending) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "#0f0805" }}
      >
        {/* Pixel book loading icon */}
        <svg
          width="48"
          height="48"
          viewBox="0 0 12 12"
          style={{ imageRendering: "pixelated" }}
          className="mb-4 animate-pulse"
        >
          <title>Loading</title>
          {/* Book cover */}
          <rect x="2" y="1" width="8" height="10" fill="#2a1810" />
          <rect x="1" y="1" width="1" height="10" fill="#c9a86a" />
          {/* Pages */}
          <rect x="3" y="2" width="6" height="8" fill="#f5e9cf" />
          {/* Text lines */}
          <rect x="4" y="3" width="4" height="1" fill="#2a1810" opacity="0.3" />
          <rect x="4" y="5" width="3" height="1" fill="#2a1810" opacity="0.3" />
          <rect x="4" y="7" width="4" height="1" fill="#2a1810" opacity="0.3" />
        </svg>
        <p
          className="font-label text-xs tracking-[0.3em] uppercase animate-pulse"
          style={{ color: "#c9a86a" }}
        >
          Opening the archives...
        </p>
      </div>
    );
  }

  // Unauthenticated — redirect is handled by useEffect, render nothing
  if (!session) {
    return null;
  }

  // Authenticated but not admin — Access Denied
  if (session.user.role !== "admin") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "#0f0805" }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 16 16"
          style={{ imageRendering: "pixelated" }}
          className="mb-4"
        >
          <title>Access Denied</title>
          {/* Lock body */}
          <rect x="4" y="7" width="8" height="7" fill="#4a1010" />
          <rect x="5" y="8" width="6" height="5" fill="#2a1810" />
          {/* Lock shackle */}
          <rect x="5" y="3" width="1" height="4" fill="#8b2020" />
          <rect x="10" y="3" width="1" height="4" fill="#8b2020" />
          <rect x="5" y="2" width="6" height="1" fill="#8b2020" />
          {/* Keyhole */}
          <rect x="7" y="9" width="2" height="2" fill="#c9a86a" />
          <rect x="7.5" y="11" width="1" height="1" fill="#c9a86a" />
        </svg>
        <h1
          className="font-headline text-2xl font-bold tracking-wide mb-2"
          style={{ color: "#f5e9cf" }}
        >
          Access Denied
        </h1>
        <p className="font-body text-sm mb-6" style={{ color: "#c9a86a" }}>
          Only Grand Librarians may enter the archives.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="font-label text-[10px] tracking-[0.2em] uppercase px-4 py-2 transition-colors"
          style={{
            color: "#c9a86a",
            background: "rgba(201,168,106,0.08)",
            border: "1px solid rgba(201,168,106,0.15)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(201,168,106,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(201,168,106,0.08)";
          }}
        >
          Return to the Shelf
        </button>
      </div>
    );
  }

  // Admin — render the full admin layout
  return (
    <NotificationProvider>
      <AdminLayout session={session}>{children}</AdminLayout>
    </NotificationProvider>
  );
}
