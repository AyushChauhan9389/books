"use client";

import { type FormEvent, useState } from "react";
import type { Collection } from "@/lib/types";
import { ApiError, adminFetch } from "./api";
import { useNotification } from "./notification";
import { PrimaryButton, Spinner, ThemedButton, ThemedInput, ThemedLabel, ThemedTextarea, ThemedToggle } from "./themed-ui";

type CollectionFormProps = {
  collection?: Collection | null;
  onSave: (collection: Collection) => void;
  onClose: () => void;
};

type CollectionFormValues = {
  name: string;
  slug: string;
  description: string;
  isReception: boolean;
  displayOrder: number;
};

export function collectionToFormValues(collection: Collection): CollectionFormValues {
  return {
    name: collection.name, slug: collection.slug, description: collection.description ?? "",
    isReception: collection.isReception, displayOrder: collection.displayOrder,
  };
}

export function collectionFormToPayload(form: CollectionFormValues) {
  return {
    name: form.name, slug: form.slug, description: form.description || null,
    isReception: form.isReception, displayOrder: form.displayOrder,
  };
}

const DEFAULT_VALUES: CollectionFormValues = { name: "", slug: "", description: "", isReception: false, displayOrder: 0 };

export function CollectionForm({ collection, onSave, onClose }: CollectionFormProps) {
  const isEdit = !!collection;
  const initial = collection ? collectionToFormValues(collection) : DEFAULT_VALUES;

  const [name, setName] = useState(initial.name);
  const [slug, setSlug] = useState(initial.slug);
  const [description, setDescription] = useState(initial.description);
  const [isReception, setIsReception] = useState(initial.isReception);
  const [displayOrder, setDisplayOrder] = useState(initial.displayOrder);

  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { addNotification } = useNotification();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!slug.trim()) errors.slug = "Slug is required";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload = collectionFormToPayload({ name, slug, description, isReception, displayOrder });
    setSaving(true);
    setFieldErrors({});

    try {
      let saved: Collection;
      if (isEdit) {
        saved = await adminFetch<Collection>(`/api/admin/collections/${collection.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        saved = await adminFetch<Collection>("/api/admin/collections", { method: "POST", body: JSON.stringify(payload) });
      }
      addNotification("success", isEdit ? "Collection updated" : "Collection created");
      onSave(saved);
    } catch (err) {
      if (err instanceof ApiError && err.field) setFieldErrors({ [err.field]: err.message });
      else if (err instanceof ApiError) addNotification("error", err.message);
      else addNotification("error", "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  }

  function renderField(id: string, label: string, input: React.ReactNode) {
    return (
      <div className="flex flex-col gap-1">
        <ThemedLabel htmlFor={id}>{label}</ThemedLabel>
        {input}
        {fieldErrors[id] && (
          <span className="text-[11px] font-body" style={{ color: "#ff9999" }} role="alert">{fieldErrors[id]}</span>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="collection-form-title">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close dialog"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", border: "none" }}
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
      />

      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg"
        style={{ background: "#1a0f0a", border: "1px solid rgba(201,168,106,0.2)", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4" style={{ background: "#1a0f0a", borderBottom: "1px solid rgba(201,168,106,0.1)" }}>
          <h2 id="collection-form-title" className="font-headline text-lg font-bold" style={{ color: "#f5e9cf" }}>
            {isEdit ? "Edit Collection" : "New Collection"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded transition-colors cursor-pointer"
            style={{ color: "rgba(245,233,207,0.4)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(201,168,106,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {renderField("name", "Name", <ThemedInput id="name" name="name" aria-label="Name" value={name} onChange={(e) => setName(e.target.value)} />)}
          {renderField("slug", "Slug", <ThemedInput id="slug" name="slug" aria-label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. my-collection" />)}
          {renderField("description", "Description (optional)", <ThemedTextarea id="description" name="description" aria-label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />)}

          <div className="flex flex-col gap-1">
            <ThemedLabel htmlFor="isReception">Reception Collection</ThemedLabel>
            <div className="flex items-center gap-3">
              <ThemedToggle id="isReception" name="isReception" aria-label="Reception Collection" checked={isReception} onChange={setIsReception} />
              <span className="text-sm font-body" style={{ color: isReception ? "#c9a86a" : "rgba(245,233,207,0.5)" }}>
                {isReception ? "Shown in reception" : "Hidden from reception"}
              </span>
            </div>
          </div>

          {renderField("displayOrder", "Display Order", <ThemedInput id="displayOrder" name="displayOrder" aria-label="Display Order" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number.parseInt(e.target.value, 10) || 0)} />)}

          <div className="flex justify-end gap-3 mt-2 pt-4" style={{ borderTop: "1px solid rgba(201,168,106,0.1)" }}>
            <ThemedButton type="button" onClick={onClose} disabled={saving}>Cancel</ThemedButton>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? <span className="inline-flex items-center gap-2"><Spinner size={14} />Saving…</span> : isEdit ? "Update" : "Create"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
