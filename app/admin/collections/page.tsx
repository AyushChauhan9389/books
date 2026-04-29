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
import { PrimaryButton } from "../components/themed-ui";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deletingCollection, setDeletingCollection] = useState<Collection | null>(null);
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
      setError(err instanceof ApiError ? err.message : "Failed to load collections.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCollections(); }, [fetchCollections]);

  async function handleDeleteConfirm() {
    if (!deletingCollection) return;
    setDeleteLoading(true);
    try {
      await adminFetch(`/api/admin/collections/${deletingCollection.id}`, { method: "DELETE" });
      setCollections((prev) => prev.filter((c) => c.id !== deletingCollection.id));
      addNotification("success", `"${deletingCollection.name}" deleted`);
      setDeletingCollection(null);
    } catch (err) {
      addNotification("error", err instanceof ApiError ? err.message : "Failed to delete collection.");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Collections"
        subtitle="Organize books into themed rooms"
        decoration="chest"
        action={
          <PrimaryButton onClick={() => setShowCreateForm(true)}>
            + New Collection
          </PrimaryButton>
        }
      />

      <CollectionList
        collections={collections}
        onEdit={setEditingCollection}
        onDelete={setDeletingCollection}
        onManageBooks={(c) => router.push(`/admin/collections/${c.id}/books`)}
        loading={loading}
        error={error}
        onRetry={fetchCollections}
      />

      {showCreateForm && (
        <CollectionForm
          onSave={(newCol) => { setCollections((prev) => [...prev, newCol]); setShowCreateForm(false); }}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {editingCollection && (
        <CollectionForm
          collection={editingCollection}
          onSave={(updated) => { setCollections((prev) => prev.map((c) => (c.id === updated.id ? updated : c))); setEditingCollection(null); }}
          onClose={() => setEditingCollection(null)}
        />
      )}

      {deletingCollection && (
        <ConfirmDialog
          title={`Delete "${deletingCollection.name}"?`}
          message="This will remove the collection and all book memberships within it."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingCollection(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
