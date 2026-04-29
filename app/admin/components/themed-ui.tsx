"use client";

import { type ComponentPropsWithoutRef, forwardRef } from "react";

/* ─────────────────────────────────────────────
 * ThemedLabel
 * Label with font-label, uppercase, tracking-wider, muted gold color
 * ───────────────────────────────────────────── */

export const ThemedLabel = forwardRef<
  HTMLLabelElement,
  ComponentPropsWithoutRef<"label">
>(function ThemedLabel({ className = "", style, ...props }, ref) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: htmlFor is passed via props by consumers
    <label
      ref={ref}
      className={`font-label text-xs uppercase tracking-wider block mb-1.5 ${className}`}
      style={{ color: "#a07830", ...style }}
      {...props}
    />
  );
});

/* ─────────────────────────────────────────────
 * ThemedInput
 * Text input with dark bg, parchment text, gold border, focus state
 * ───────────────────────────────────────────── */

export const ThemedInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input">
>(function ThemedInput({ className = "", style, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`w-full px-3 py-2 rounded-sm text-sm font-body outline-none transition-colors ${className}`}
      style={{
        background: "#1a0f0a",
        color: "#f5e9cf",
        border: "1px solid rgba(201,168,106,0.4)",
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "#c9a86a";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "rgba(201,168,106,0.4)";
        props.onBlur?.(e);
      }}
      {...props}
    />
  );
});

/* ─────────────────────────────────────────────
 * ThemedSelect
 * Select dropdown with same styling as ThemedInput
 * ───────────────────────────────────────────── */

export const ThemedSelect = forwardRef<
  HTMLSelectElement,
  ComponentPropsWithoutRef<"select">
>(function ThemedSelect({ className = "", style, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={`w-full px-3 py-2 rounded-sm text-sm font-body outline-none transition-colors ${className}`}
      style={{
        background: "#1a0f0a",
        color: "#f5e9cf",
        border: "1px solid rgba(201,168,106,0.4)",
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "#c9a86a";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "rgba(201,168,106,0.4)";
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
 * Textarea with same styling as ThemedInput
 * ───────────────────────────────────────────── */

export const ThemedTextarea = forwardRef<
  HTMLTextAreaElement,
  ComponentPropsWithoutRef<"textarea">
>(function ThemedTextarea({ className = "", style, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={`w-full px-3 py-2 rounded-sm text-sm font-body outline-none transition-colors resize-vertical ${className}`}
      style={{
        background: "#1a0f0a",
        color: "#f5e9cf",
        border: "1px solid rgba(201,168,106,0.4)",
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "#c9a86a";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "rgba(201,168,106,0.4)";
        props.onBlur?.(e);
      }}
      {...props}
    />
  );
});

/* ─────────────────────────────────────────────
 * ThemedToggle
 * Toggle/checkbox for boolean fields with gold accent
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
    {
      checked,
      onChange,
      className = "",
      id,
      name,
      "aria-label": ariaLabel,
      ...props
    },
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
        className={`relative inline-flex items-center rounded-full transition-colors cursor-pointer ${className}`}
        style={{
          width: 44,
          height: 24,
          background: checked ? "#c9a86a" : "#2a1810",
          border: `1px solid ${checked ? "#c9a86a" : "rgba(201,168,106,0.4)"}`,
        }}
        onClick={() => onChange(!checked)}
        {...props}
      >
        {name && (
          <input type="hidden" name={name} value={checked ? "true" : "false"} />
        )}
        <span
          className="block rounded-full transition-transform"
          style={{
            width: 18,
            height: 18,
            background: checked ? "#1a0f0a" : "#f5e9cf",
            transform: checked ? "translateX(22px)" : "translateX(2px)",
            transition:
              "transform 0.15s ease-in-out, background 0.15s ease-in-out",
          }}
        />
      </button>
    );
  },
);

/* ─────────────────────────────────────────────
 * ThemedButton
 * Primary button with dark gradient, gold text, hover state
 * ───────────────────────────────────────────── */

export const ThemedButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button">
>(function ThemedButton({ className = "", style, disabled, ...props }, ref) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`px-4 py-2 rounded-sm font-label text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        background: "linear-gradient(to bottom, #2a1810, #1a0f0a)",
        color: "#c9a86a",
        border: "1px solid rgba(201,168,106,0.3)",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = "rgba(201,168,106,0.6)";
          e.currentTarget.style.background =
            "linear-gradient(to bottom, #3a2820, #2a1810)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = "rgba(201,168,106,0.3)";
          e.currentTarget.style.background =
            "linear-gradient(to bottom, #2a1810, #1a0f0a)";
        }
      }}
      {...props}
    />
  );
});

/* ─────────────────────────────────────────────
 * DangerButton
 * Red-accented button for delete actions
 * ───────────────────────────────────────────── */

export const DangerButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button">
>(function DangerButton({ className = "", style, disabled, ...props }, ref) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`px-4 py-2 rounded-sm font-label text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        background: "#4a1010",
        color: "#ff9999",
        border: "1px solid rgba(139,32,32,0.4)",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = "rgba(139,32,32,0.7)";
          e.currentTarget.style.background = "#5a1515";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = "rgba(139,32,32,0.4)";
          e.currentTarget.style.background = "#4a1010";
        }
      }}
      {...props}
    />
  );
});
