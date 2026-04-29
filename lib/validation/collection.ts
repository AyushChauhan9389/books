import type { Collection } from "../types";
import type { ErrorResponse } from "./book";

export type CollectionInput = Omit<Collection, "id"> & {
  description?: string | null;
  isReception?: boolean;
  displayOrder?: number;
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateCollectionInput(
  input: unknown,
): { data: CollectionInput } | { error: ErrorResponse } {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { error: { error: "Invalid request body" } };
  }

  const body = input as Record<string, unknown>;

  // Validate name is present and non-empty
  if (body.name === undefined || body.name === null) {
    return { error: { error: "Missing required field: name", field: "name" } };
  }
  if (typeof body.name !== "string" || body.name.trim().length === 0) {
    return { error: { error: "Missing required field: name", field: "name" } };
  }

  // Validate slug is present
  if (body.slug === undefined || body.slug === null) {
    return { error: { error: "Missing required field: slug", field: "slug" } };
  }
  if (typeof body.slug !== "string" || body.slug.trim().length === 0) {
    return { error: { error: "Missing required field: slug", field: "slug" } };
  }

  // Validate slug matches URL-safe pattern
  if (!SLUG_PATTERN.test(body.slug)) {
    return {
      error: {
        error: "Slug must be URL-safe (lowercase alphanumeric and hyphens)",
        field: "slug",
      },
    };
  }

  return {
    data: {
      name: (body.name as string).trim(),
      slug: body.slug as string,
      description: (body.description as string | null | undefined) ?? null,
      isReception: typeof body.isReception === "boolean" ? body.isReception : false,
      displayOrder: typeof body.displayOrder === "number" ? body.displayOrder : 0,
    },
  };
}
