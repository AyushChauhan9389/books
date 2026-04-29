"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Collection } from "@/lib/types";
import { ApiError, adminFetch } from "../../../components/api";
import { MembershipManager } from "../../../components/membership-manager";
import { PageHeader } from "../../../components/page-header";

export default function CollectionBooksPage() {
  const params = useParams<{ id: string }>();
  const collectionId = params.id;

  const [collectionName, setCollectionName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollection = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const collections = await adminFetch<Collection[]>(
        "/api/admin/collections",
      );
      const collection = collections.find((c) => c.id === collectionId);
      if (collection) {
        setCollectionName(collection.name);
      } else {
        setError("Collection not found.");
      }
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to load collection details. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [collectionId]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

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
          Loading collection…
        </span>
      </div>
    );
  }

  if (error || !collectionName) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <p className="font-body text-sm" style={{ color: "#ff9999" }}>
          {error ?? "Collection not found."}
        </p>
        <Link
          href="/admin/collections"
          className="font-label text-xs uppercase tracking-wider"
          style={{ color: "#c9a86a" }}
        >
          ← Back to Collections
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/collections"
          className="font-label text-xs uppercase tracking-wider inline-flex items-center gap-1 transition-opacity hover:opacity-80"
          style={{ color: "#c9a86a" }}
        >
          ← Back to Collections
        </Link>
        <PageHeader
          title={`Manage Books — ${collectionName}`}
          decoration="scroll"
        />
      </div>

      <MembershipManager
        collectionId={collectionId}
        collectionName={collectionName}
      />
    </div>
  );
}
