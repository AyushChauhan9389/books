"use client";

import { DangerButton, ThemedButton } from "./themed-ui";

type ConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      {/* Dark backdrop */}
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close dialog"
        style={{ background: "rgba(0, 0, 0, 0.7)", border: "none" }}
        onClick={onCancel}
        onKeyDown={(e) => {
          if (e.key === "Escape") onCancel();
        }}
      />

      {/* Dialog */}
      <div
        className="relative w-full max-w-md mx-4 rounded-sm p-6"
        style={{
          background: "#2a1810",
          border: "1px solid #c9a86a",
        }}
      >
        <h2
          id="confirm-dialog-title"
          className="font-headline text-lg mb-3"
          style={{ color: "#f5e9cf" }}
        >
          {title}
        </h2>

        <p
          id="confirm-dialog-message"
          className="font-body text-sm mb-6"
          style={{ color: "#f5e9cf", opacity: 0.85 }}
        >
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <ThemedButton type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </ThemedButton>

          <DangerButton type="button" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Confirming…
              </span>
            ) : (
              "Confirm"
            )}
          </DangerButton>
        </div>
      </div>
    </div>
  );
}
