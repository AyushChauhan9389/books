import type { Book } from "../types";

export type ErrorResponse = {
  error: string;
  field?: string;
};

export type BookInput = Omit<Book, "id"> & { starColor?: string | null };

const REQUIRED_FIELDS = [
  "title",
  "author",
  "stars",
  "bgColor",
  "textColor",
  "width",
  "height",
  "titleSize",
  "titleWeight",
  "titleTracking",
] as const;

export function validateBookInput(
  input: unknown,
): { data: BookInput } | { error: ErrorResponse } {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { error: { error: "Invalid request body" } };
  }

  const body = input as Record<string, unknown>;

  // Check all required fields are present and not undefined/null
  for (const field of REQUIRED_FIELDS) {
    if (body[field] === undefined || body[field] === null) {
      return { error: { error: `Missing required field: ${field}`, field } };
    }
  }

  // Validate title is non-empty after trimming
  if (typeof body.title !== "string" || body.title.trim().length === 0) {
    return { error: { error: "Title must not be empty", field: "title" } };
  }

  // Validate author is a string
  if (typeof body.author !== "string") {
    return { error: { error: "Missing required field: author", field: "author" } };
  }

  // Validate stars is an integer between 1 and 5
  if (
    typeof body.stars !== "number" ||
    !Number.isInteger(body.stars) ||
    body.stars < 1 ||
    body.stars > 5
  ) {
    return { error: { error: "Stars must be between 1 and 5", field: "stars" } };
  }

  // Validate string fields
  for (const field of ["bgColor", "textColor", "titleSize", "titleWeight", "titleTracking"] as const) {
    if (typeof body[field] !== "string") {
      return { error: { error: `Missing required field: ${field}`, field } };
    }
  }

  // Validate numeric fields
  for (const field of ["width", "height"] as const) {
    if (typeof body[field] !== "number") {
      return { error: { error: `Missing required field: ${field}`, field } };
    }
  }

  return {
    data: {
      title: (body.title as string).trim(),
      author: body.author as string,
      stars: body.stars as number,
      bgColor: body.bgColor as string,
      textColor: body.textColor as string,
      starColor: (body.starColor as string | null | undefined) ?? null,
      width: body.width as number,
      height: body.height as number,
      titleSize: body.titleSize as string,
      titleWeight: body.titleWeight as string,
      titleTracking: body.titleTracking as string,
    },
  };
}
