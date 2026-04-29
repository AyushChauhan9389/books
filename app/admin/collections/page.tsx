"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Collection } from "@/lib/types";
import { ApiError, adminFetch } from "../components/api";
import { CollectionForm } from "../components/collection-form";
import { CollectionList } from "../components/collection-list";
import { ConfirmDialog } from "../components/confirm-dialog";
import { useNotification } from "../components/notification";
import { PageHeader } from "../components/page-header";
import { ThemedButton } from "../components/themed-ui";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null,
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deletingCollection, setDeletingCollection] =
    useState<Collection | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { addNotification } = useNotification();
  const router = useRouter();

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminFetch<Collection[]>("/api/admin/collections");
      setCollections(data);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to load collections. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  function handleEdit(collection: Collection) {
    setEditingCollection(collection);
  }

  function handleEditSave(updatedCollection: Collection) {
    setCollections((prev) =>
      prev.map((c) => (c.id === updatedCollection.id ? updatedCollection : c)),
    );
    setEditingCollection(null);
  }

  function handleCreateSave(newCollection: Collection) {
    setCollections((prev) => [...prev, newCollection]);
    setShowCreateForm(false);
  }

  function handleManageBooks(collection: Collection) {
    router.push(`/admin/collections/${collection.id}/books`);
  }

  function handleDeleteRequest(collection: Collection) {
    setDeletingCollection(collection);
  }

  async function handleDeleteConfirm() {
    if (!deletingCollection) return;

    setDeleteLoading(true);
    try {
      await adminFetch(`/api/admin/collections/${deletingCollection.id}`, {
        method: "DELETE",
      });
      setCollections((prev) =>
        prev.filter((c) => c.id !== deletingCollection.id),
      );
      addNotification(
        "success",
        `"${deletingCollection.name}" deleted successfully`,
      );
      setDeletingCollection(null);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to delete collection. Please try again.";
      addNotification("error", message);
    } finally {
      setDeleteLoading(false);
    }
  }

  function handleDeleteCancel() {
    setDeletingCollection(null);
  }

  return (
    <div>
      <PageHeader
        title="Collections"
        decoration="chest"
        action={
          <ThemedButton onClick={() => setShowCreateForm(true)}>
            New Collection
          </ThemedButton>
        }
      />

      <CollectionList
        collections={collections}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onManageBooks={handleManageBooks}
        loading={loading}
        error={error}
        onRetry={fetchCollections}
      />

      {showCreateForm && (
        <CollectionForm
          onSave={handleCreateSave}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {editingCollection && (
        <CollectionForm
          collection={editingCollection}
          onSave={handleEditSave}
          onClose={() => setEditingCollection(null)}
        />
      )}

      {deletingCollection && (
        <ConfirmDialog
          title={`Delete "${deletingCollection.name}"?`}
          message={`Are you sure you want to delete "${deletingCollection.name}"? This will remove all book memberships in this collection.`}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
