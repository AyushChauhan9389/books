"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Collection } from "@/lib/types";
import { ApiError, adminFetch } from "../../../components/api";
import { MembershipManager } from "../../../components/membership-manager";
import { PageHeader } from "../../../components/page-header";
import { Spinner, ThemedButton } from "../../../components/themed-ui";

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
      const collections = await adminFetch<Collection[]>("/api/admin/collections");
      const collection = collections.find((c) => c.id === collectionId);
      if (collection) {
        setCollectionName(collection.name);
      } else {
        setError("Collection not found.");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load collection.");
    } finally {
      setLoading(false);
    }
  }, [collectionId]);

  useEffect(() => { fetchCollection(); }, [fetchCollection]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <Spinner />
        <span className="font-body text-sm" style={{ color: "rgba(245,233,207,0.6)" }}>Loading collection…</span>
      </div>
    );
  }

  if (error || !collectionName) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="font-body text-sm" style={{ color: "#ff9999" }}>{error ?? "Collection not found."}</p>
        <Link href="/admin/collections">
          <ThemedButton>← Back to Collections</ThemedButton>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2">
        <Link
          href="/admin/collections"
          className="font-label text-[10px] uppercase tracking-[0.15em] inline-flex items-center gap-1.5 transition-colors"
          style={{ color: "rgba(201,168,106,0.4)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#c9a86a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(201,168,106,0.4)"; }}
        >
          ← Collections
        </Link>
      </div>
      <PageHeader title={collectionName} subtitle="Manage book membership and ordering" decoration="scroll" />
      <MembershipManager collectionId={collectionId} collectionName={collectionName} />
    </div>
  );
}
