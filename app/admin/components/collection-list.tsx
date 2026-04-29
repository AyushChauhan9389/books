"use client";

import type { Collection } from "@/lib/types";
import { Badge, Card, DangerButton, EmptyState, Spinner, ThemedButton } from "./themed-ui";

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
      <div className="flex items-center justify-center py-20 gap-3">
        <Spinner />
        <span className="font-body text-sm" style={{ color: "rgba(245,233,207,0.6)" }}>
          Loading collections…
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Failed to load collections"
        description={error}
        action={onRetry && <ThemedButton onClick={onRetry}>Retry</ThemedButton>}
      />
    );
  }

  if (collections.length === 0) {
    return (
      <EmptyState
        icon={
          <svg width="48" height="48" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
            <rect x="2" y="4" width="12" height="10" fill="#785023" opacity="0.4" />
            <rect x="2" y="4" width="12" height="4" fill="#996a33" opacity="0.4" />
            <rect x="7" y="7" width="2" height="3" fill="#cfcfcc" opacity="0.4" />
          </svg>
        }
        title="No collections yet"
        description="Create your first collection to organize books."
      />
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {collections.map((collection) => (
        <Card key={collection.id} className="flex flex-col">
          <div className="p-5 flex-1">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-headline text-base font-bold truncate" style={{ color: "#f5e9cf" }}>
                  {collection.name}
                </h3>
                <p className="font-mono text-[11px] mt-0.5" style={{ color: "rgba(201,168,106,0.4)" }}>
                  /{collection.slug}
                </p>
              </div>
              {collection.isReception && <Badge variant="gold">Reception</Badge>}
            </div>

            {/* Description */}
            {collection.description && (
              <p className="font-body text-sm mb-3 line-clamp-2" style={{ color: "rgba(245,233,207,0.6)" }}>
                {collection.description}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-3">
              <Badge variant="muted">Order: {collection.displayOrder}</Badge>
            </div>
          </div>

          {/* Actions */}
          <div
            className="px-5 py-3 flex items-center gap-2"
            style={{ borderTop: "1px solid rgba(201,168,106,0.08)" }}
          >
            <ThemedButton onClick={() => onManageBooks(collection)}>
              Books
            </ThemedButton>
            <ThemedButton onClick={() => onEdit(collection)}>
              Edit
            </ThemedButton>
            <div className="ml-auto">
              <DangerButton onClick={() => onDelete(collection)}>
                Delete
              </DangerButton>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
