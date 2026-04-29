"use client";

import { type FormEvent, useState } from "react";
import type { Collection } from "@/lib/types";
import { ApiError, adminFetch } from "./api";
import { useNotification } from "./notification";
import {
  ThemedButton,
  ThemedInput,
  ThemedLabel,
  ThemedTextarea,
  ThemedToggle,
} from "./themed-ui";

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

/** Convert a Collection into form field values. */
export function collectionToFormValues(
  collection: Collection,
): CollectionFormValues {
  return {
    name: collection.name,
    slug: collection.slug,
    description: collection.description ?? "",
    isReception: collection.isReception,
    displayOrder: collection.displayOrder,
  };
}

/** Extract form values into an API-ready payload (excluding id). */
export function collectionFormToPayload(form: CollectionFormValues) {
  return {
    name: form.name,
    slug: form.slug,
    description: form.description || null,
    isReception: form.isReception,
    displayOrder: form.displayOrder,
  };
}

const DEFAULT_VALUES: CollectionFormValues = {
  name: "",
  slug: "",
  description: "",
  isReception: false,
  displayOrder: 0,
};

export function CollectionForm({
  collection,
  onSave,
  onClose,
}: CollectionFormProps) {
  const isEdit = !!collection;
  const initial = collection
    ? collectionToFormValues(collection)
    : DEFAULT_VALUES;

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

    const payload = collectionFormToPayload({
      name,
      slug,
      description,
      isReception,
      displayOrder,
    });

    setSaving(true);
    setFieldErrors({});

    try {
      let saved: Collection;
      if (isEdit) {
        saved = await adminFetch<Collection>(
          `/api/admin/collections/${collection.id}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          },
        );
      } else {
        saved = await adminFetch<Collection>("/api/admin/collections", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      addNotification(
        "success",
        isEdit
          ? "Collection updated successfully"
          : "Collection created successfully",
      );
      onSave(saved);
    } catch (err) {
      if (err instanceof ApiError && err.field) {
        setFieldErrors({ [err.field]: err.message });
      } else if (err instanceof ApiError) {
        addNotification("error", err.message);
      } else {
        addNotification("error", "An unexpected error occurred");
      }
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
          <span
            className="text-xs font-body"
            style={{ color: "#ff9999" }}
            role="alert"
          >
            {fieldErrors[id]}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-form-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close dialog"
        style={{ background: "rgba(0, 0, 0, 0.7)", border: "none" }}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto rounded-sm p-6"
        style={{
          background: "#2a1810",
          border: "1px solid #c9a86a",
        }}
      >
        <h2
          id="collection-form-title"
          className="font-headline text-lg mb-5"
          style={{ color: "#f5e9cf" }}
        >
          {isEdit ? "Edit Collection" : "Create Collection"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          {renderField(
            "name",
            "Name",
            <ThemedInput
              id="name"
              name="name"
              aria-label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />,
          )}

          {/* Slug */}
          {renderField(
            "slug",
            "Slug",
            <ThemedInput
              id="slug"
              name="slug"
              aria-label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. my-collection"
            />,
          )}

          {/* Description (optional) */}
          {renderField(
            "description",
            "Description (optional)",
            <ThemedTextarea
              id="description"
              name="description"
              aria-label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />,
          )}

          {/* isReception toggle */}
          <div className="flex flex-col gap-1">
            <ThemedLabel htmlFor="isReception">
              Reception Collection
            </ThemedLabel>
            <div className="flex items-center gap-3">
              <ThemedToggle
                id="isReception"
                name="isReception"
                aria-label="Reception Collection"
                checked={isReception}
                onChange={setIsReception}
              />
              <span className="text-sm font-body" style={{ color: "#f5e9cf" }}>
                {isReception ? "Yes" : "No"}
              </span>
            </div>
            {fieldErrors.isReception && (
              <span
                className="text-xs font-body"
                style={{ color: "#ff9999" }}
                role="alert"
              >
                {fieldErrors.isReception}
              </span>
            )}
          </div>

          {/* Display Order */}
          {renderField(
            "displayOrder",
            "Display Order",
            <ThemedInput
              id="displayOrder"
              name="displayOrder"
              aria-label="Display Order"
              type="number"
              value={displayOrder}
              onChange={(e) =>
                setDisplayOrder(Number.parseInt(e.target.value, 10) || 0)
              }
            />,
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-[#c9a86a]/20">
            <ThemedButton type="button" onClick={onClose} disabled={saving}>
              Cancel
            </ThemedButton>
            <ThemedButton type="submit" disabled={saving}>
              {saving ? (
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
                  Saving…
                </span>
              ) : isEdit ? (
                "Update Collection"
              ) : (
                "Create Collection"
              )}
            </ThemedButton>
          </div>
        </form>
      </div>
    </div>
  );
}
