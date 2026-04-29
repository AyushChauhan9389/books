"use client";

import type { Book } from "@/lib/types";
import { Badge, Card, DangerButton, EmptyState, Spinner, ThemedButton } from "./themed-ui";

type BookListProps = {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
};

function BookColorSwatch({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-5 h-5 rounded border"
        style={{ backgroundColor: color, borderColor: "rgba(201,168,106,0.2)" }}
      />
      <span className="font-mono text-[11px]" style={{ color: "rgba(245,233,207,0.5)" }}>
        {color}
      </span>
    </div>
  );
}

export function BookList({ books, onEdit, onDelete, loading, error, onRetry }: BookListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <Spinner />
        <span className="font-body text-sm" style={{ color: "rgba(245,233,207,0.6)" }}>
          Loading books…
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Failed to load books"
        description={error}
        action={onRetry && <ThemedButton onClick={onRetry}>Retry</ThemedButton>}
      />
    );
  }

  if (books.length === 0) {
    return (
      <EmptyState
        icon={
          <svg width="48" height="48" viewBox="0 0 12 12" style={{ imageRendering: "pixelated" }}>
            <rect x="2" y="1" width="8" height="10" fill="#4a2d1a" />
            <rect x="1" y="1" width="1" height="10" fill="#2a1810" />
            <rect x="3" y="2" width="6" height="8" fill="#f5e9cf" opacity="0.3" />
          </svg>
        }
        title="No books yet"
        description="Create your first book to get started."
      />
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(201,168,106,0.1)" }}>
              {["Title", "Author", "Rating", "Color", "Size", ""].map((heading) => (
                <th
                  key={heading}
                  className="px-5 py-3.5 font-label text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: "rgba(201,168,106,0.4)" }}
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
                className="group transition-colors duration-150"
                style={{
                  borderBottom: index < books.length - 1 ? "1px solid rgba(201,168,106,0.06)" : "none",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(201,168,106,0.03)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <td className="px-5 py-3.5">
                  <span className="font-body text-sm font-medium" style={{ color: "#f5e9cf" }}>
                    {book.title}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-body text-sm" style={{ color: "rgba(245,233,207,0.7)" }}>
                    {book.author}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span style={{ color: "#c9a86a", fontSize: 13, letterSpacing: 1 }}>
                    {"★".repeat(book.stars)}
                    <span style={{ opacity: 0.2 }}>{"★".repeat(5 - book.stars)}</span>
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <BookColorSwatch color={book.bgColor} />
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant="muted">{book.width}×{book.height}</Badge>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <ThemedButton onClick={() => onEdit(book)}>Edit</ThemedButton>
                    <DangerButton onClick={() => onDelete(book)}>Delete</DangerButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Footer count */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(201,168,106,0.06)" }}
      >
        <span className="font-label text-[10px] tracking-[0.15em] uppercase" style={{ color: "rgba(201,168,106,0.3)" }}>
          {books.length} {books.length === 1 ? "book" : "books"} total
        </span>
      </div>
    </Card>
  );
}
