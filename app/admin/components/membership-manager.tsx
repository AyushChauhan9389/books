"use client";

import { useCallback, useEffect, useState } from "react";
import type { Book } from "@/lib/types";
import { ApiError, adminFetch } from "./api";
import { useNotification } from "./notification";
import { DangerButton, ThemedButton } from "./themed-ui";

type MemberBook = Book & { position: number };

type MembershipManagerProps = {
  collectionId: string;
  collectionName: string;
};

export function MembershipManager({
  collectionId,
  collectionName,
}: MembershipManagerProps) {
  const [memberBooks, setMemberBooks] = useState<MemberBook[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const { addNotification } = useNotification();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [members, books] = await Promise.all([
        adminFetch<MemberBook[]>(
          `/api/admin/collections/${collectionId}/books`,
        ),
        adminFetch<Book[]>("/api/admin/books"),
      ]);
      setMemberBooks(members);
      setAllBooks(books);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to load membership data. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [collectionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const nonMemberBooks = allBooks.filter(
    (b) => !memberBooks.some((mb) => mb.id === b.id),
  );

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

      addNotification("success", `Moved "${book.title}" up`);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to reorder. Please try again.";
      addNotification("error", message);
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

      addNotification("success", `Moved "${book.title}" down`);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to reorder. Please try again.";
      addNotification("error", message);
    } finally {
      setReorderingId(null);
    }
  }

  async function handleAddBook(book: Book) {
    const maxPosition =
      memberBooks.length > 0
        ? Math.max(...memberBooks.map((b) => b.position))
        : 0;
    const newPosition = maxPosition + 1;

    setAddingId(book.id);

    try {
      await adminFetch(`/api/admin/collections/${collectionId}/books`, {
        method: "POST",
        body: JSON.stringify({
          bookId: book.id,
          position: newPosition,
        }),
      });

      const memberBook: MemberBook = { ...book, position: newPosition };
      setMemberBooks((prev) =>
        [...prev, memberBook].sort((a, b) => a.position - b.position),
      );

      addNotification(
        "success",
        `Added "${book.title}" to "${collectionName}"`,
      );
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to add book. Please try again.";
      addNotification("error", message);
    } finally {
      setAddingId(null);
    }
  }

  async function handleRemoveBook(book: MemberBook) {
    setRemovingId(book.id);

    try {
      await adminFetch(
        `/api/admin/collections/${collectionId}/books/${book.id}`,
        { method: "DELETE" },
      );

      setMemberBooks((prev) => prev.filter((b) => b.id !== book.id));
      addNotification(
        "success",
        `Removed "${book.title}" from "${collectionName}"`,
      );
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to remove book. Please try again.";
      addNotification("error", message);
    } finally {
      setRemovingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div
          className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent"
          style={{
            borderColor: "#c9a86a",
            borderTopColor: "transparent",
          }}
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
        <ThemedButton onClick={fetchData}>Retry</ThemedButton>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Add Book button */}
      <div className="flex items-center justify-between mb-6">
        <p className="font-body text-sm" style={{ color: "#a07830" }}>
          {memberBooks.length} {memberBooks.length === 1 ? "book" : "books"} in
          this collection
        </p>
        <ThemedButton onClick={() => setShowPicker(true)}>
          Add Book
        </ThemedButton>
      </div>

      {/* Member books list */}
      {memberBooks.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <p className="font-body text-sm" style={{ color: "#a07830" }}>
            No books in this collection yet. Add some to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid rgba(201,168,106,0.2)",
                }}
              >
                {["Position", "Title", "Author", "Actions"].map((heading) => (
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
              {memberBooks.map((book, index) => (
                <tr
                  key={book.id}
                  style={{
                    backgroundColor:
                      index % 2 === 0 ? "#1a0f0a" : "rgba(42,24,16,0.5)",
                  }}
                >
                  <td
                    className="px-4 py-3 font-body text-sm"
                    style={{ color: "#c9a86a" }}
                  >
                    {book.position}
                  </td>
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
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <ThemedButton
                        onClick={() => handleMoveUp(book)}
                        disabled={index === 0 || reorderingId !== null}
                        aria-label={`Move "${book.title}" up`}
                      >
                        ↑ Up
                      </ThemedButton>
                      <ThemedButton
                        onClick={() => handleMoveDown(book)}
                        disabled={
                          index === memberBooks.length - 1 ||
                          reorderingId !== null
                        }
                        aria-label={`Move "${book.title}" down`}
                      >
                        ↓ Down
                      </ThemedButton>
                      <DangerButton
                        onClick={() => handleRemoveBook(book)}
                        disabled={removingId === book.id}
                        aria-label={`Remove "${book.title}" from collection`}
                      >
                        {removingId === book.id ? "Removing…" : "Remove"}
                      </DangerButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Book Picker Modal */}
      {showPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Add book to collection"
        >
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close picker"
            style={{ background: "rgba(0, 0, 0, 0.7)", border: "none" }}
            onClick={() => setShowPicker(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowPicker(false);
            }}
          />

          {/* Picker dialog */}
          <div
            className="relative w-full max-w-lg mx-4 rounded-sm max-h-[80vh] flex flex-col"
            style={{
              background: "#2a1810",
              border: "1px solid #c9a86a",
            }}
          >
            <div
              className="flex items-center justify-between p-4"
              style={{
                borderBottom: "1px solid rgba(201,168,106,0.2)",
              }}
            >
              <h2
                className="font-headline text-lg"
                style={{ color: "#f5e9cf" }}
              >
                Add Book
              </h2>
              <ThemedButton
                onClick={() => setShowPicker(false)}
                aria-label="Close picker"
              >
                ✕
              </ThemedButton>
            </div>

            <div className="overflow-y-auto p-4 flex-1">
              {nonMemberBooks.length === 0 ? (
                <p
                  className="font-body text-sm text-center py-8"
                  style={{ color: "#a07830" }}
                >
                  All books are already in this collection.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {nonMemberBooks.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center justify-between p-3 rounded-sm"
                      style={{
                        background: "#1a0f0a",
                        border: "1px solid rgba(201,168,106,0.15)",
                      }}
                    >
                      <div>
                        <p
                          className="font-body text-sm"
                          style={{
                            color: "#f5e9cf",
                          }}
                        >
                          {book.title}
                        </p>
                        <p
                          className="font-body text-xs"
                          style={{
                            color: "#a07830",
                          }}
                        >
                          {book.author}
                        </p>
                      </div>
                      <ThemedButton
                        onClick={() => handleAddBook(book)}
                        disabled={addingId === book.id}
                      >
                        {addingId === book.id ? "Adding…" : "Add"}
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
