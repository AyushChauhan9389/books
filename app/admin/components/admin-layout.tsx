"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { signOut } from "@/lib/auth-client";

type AdminLayoutProps = {
  children: ReactNode;
  session: {
    user: {
      name: string;
      email: string;
      role?: string | null;
    };
  };
};

/* ── Pixel-art SVG icons ── */

function PixelBookIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 12 12" style={{ imageRendering: "pixelated" }}>
      <title>Books</title>
      <rect x="2" y="1" width="8" height="10" fill={active ? "#c9a86a" : "#4a2d1a"} />
      <rect x="1" y="1" width="1" height="10" fill={active ? "#a07830" : "#2a1810"} />
      <rect x="3" y="2" width="6" height="8" fill="#f5e9cf" opacity={active ? 1 : 0.5} />
      <rect x="4" y="3" width="4" height="1" fill="#2a1810" opacity="0.35" />
      <rect x="4" y="5" width="3" height="1" fill="#2a1810" opacity="0.35" />
      <rect x="4" y="7" width="4" height="1" fill="#2a1810" opacity="0.35" />
    </svg>
  );
}

function PixelChestIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 12 12" style={{ imageRendering: "pixelated" }}>
      <title>Collections</title>
      <rect x="1" y="4" width="10" height="7" fill={active ? "#c9a86a" : "#785023"} />
      <rect x="1" y="4" width="10" height="3" fill={active ? "#dbb87a" : "#996a33"} />
      <rect x="5" y="6" width="2" height="2" fill={active ? "#f5e9cf" : "#cfcfcc"} />
      <rect x="1" y="4" width="10" height="1" fill={active ? "#a07830" : "#2c1a07"} />
    </svg>
  );
}

function PixelHomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 12 12" style={{ imageRendering: "pixelated" }}>
      <title>Home</title>
      <rect x="1" y="6" width="10" height="5" fill="#4a2d1a" />
      <rect x="5" y="8" width="2" height="3" fill="#c9a86a" />
      <rect x="1" y="5" width="1" height="1" fill="#2a1810" />
      <rect x="2" y="4" width="1" height="1" fill="#2a1810" />
      <rect x="3" y="3" width="1" height="1" fill="#2a1810" />
      <rect x="4" y="2" width="1" height="1" fill="#2a1810" />
      <rect x="5" y="1" width="2" height="1" fill="#2a1810" />
      <rect x="7" y="2" width="1" height="1" fill="#2a1810" />
      <rect x="8" y="3" width="1" height="1" fill="#2a1810" />
      <rect x="9" y="4" width="1" height="1" fill="#2a1810" />
      <rect x="10" y="5" width="1" height="1" fill="#2a1810" />
    </svg>
  );
}

/* ── Navigation items ── */

const NAV_ITEMS = [
  { label: "Books", href: "/admin/books", Icon: PixelBookIcon },
  { label: "Collections", href: "/admin/collections", Icon: PixelChestIcon },
];

/* ── AdminLayout ── */

export function AdminLayout({ children, session }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const currentSection = pathname.startsWith("/admin/collections")
    ? "Collections"
    : pathname.startsWith("/admin/books")
      ? "Books"
      : "Dashboard";

  return (
    <div className="min-h-screen flex" style={{ background: "#0f0805" }}>
      {/* ── Sidebar ── */}
      <aside
        className="w-[220px] flex-shrink-0 flex flex-col sticky top-0 h-screen"
        style={{
          background: "#1a0f0a",
          borderRight: "1px solid rgba(201,168,106,0.1)",
        }}
      >
        {/* Brand */}
        <div
          className="px-5 py-5 flex items-center gap-3"
          style={{ borderBottom: "1px solid rgba(201,168,106,0.08)" }}
        >
          {/* Pixel torch */}
          <svg width="14" height="28" viewBox="0 0 7 14" style={{ imageRendering: "pixelated" }}>
            <title>Torch</title>
            <rect x="2" y="0" width="3" height="2" fill="#ffaa00" />
            <rect x="1" y="1" width="1" height="1" fill="#ff6600" />
            <rect x="5" y="1" width="1" height="1" fill="#ff6600" />
            <rect x="2" y="2" width="3" height="1" fill="#cc6600" />
            <rect x="2" y="3" width="3" height="9" fill="#6b4226" />
            <rect x="2" y="3" width="1" height="9" fill="#8b5a2b" />
            <rect x="1" y="12" width="5" height="2" fill="#4a4a4a" />
          </svg>
          <div>
            <h1 className="font-headline text-sm font-bold tracking-wide" style={{ color: "#f5e9cf" }}>
              The Archives
            </h1>
            <p className="font-label text-[9px] tracking-[0.2em] uppercase" style={{ color: "rgba(201,168,106,0.4)" }}>
              Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5" aria-label="Admin navigation">
          <p className="px-3 mb-2 font-label text-[9px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,168,106,0.3)" }}>
            Manage
          </p>
          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded font-label text-[11px] uppercase tracking-[0.12em] transition-all duration-200"
                    style={{
                      color: isActive ? "#c9a86a" : "rgba(245,233,207,0.6)",
                      background: isActive ? "rgba(201,168,106,0.1)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = "rgba(201,168,106,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <item.Icon active={isActive} />
                    {item.label}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#c9a86a" }} />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom: user + back to site */}
        <div style={{ borderTop: "1px solid rgba(201,168,106,0.08)" }}>
          {/* User */}
          <div className="px-4 py-3 flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center font-label text-[10px] uppercase"
              style={{ background: "rgba(201,168,106,0.12)", color: "#c9a86a" }}
            >
              {(session.user.name || session.user.email).charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-label text-[11px] truncate" style={{ color: "#f5e9cf" }}>
                {session.user.name || session.user.email}
              </p>
              <p className="font-label text-[9px] tracking-wider uppercase" style={{ color: "rgba(201,168,106,0.35)" }}>
                Librarian
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-3 pb-4 flex flex-col gap-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 px-3 py-2 rounded font-label text-[10px] uppercase tracking-[0.12em] transition-all duration-200"
              style={{ color: "rgba(245,233,207,0.5)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(201,168,106,0.05)";
                e.currentTarget.style.color = "rgba(245,233,207,0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(245,233,207,0.5)";
              }}
            >
              <PixelHomeIcon />
              Back to Site
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2.5 px-3 py-2 rounded font-label text-[10px] uppercase tracking-[0.12em] transition-all duration-200 cursor-pointer text-left"
              style={{ color: "rgba(245,233,207,0.5)", background: "transparent", border: "none" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(139,32,32,0.1)";
                e.currentTarget.style.color = "#ff9999";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(245,233,207,0.5)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <title>Sign out</title>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-8 py-4"
          style={{
            background: "rgba(15,8,5,0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(201,168,106,0.08)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="font-label text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,168,106,0.35)" }}>
              Admin
            </span>
            <span style={{ color: "rgba(201,168,106,0.2)" }}>/</span>
            <span className="font-label text-[11px] tracking-[0.15em] uppercase" style={{ color: "#c9a86a" }}>
              {currentSection}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 font-body" style={{ color: "#f5e9cf" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
