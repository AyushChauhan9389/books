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

/* ── Pixel-art SVG decorations ── */

function TorchDecoration({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="32"
      viewBox="0 0 8 16"
      style={{ imageRendering: "pixelated" }}
      className={className}
    >
      <title>Torch</title>
      {/* Flame */}
      <rect x="3" y="0" width="2" height="2" fill="#ffaa00" />
      <rect x="2" y="1" width="1" height="2" fill="#ff6600" />
      <rect x="5" y="1" width="1" height="2" fill="#ff6600" />
      <rect x="3" y="2" width="2" height="1" fill="#ff4400" />
      {/* Glow */}
      <rect x="3" y="3" width="2" height="1" fill="#cc6600" />
      {/* Stick */}
      <rect x="3" y="4" width="2" height="10" fill="#6b4226" />
      <rect x="3" y="4" width="1" height="10" fill="#8b5a2b" />
      {/* Mount */}
      <rect x="2" y="13" width="4" height="2" fill="#4a4a4a" />
      <rect x="2" y="13" width="4" height="1" fill="#5a5a5a" />
    </svg>
  );
}

function BookStackDecoration({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="24"
      viewBox="0 0 14 12"
      style={{ imageRendering: "pixelated" }}
      className={className}
    >
      <title>Book stack</title>
      {/* Bottom book */}
      <rect x="1" y="8" width="12" height="3" fill="#8b2020" />
      <rect x="1" y="8" width="1" height="3" fill="#c9a86a" />
      <rect x="3" y="9" width="8" height="1" fill="#6b1515" />
      {/* Middle book */}
      <rect x="2" y="5" width="10" height="3" fill="#1a5a1a" />
      <rect x="2" y="5" width="1" height="3" fill="#c9a86a" />
      <rect x="4" y="6" width="6" height="1" fill="#0f3f0f" />
      {/* Top book */}
      <rect x="3" y="2" width="9" height="3" fill="#2a1870" />
      <rect x="3" y="2" width="1" height="3" fill="#c9a86a" />
      <rect x="5" y="3" width="5" height="1" fill="#1a0f50" />
    </svg>
  );
}

function ScrollDecoration({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="28"
      viewBox="0 0 12 14"
      style={{ imageRendering: "pixelated" }}
      className={className}
    >
      <title>Scroll</title>
      {/* Top roll */}
      <rect x="2" y="0" width="8" height="2" fill="#d4b896" />
      <rect x="1" y="0" width="1" height="2" fill="#8b6914" />
      <rect x="10" y="0" width="1" height="2" fill="#8b6914" />
      {/* Paper body */}
      <rect x="2" y="2" width="8" height="9" fill="#f5e9cf" />
      {/* Text lines */}
      <rect x="3" y="3" width="6" height="1" fill="#2a1810" opacity="0.3" />
      <rect x="3" y="5" width="5" height="1" fill="#2a1810" opacity="0.3" />
      <rect x="3" y="7" width="6" height="1" fill="#2a1810" opacity="0.3" />
      <rect x="3" y="9" width="4" height="1" fill="#2a1810" opacity="0.3" />
      {/* Bottom roll */}
      <rect x="2" y="11" width="8" height="2" fill="#d4b896" />
      <rect x="1" y="11" width="1" height="2" fill="#8b6914" />
      <rect x="10" y="11" width="1" height="2" fill="#8b6914" />
    </svg>
  );
}

/* ── Navigation items ── */

const NAV_ITEMS = [
  {
    label: "Books",
    href: "/admin/books",
    icon: (active: boolean) => (
      <svg
        width="18"
        height="18"
        viewBox="0 0 12 12"
        style={{ imageRendering: "pixelated" }}
      >
        <title>Books</title>
        {/* Book cover */}
        <rect
          x="2"
          y="1"
          width="8"
          height="10"
          fill={active ? "#c9a86a" : "#4a2d1a"}
        />
        <rect
          x="1"
          y="1"
          width="1"
          height="10"
          fill={active ? "#a07830" : "#2a1810"}
        />
        {/* Pages */}
        <rect
          x="3"
          y="2"
          width="6"
          height="8"
          fill="#f5e9cf"
          opacity={active ? 1 : 0.6}
        />
        {/* Text lines */}
        <rect x="4" y="3" width="4" height="1" fill="#2a1810" opacity="0.4" />
        <rect x="4" y="5" width="3" height="1" fill="#2a1810" opacity="0.4" />
        <rect x="4" y="7" width="4" height="1" fill="#2a1810" opacity="0.4" />
      </svg>
    ),
  },
  {
    label: "Collections",
    href: "/admin/collections",
    icon: (active: boolean) => (
      <svg
        width="18"
        height="18"
        viewBox="0 0 12 12"
        style={{ imageRendering: "pixelated" }}
      >
        <title>Collections</title>
        {/* Chest body */}
        <rect
          x="1"
          y="4"
          width="10"
          height="7"
          fill={active ? "#c9a86a" : "#785023"}
        />
        <rect
          x="1"
          y="4"
          width="10"
          height="3"
          fill={active ? "#dbb87a" : "#996a33"}
        />
        {/* Chest lock */}
        <rect
          x="5"
          y="6"
          width="2"
          height="2"
          fill={active ? "#f5e9cf" : "#cfcfcc"}
        />
        {/* Chest lid line */}
        <rect
          x="1"
          y="4"
          width="10"
          height="1"
          fill={active ? "#a07830" : "#2c1a07"}
        />
      </svg>
    ),
  },
];

/* ── AdminLayout ── */

export function AdminLayout({ children, session }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#0f0805", minWidth: "1024px" }}
    >
      {/* ── Sidebar ── */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col"
        style={{
          background: "#1a0f0a",
          borderRight: "1px solid rgba(201,168,106,0.15)",
        }}
      >
        {/* Sidebar header / brand */}
        <div
          className="px-5 py-5 flex items-center gap-3"
          style={{ borderBottom: "1px solid rgba(201,168,106,0.1)" }}
        >
          <TorchDecoration />
          <h1
            className="font-headline text-lg font-bold tracking-wide"
            style={{ color: "#f5e9cf" }}
          >
            Admin Panel
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4" aria-label="Admin navigation">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-sm font-label text-xs uppercase tracking-[0.15em] transition-colors"
                    style={{
                      color: isActive ? "#c9a86a" : "#f5e9cf",
                      background: isActive
                        ? "rgba(201,168,106,0.12)"
                        : "transparent",
                      borderLeft: isActive
                        ? "2px solid #c9a86a"
                        : "2px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background =
                          "rgba(201,168,106,0.06)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    {item.icon(isActive)}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar decorations */}
        <div
          className="px-5 py-4 flex items-center justify-around opacity-40"
          style={{ borderTop: "1px solid rgba(201,168,106,0.08)" }}
        >
          <BookStackDecoration />
          <ScrollDecoration />
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header bar */}
        <header
          className="flex items-center justify-between px-6 py-3"
          style={{
            background: "#1a0f0a",
            borderBottom: "1px solid rgba(201,168,106,0.15)",
          }}
        >
          {/* Breadcrumb / section indicator */}
          <div className="flex items-center gap-2">
            <TorchDecoration className="opacity-50" />
            <span
              className="font-label text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "rgba(201,168,106,0.5)" }}
            >
              {pathname.startsWith("/admin/collections")
                ? "Collections"
                : pathname.startsWith("/admin/books")
                  ? "Books"
                  : "Dashboard"}
            </span>
          </div>

          {/* User info + sign out */}
          <div className="flex items-center gap-4">
            {/* User identity */}
            <div className="flex items-center gap-2">
              {/* Pixel avatar */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 8 8"
                style={{ imageRendering: "pixelated" }}
              >
                <title>Admin user</title>
                {/* Head */}
                <rect x="2" y="0" width="4" height="4" fill="#c9a86a" />
                {/* Eyes */}
                <rect x="3" y="1" width="1" height="1" fill="#1a0f0a" />
                <rect x="5" y="1" width="1" height="1" fill="#1a0f0a" />
                {/* Body */}
                <rect x="1" y="4" width="6" height="4" fill="#4a2d1a" />
                <rect x="3" y="4" width="2" height="2" fill="#c9a86a" />
              </svg>
              <span className="font-label text-xs" style={{ color: "#c9a86a" }}>
                {session.user.name || session.user.email}
              </span>
            </div>

            {/* Sign out button */}
            <button
              type="button"
              onClick={handleSignOut}
              className="font-label text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-sm transition-colors cursor-pointer"
              style={{
                color: "#f5e9cf",
                background: "rgba(201,168,106,0.08)",
                border: "1px solid rgba(201,168,106,0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(201,168,106,0.18)";
                e.currentTarget.style.borderColor = "rgba(201,168,106,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(201,168,106,0.08)";
                e.currentTarget.style.borderColor = "rgba(201,168,106,0.15)";
              }}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main
          className="flex-1 p-6 font-body relative"
          style={{ color: "#f5e9cf" }}
        >
          {/* Subtle corner decorations */}
          <div className="absolute top-3 right-3 opacity-[0.06] pointer-events-none">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              style={{ imageRendering: "pixelated" }}
            >
              <title>Corner decoration</title>
              <rect x="44" y="0" width="4" height="48" fill="#c9a86a" />
              <rect x="0" y="0" width="48" height="4" fill="#c9a86a" />
              <rect x="36" y="8" width="4" height="4" fill="#c9a86a" />
              <rect x="8" y="8" width="4" height="4" fill="#c9a86a" />
            </svg>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
