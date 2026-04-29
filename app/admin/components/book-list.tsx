"use client";

import type { Book } from "@/lib/types";
import { DangerButton, ThemedButton } from "./themed-ui";

type BookListProps = {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
};

export function BookList({
  books,
  onEdit,
  onDelete,
  loading,
  error,
  onRetry,
}: BookListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div
          className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent"
          style={{ borderColor: "#c9a86a", borderTopColor: "transparent" }}
        />
        <span className="ml-3 font-body text-sm" style={{ color: "#f5e9cf" }}>
          Loading books…
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <p className="font-body text-sm" style={{ color: "#ff9999" }}>
          {error}
        </p>
        {onRetry && <ThemedButton onClick={onRetry}>Retry</ThemedButton>}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="font-body text-sm" style={{ color: "#a07830" }}>
          No books found. Create one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr
            style={{
              borderBottom: "1px solid rgba(201,168,106,0.2)",
            }}
          >
            {["Title", "Author", "Stars", "Color", "Actions"].map((heading) => (
              <th
                key={heading}
                className="px-4 py-3 font-label text-xs uppercase tracking-wider"
                style={{ color: "#a07830" }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr
              key={book.id}
              style={{
                backgroundColor:
                  index % 2 === 0 ? "#1a0f0a" : "rgba(42,24,16,0.5)",
              }}
            >
              <td
                className="px-4 py-3 font-body text-sm"
                style={{ color: "#f5e9cf" }}
              >
                {book.title}
              </td>
              <td
                className="px-4 py-3 font-body text-sm"
                style={{ color: "#f5e9cf" }}
              >
                {book.author}
              </td>
              <td
                className="px-4 py-3 font-body text-sm"
                style={{ color: "#c9a86a" }}
              >
                {"★".repeat(book.stars)}
              </td>
              <td className="px-4 py-3">
                <div
                  className="w-6 h-6 rounded-sm border"
                  style={{
                    backgroundColor: book.bgColor,
                    borderColor: "rgba(201,168,106,0.3)",
                  }}
                  title={book.bgColor}
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <ThemedButton onClick={() => onEdit(book)}>Edit</ThemedButton>
                  <DangerButton onClick={() => onDelete(book)}>
                    Delete
                  </DangerButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
