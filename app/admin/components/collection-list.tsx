"use client";

import type { Collection } from "@/lib/types";
import { DangerButton, ThemedButton } from "./themed-ui";

type CollectionListProps = {
  collections: Collection[];
  onEdit: (collection: Collection) => void;
  onDelete: (collection: Collection) => void;
  onManageBooks: (collection: Collection) => void;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
};

export function CollectionList({
  collections,
  onEdit,
  onDelete,
  onManageBooks,
  loading,
  error,
  onRetry,
}: CollectionListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div
          className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent"
          style={{ borderColor: "#c9a86a", borderTopColor: "transparent" }}
        />
        <span className="ml-3 font-body text-sm" style={{ color: "#f5e9cf" }}>
          Loading collections…
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

  if (collections.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="font-body text-sm" style={{ color: "#a07830" }}>
          No collections found. Create one to get started.
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
            {["Name", "Slug", "Reception", "Order", "Actions"].map(
              (heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 font-label text-xs uppercase tracking-wider"
                  style={{ color: "#a07830" }}
                >
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {collections.map((collection, index) => (
            <tr
              key={collection.id}
              style={{
                backgroundColor:
                  index % 2 === 0 ? "#1a0f0a" : "rgba(42,24,16,0.5)",
              }}
            >
              <td
                className="px-4 py-3 font-body text-sm"
                style={{ color: "#f5e9cf" }}
              >
                {collection.name}
              </td>
              <td
                className="px-4 py-3 font-body text-sm"
                style={{ color: "#f5e9cf" }}
              >
                {collection.slug}
              </td>
              <td className="px-4 py-3">
                {collection.isReception ? (
                  <span
                    className="inline-block px-2 py-0.5 rounded-sm font-label text-xs uppercase tracking-wider"
                    style={{
                      backgroundColor: "rgba(201,168,106,0.15)",
                      color: "#c9a86a",
                      border: "1px solid rgba(201,168,106,0.3)",
                    }}
                  >
                    Reception
                  </span>
                ) : (
                  <span
                    className="font-body text-sm"
                    style={{ color: "#a07830" }}
                  >
                    —
                  </span>
                )}
              </td>
              <td
                className="px-4 py-3 font-body text-sm"
                style={{ color: "#c9a86a" }}
              >
                {collection.displayOrder}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <ThemedButton onClick={() => onEdit(collection)}>
                    Edit
                  </ThemedButton>
                  <ThemedButton onClick={() => onManageBooks(collection)}>
                    Manage Books
                  </ThemedButton>
                  <DangerButton onClick={() => onDelete(collection)}>
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
