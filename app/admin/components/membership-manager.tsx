"use client";

import { useCallback, useEffect, useState } from "react";
import type { Book } from "@/lib/types";
import { ApiError, adminFetch } from "./api";
import { useNotification } from "./notification";
import { Card, DangerButton, EmptyState, Spinner, ThemedButton, ThemedInput } from "./themed-ui";

type MemberBook = Book & { position: number };

type MembershipManagerProps = {
  collectionId: string;
  collectionName: string;
};

export function MembershipManager({ collectionId, collectionName }: MembershipManagerProps) {
  const [memberBooks, setMemberBooks] = useState<MemberBook[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const { addNotification } = useNotification();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [members, books] = await Promise.all([
        adminFetch<MemberBook[]>(`/api/admin/collections/${collectionId}/books`),
        adminFetch<Book[]>("/api/admin/books"),
      ]);
      setMemberBooks(members);
      setAllBooks(books);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to load data.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [collectionId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const nonMemberBooks = allBooks.filter((b) => !memberBooks.some((mb) => mb.id === b.id));
  const filteredNonMembers = pickerSearch.trim()
    ? nonMemberBooks.filter((b) =>
        b.title.toLowerCase().includes(pickerSearch.toLowerCase()) ||
        b.author.toLowerCase().includes(pickerSearch.toLowerCase())
      )
    : nonMemberBooks;

  async function handleMoveUp(book: MemberBook) {
    const index = memberBooks.findIndex((b) => b.id === book.id);
    if (index <= 0) return;
    const neighbor = memberBooks[index - 1];
    setReorderingId(book.id);
    try {
      await adminFetch(`/api/admin/collections/${collectionId}/books/reorder`, {
        method: "PUT",
        body: JSON.stringify([
          { bookId: book.id, position: neighbor.position },
          { bookId: neighbor.id, position: book.position },
        ]),
      });
      setMemberBooks((prev) => {
        const updated = prev.map((b) => {
          if (b.id === book.id) return { ...b, position: neighbor.position };
          if (b.id === neighbor.id) return { ...b, position: book.position };
          return b;
        });
        return updated.sort((a, b) => a.position - b.position);
      });
    } catch (err) {
      addNotification("error", err instanceof ApiError ? err.message : "Failed to reorder.");
    } finally {
      setReorderingId(null);
    }
  }

  async function handleMoveDown(book: MemberBook) {
    const index = memberBooks.findIndex((b) => b.id === book.id);
    if (index < 0 || index >= memberBooks.length - 1) return;
    const neighbor = memberBooks[index + 1];
    setReorderingId(book.id);
    try {
      await adminFetch(`/api/admin/collections/${collectionId}/books/reorder`, {
        method: "PUT",
        body: JSON.stringify([
          { bookId: book.id, position: neighbor.position },
          { bookId: neighbor.id, position: book.position },
        ]),
      });
      setMemberBooks((prev) => {
        const updated = prev.map((b) => {
          if (b.id === book.id) return { ...b, position: neighbor.position };
          if (b.id === neighbor.id) return { ...b, position: book.position };
          return b;
        });
        return updated.sort((a, b) => a.position - b.position);
      });
    } catch (err) {
      addNotification("error", err instanceof ApiError ? err.message : "Failed to reorder.");
    } finally {
      setReorderingId(null);
    }
  }

  async function handleAddBook(book: Book) {
    const maxPosition = memberBooks.length > 0 ? Math.max(...memberBooks.map((b) => b.position)) : 0;
    const newPosition = maxPosition + 1;
    setAddingId(book.id);
    try {
      await adminFetch(`/api/admin/collections/${collectionId}/books`, {
        method: "POST",
        body: JSON.stringify({ bookId: book.id, position: newPosition }),
      });
      setMemberBooks((prev) => [...prev, { ...book, position: newPosition }].sort((a, b) => a.position - b.position));
      addNotification("success", `Added "${book.title}"`);
    } catch (err) {
      addNotification("error", err instanceof ApiError ? err.message : "Failed to add book.");
    } finally {
      setAddingId(null);
    }
  }

  async function handleRemoveBook(book: MemberBook) {
    setRemovingId(book.id);
    try {
      await adminFetch(`/api/admin/collections/${collectionId}/books/${book.id}`, { method: "DELETE" });
      setMemberBooks((prev) => prev.filter((b) => b.id !== book.id));
      addNotification("success", `Removed "${book.title}"`);
    } catch (err) {
      addNotification("error", err instanceof ApiError ? err.message : "Failed to remove book.");
    } finally {
      setRemovingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <Spinner />
        <span className="font-body text-sm" style={{ color: "rgba(245,233,207,0.6)" }}>Loading books…</span>
      </div>
    );
  }

  if (error) {
    return <EmptyState title="Failed to load" description={error} action={<ThemedButton onClick={fetchData}>Retry</ThemedButton>} />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="font-body text-sm" style={{ color: "rgba(201,168,106,0.5)" }}>
          {memberBooks.length} {memberBooks.length === 1 ? "book" : "books"} in this collection
        </p>
        <ThemedButton onClick={() => { setShowPicker(true); setPickerSearch(""); }}>
          + Add Book
        </ThemedButton>
      </div>

      {/* Member books */}
      {memberBooks.length === 0 ? (
        <EmptyState title="Empty collection" description="Add books to populate this collection." />
      ) : (
        <Card>
          <div className="divide-y" style={{ borderColor: "rgba(201,168,106,0.06)" }}>
            {memberBooks.map((book, index) => (
              <div
                key={book.id}
                className="flex items-center gap-4 px-5 py-3 group transition-colors duration-150"
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(201,168,106,0.03)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {/* Position */}
                <span className="w-8 text-center font-mono text-sm" style={{ color: "rgba(201,168,106,0.3)" }}>
                  {book.position}
                </span>

                {/* Color swatch */}
                <div className="w-4 h-10 rounded-sm flex-shrink-0" style={{ backgroundColor: book.bgColor }} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium truncate" style={{ color: "#f5e9cf" }}>{book.title}</p>
                  <p className="font-body text-[12px]" style={{ color: "rgba(245,233,207,0.45)" }}>{book.author}</p>
                </div>

                {/* Stars */}
                <span className="text-[12px] hidden sm:block" style={{ color: "#c9a86a" }}>
                  {"★".repeat(book.stars)}
                </span>

                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(book)}
                    disabled={index === 0 || reorderingId !== null}
                    className="w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                    style={{ color: "#c9a86a" }}
                    onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "rgba(201,168,106,0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    aria-label={`Move "${book.title}" up`}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(book)}
                    disabled={index === memberBooks.length - 1 || reorderingId !== null}
                    className="w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                    style={{ color: "#c9a86a" }}
                    onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "rgba(201,168,106,0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    aria-label={`Move "${book.title}" down`}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveBook(book)}
                    disabled={removingId === book.id}
                    className="w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                    style={{ color: "#ff9999" }}
                    onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "rgba(139,32,32,0.15)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    aria-label={`Remove "${book.title}"`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Add Book Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Add book to collection">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close picker"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", border: "none" }}
            onClick={() => setShowPicker(false)}
            onKeyDown={(e) => { if (e.key === "Escape") setShowPicker(false); }}
          />

          <div
            className="relative w-full max-w-lg rounded-lg max-h-[80vh] flex flex-col"
            style={{ background: "#1a0f0a", border: "1px solid rgba(201,168,106,0.2)", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(201,168,106,0.1)" }}>
              <h2 className="font-headline text-base font-bold" style={{ color: "#f5e9cf" }}>Add Book</h2>
              <button
                type="button"
                onClick={() => setShowPicker(false)}
                className="w-8 h-8 flex items-center justify-center rounded transition-colors cursor-pointer"
                style={{ color: "rgba(245,233,207,0.4)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(201,168,106,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                aria-label="Close picker"
              >
                ✕
              </button>
            </div>

            {/* Search */}
            {nonMemberBooks.length > 5 && (
              <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(201,168,106,0.06)" }}>
                <ThemedInput
                  placeholder="Search by title or author…"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  aria-label="Search books"
                />
              </div>
            )}

            {/* List */}
            <div className="overflow-y-auto flex-1 p-3">
              {filteredNonMembers.length === 0 ? (
                <p className="font-body text-sm text-center py-8" style={{ color: "rgba(201,168,106,0.4)" }}>
                  {nonMemberBooks.length === 0 ? "All books are already in this collection." : "No books match your search."}
                </p>
              ) : (
                <div className="flex flex-col gap-1">
                  {filteredNonMembers.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded transition-colors"
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(201,168,106,0.04)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <div className="w-3 h-8 rounded-sm flex-shrink-0" style={{ backgroundColor: book.bgColor }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm truncate" style={{ color: "#f5e9cf" }}>{book.title}</p>
                        <p className="font-body text-[11px]" style={{ color: "rgba(201,168,106,0.4)" }}>{book.author}</p>
                      </div>
                      <ThemedButton onClick={() => handleAddBook(book)} disabled={addingId === book.id}>
                        {addingId === book.id ? <Spinner size={12} /> : "Add"}
                      </ThemedButton>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
