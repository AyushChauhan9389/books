"use client";

import { useCallback, useEffect, useState } from "react";
import type { Book } from "@/lib/types";
import { ApiError, adminFetch } from "../components/api";
import { BookForm } from "../components/book-form";
import { BookList } from "../components/book-list";
import { ConfirmDialog } from "../components/confirm-dialog";
import { useNotification } from "../components/notification";
import { PageHeader } from "../components/page-header";
import { PrimaryButton } from "../components/themed-ui";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { addNotification } = useNotification();

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminFetch<Book[]>("/api/admin/books");
      setBooks(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load books.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  async function handleDeleteConfirm() {
    if (!deletingBook) return;
    setDeleteLoading(true);
    try {
      await adminFetch(`/api/admin/books/${deletingBook.id}`, { method: "DELETE" });
      setBooks((prev) => prev.filter((b) => b.id !== deletingBook.id));
      addNotification("success", `"${deletingBook.title}" deleted`);
      setDeletingBook(null);
    } catch (err) {
      addNotification("error", err instanceof ApiError ? err.message : "Failed to delete book.");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Books"
        subtitle={`Manage your library's collection of tomes`}
        decoration="book"
        action={
          <PrimaryButton onClick={() => setShowCreateForm(true)}>
            + New Book
          </PrimaryButton>
        }
      />

      <BookList
        books={books}
        onEdit={setEditingBook}
        onDelete={setDeletingBook}
        loading={loading}
        error={error}
        onRetry={fetchBooks}
      />

      {showCreateForm && (
        <BookForm
          onSave={(newBook) => { setBooks((prev) => [...prev, newBook]); setShowCreateForm(false); }}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {editingBook && (
        <BookForm
          book={editingBook}
          onSave={(updated) => { setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b))); setEditingBook(null); }}
          onClose={() => setEditingBook(null)}
        />
      )}

      {deletingBook && (
        <ConfirmDialog
          title={`Delete "${deletingBook.title}"?`}
          message="This will permanently remove the book and its membership in all collections."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingBook(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
