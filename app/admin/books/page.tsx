"use client";

import { useCallback, useEffect, useState } from "react";
import type { Book } from "@/lib/types";
import { ApiError, adminFetch } from "../components/api";
import { BookForm } from "../components/book-form";
import { BookList } from "../components/book-list";
import { ConfirmDialog } from "../components/confirm-dialog";
import { useNotification } from "../components/notification";
import { PageHeader } from "../components/page-header";
import { ThemedButton } from "../components/themed-ui";

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
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to load books. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  function handleEdit(book: Book) {
    setEditingBook(book);
  }

  function handleEditSave(updatedBook: Book) {
    setBooks((prev) =>
      prev.map((b) => (b.id === updatedBook.id ? updatedBook : b)),
    );
    setEditingBook(null);
  }

  function handleCreateSave(newBook: Book) {
    setBooks((prev) => [...prev, newBook]);
    setShowCreateForm(false);
  }

  function handleDeleteRequest(book: Book) {
    setDeletingBook(book);
  }

  async function handleDeleteConfirm() {
    if (!deletingBook) return;

    setDeleteLoading(true);
    try {
      await adminFetch(`/api/admin/books/${deletingBook.id}`, {
        method: "DELETE",
      });
      setBooks((prev) => prev.filter((b) => b.id !== deletingBook.id));
      addNotification(
        "success",
        `"${deletingBook.title}" deleted successfully`,
      );
      setDeletingBook(null);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to delete book. Please try again.";
      addNotification("error", message);
    } finally {
      setDeleteLoading(false);
    }
  }

  function handleDeleteCancel() {
    setDeletingBook(null);
  }

  return (
    <div>
      <PageHeader
        title="Books"
        decoration="book"
        action={
          <ThemedButton onClick={() => setShowCreateForm(true)}>
            New Book
          </ThemedButton>
        }
      />

      <BookList
        books={books}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        loading={loading}
        error={error}
        onRetry={fetchBooks}
      />

      {showCreateForm && (
        <BookForm
          onSave={handleCreateSave}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {editingBook && (
        <BookForm
          book={editingBook}
          onSave={handleEditSave}
          onClose={() => setEditingBook(null)}
        />
      )}

      {deletingBook && (
        <ConfirmDialog
          title={`Delete "${deletingBook.title}"?`}
          message={`Are you sure you want to delete "${deletingBook.title}"? This will also remove it from all collections.`}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
