"use client";

import { DangerButton, Spinner, ThemedButton } from "./themed-ui";

type ConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export function ConfirmDialog({ title, message, onConfirm, onCancel, loading = false }: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close dialog"
        style={{ background: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(4px)", border: "none" }}
        onClick={onCancel}
        onKeyDown={(e) => { if (e.key === "Escape") onCancel(); }}
      />

      {/* Dialog */}
      <div
        className="relative w-full max-w-md rounded-lg p-6"
        style={{
          background: "#1a0f0a",
          border: "1px solid rgba(201,168,106,0.2)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}
      >
        {/* Warning icon */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(139,32,32,0.15)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff9999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <title>Warning</title>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 id="confirm-dialog-title" className="font-headline text-lg font-bold" style={{ color: "#f5e9cf" }}>
            {title}
          </h2>
        </div>

        <p id="confirm-dialog-message" className="font-body text-sm mb-6 pl-[52px]" style={{ color: "rgba(245,233,207,0.7)" }}>
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <ThemedButton type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </ThemedButton>
          <DangerButton type="button" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size={14} />
                Deleting…
              </span>
            ) : (
              "Delete"
            )}
          </DangerButton>
        </div>
      </div>
    </div>
  );
}
