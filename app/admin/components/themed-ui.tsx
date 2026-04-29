"use client";

import { type ComponentPropsWithoutRef, forwardRef } from "react";

/* ── Color tokens ── */
const C = {
  bg: "#0f0805",
  surface: "#1a0f0a",
  surfaceRaised: "#2a1810",
  gold: "#c9a86a",
  goldMuted: "#a07830",
  parchment: "#f5e9cf",
  danger: "#8b2020",
  dangerText: "#ff9999",
  border: "rgba(201,168,106,0.15)",
  borderHover: "rgba(201,168,106,0.35)",
  borderFocus: "#c9a86a",
} as const;

/* ─────────────────────────────────────────────
 * ThemedLabel
 * ───────────────────────────────────────────── */

export const ThemedLabel = forwardRef<
  HTMLLabelElement,
  ComponentPropsWithoutRef<"label">
>(function ThemedLabel({ className = "", style, ...props }, ref) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: htmlFor is passed via props by consumers
    <label
      ref={ref}
      className={`font-label text-[11px] uppercase tracking-[0.15em] block mb-1.5 ${className}`}
      style={{ color: C.goldMuted, ...style }}
      {...props}
    />
  );
});

/* ─────────────────────────────────────────────
 * ThemedInput
 * ───────────────────────────────────────────── */

export const ThemedInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input">
>(function ThemedInput({ className = "", style, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`w-full px-3 py-2 rounded text-sm font-body outline-none transition-all duration-200 ${className}`}
      style={{
        background: C.bg,
        color: C.parchment,
        border: `1px solid ${C.border}`,
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = C.borderFocus;
        e.currentTarget.style.boxShadow = `inset 0 1px 3px rgba(0,0,0,0.3), 0 0 0 2px rgba(201,168,106,0.12)`;
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.3)";
        props.onBlur?.(e);
      }}
      {...props}
    />
  );
});

/* ─────────────────────────────────────────────
 * ThemedSelect
 * ───────────────────────────────────────────── */

export const ThemedSelect = forwardRef<
  HTMLSelectElement,
  ComponentPropsWithoutRef<"select">
>(function ThemedSelect({ className = "", style, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={`w-full px-3 py-2 rounded text-sm font-body outline-none transition-all duration-200 ${className}`}
      style={{
        background: C.bg,
        color: C.parchment,
        border: `1px solid ${C.border}`,
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = C.borderFocus;
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = C.border;
        props.onBlur?.(e);
      }}
      {...props}
    >
      {children}
    </select>
  );
});

/* ─────────────────────────────────────────────
 * ThemedTextarea
 * ───────────────────────────────────────────── */

export const ThemedTextarea = forwardRef<
  HTMLTextAreaElement,
  ComponentPropsWithoutRef<"textarea">
>(function ThemedTextarea({ className = "", style, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={`w-full px-3 py-2 rounded text-sm font-body outline-none transition-all duration-200 resize-vertical ${className}`}
      style={{
        background: C.bg,
        color: C.parchment,
        border: `1px solid ${C.border}`,
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = C.borderFocus;
        e.currentTarget.style.boxShadow = `inset 0 1px 3px rgba(0,0,0,0.3), 0 0 0 2px rgba(201,168,106,0.12)`;
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.3)";
        props.onBlur?.(e);
      }}
      {...props}
    />
  );
});

/* ─────────────────────────────────────────────
 * ThemedToggle
 * ───────────────────────────────────────────── */

type ThemedToggleProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "onChange"
> & {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const ThemedToggle = forwardRef<HTMLButtonElement, ThemedToggleProps>(
  function ThemedToggle(
    { checked, onChange, className = "", id, name, "aria-label": ariaLabel, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        aria-label={ariaLabel || name}
        className={`relative inline-flex items-center rounded-full transition-all duration-200 cursor-pointer ${className}`}
        style={{
          width: 44,
          height: 24,
          background: checked ? C.gold : C.surfaceRaised,
          border: `1px solid ${checked ? C.gold : C.border}`,
          boxShadow: checked ? `0 0 8px rgba(201,168,106,0.2)` : "none",
        }}
        onClick={() => onChange(!checked)}
        {...props}
      >
        {name && <input type="hidden" name={name} value={checked ? "true" : "false"} />}
        <span
          className="block rounded-full transition-all duration-200"
          style={{
            width: 18,
            height: 18,
            background: checked ? C.surface : C.parchment,
            transform: checked ? "translateX(22px)" : "translateX(2px)",
          }}
        />
      </button>
    );
  },
);

/* ─────────────────────────────────────────────
 * ThemedButton — primary gold-accent
 * ───────────────────────────────────────────── */

export const ThemedButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button">
>(function ThemedButton({ className = "", style, disabled, ...props }, ref) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`px-4 py-2 rounded font-label text-[11px] uppercase tracking-[0.12em] transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={{
        background: C.surfaceRaised,
        color: C.gold,
        border: `1px solid ${C.border}`,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = C.borderHover;
          e.currentTarget.style.background = "#3a2820";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = C.border;
          e.currentTarget.style.background = C.surfaceRaised;
          e.currentTarget.style.boxShadow = "none";
        }
      }}
      {...props}
    />
  );
});

/* ─────────────────────────────────────────────
 * PrimaryButton — filled gold
 * ───────────────────────────────────────────── */

export const PrimaryButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button">
>(function PrimaryButton({ className = "", style, disabled, ...props }, ref) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`px-5 py-2.5 rounded font-label text-[11px] uppercase tracking-[0.12em] transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={{
        background: `linear-gradient(to bottom, ${C.gold}, ${C.goldMuted})`,
        color: C.bg,
        border: "none",
        boxShadow: "0 2px 8px rgba(201,168,106,0.2)",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(201,168,106,0.35)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(201,168,106,0.2)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
      {...props}
    />
  );
});

/* ─────────────────────────────────────────────
 * DangerButton
 * ───────────────────────────────────────────── */

export const DangerButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button">
>(function DangerButton({ className = "", style, disabled, ...props }, ref) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`px-4 py-2 rounded font-label text-[11px] uppercase tracking-[0.12em] transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={{
        background: "rgba(139,32,32,0.15)",
        color: C.dangerText,
        border: "1px solid rgba(139,32,32,0.3)",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = "rgba(139,32,32,0.6)";
          e.currentTarget.style.background = "rgba(139,32,32,0.25)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = "rgba(139,32,32,0.3)";
          e.currentTarget.style.background = "rgba(139,32,32,0.15)";
        }
      }}
      {...props}
    />
  );
});

/* ─────────────────────────────────────────────
 * Badge — small status indicator
 * ───────────────────────────────────────────── */

export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "gold" | "muted" }) {
  const styles = {
    default: { bg: "rgba(201,168,106,0.1)", color: C.gold, border: "rgba(201,168,106,0.25)" },
    gold: { bg: "rgba(201,168,106,0.18)", color: C.gold, border: "rgba(201,168,106,0.4)" },
    muted: { bg: "rgba(201,168,106,0.05)", color: C.goldMuted, border: "rgba(201,168,106,0.12)" },
  }[variant];

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label text-[10px] uppercase tracking-[0.1em]"
      style={{ background: styles.bg, color: styles.color, border: `1px solid ${styles.border}` }}
    >
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────
 * Card — surface container
 * ───────────────────────────────────────────── */

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-lg overflow-hidden ${className}`}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
 * Spinner
 * ───────────────────────────────────────────── */

export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke={C.gold} strokeWidth="3" />
      <path className="opacity-80" fill={C.gold} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
 * EmptyState
 * ───────────────────────────────────────────── */

export function EmptyState({ icon, title, description, action }: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      {icon && <div className="opacity-30">{icon}</div>}
      <div className="text-center">
        <p className="font-headline text-base mb-1" style={{ color: C.parchment }}>{title}</p>
        {description && (
          <p className="font-body text-sm" style={{ color: C.goldMuted }}>{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
