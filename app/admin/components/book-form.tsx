"use client";

import { type FormEvent, useState } from "react";
import type { Book } from "@/lib/types";
import { ApiError, adminFetch } from "./api";
import { BookSpinePreview } from "./book-spine-preview";
import { useNotification } from "./notification";
import { ThemedButton, ThemedInput, ThemedLabel } from "./themed-ui";

type BookFormProps = {
  book?: Book | null;
  onSave: (book: Book) => void;
  onClose: () => void;
};

/** Extract form values into an API-ready payload (excluding id). */
export function bookFormToPayload(form: {
  title: string;
  author: string;
  stars: number;
  bgColor: string;
  textColor: string;
  starColor: string;
  width: number;
  height: number;
  titleSize: string;
  titleWeight: string;
  titleTracking: string;
}) {
  return {
    title: form.title,
    author: form.author,
    stars: form.stars,
    bgColor: form.bgColor,
    textColor: form.textColor,
    starColor: form.starColor || null,
    width: form.width,
    height: form.height,
    titleSize: form.titleSize,
    titleWeight: form.titleWeight,
    titleTracking: form.titleTracking,
  };
}

/** Convert a Book into form field values. */
export function bookToFormValues(book: Book) {
  return {
    title: book.title,
    author: book.author,
    stars: book.stars,
    bgColor: book.bgColor,
    textColor: book.textColor,
    starColor: book.starColor ?? "",
    width: book.width,
    height: book.height,
    titleSize: book.titleSize,
    titleWeight: book.titleWeight,
    titleTracking: book.titleTracking,
  };
}

const DEFAULT_VALUES = {
  title: "",
  author: "",
  stars: 3,
  bgColor: "#2a1810",
  textColor: "text-amber-100",
  starColor: "",
  width: 60,
  height: 400,
  titleSize: "text-base",
  titleWeight: "font-bold",
  titleTracking: "tracking-widest",
};

export function BookForm({ book, onSave, onClose }: BookFormProps) {
  const isEdit = !!book;
  const initial = book ? bookToFormValues(book) : DEFAULT_VALUES;

  const [title, setTitle] = useState(initial.title);
  const [author, setAuthor] = useState(initial.author);
  const [stars, setStars] = useState(initial.stars);
  const [bgColor, setBgColor] = useState(initial.bgColor);
  const [textColor, setTextColor] = useState(initial.textColor);
  const [starColor, setStarColor] = useState(initial.starColor);
  const [width, setWidth] = useState(initial.width);
  const [height, setHeight] = useState(initial.height);
  const [titleSize, setTitleSize] = useState(initial.titleSize);
  const [titleWeight, setTitleWeight] = useState(initial.titleWeight);
  const [titleTracking, setTitleTracking] = useState(initial.titleTracking);

  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { addNotification } = useNotification();

  function validateFields(): boolean {
    const errors: Record<string, string> = {};
    if (!title.trim()) errors.title = "Title must not be empty";
    if (!author.trim()) errors.author = "Author is required";
    if (!Number.isInteger(stars) || stars < 1 || stars > 5)
      errors.stars = "Stars must be between 1 and 5";
    if (!bgColor) errors.bgColor = "Background color is required";
    if (!textColor) errors.textColor = "Text color is required";
    if (!titleSize) errors.titleSize = "Title size is required";
    if (!titleWeight) errors.titleWeight = "Title weight is required";
    if (!titleTracking) errors.titleTracking = "Title tracking is required";
    if (typeof width !== "number" || Number.isNaN(width))
      errors.width = "Width is required";
    if (typeof height !== "number" || Number.isNaN(height))
      errors.height = "Height is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateFields()) return;

    const payload = bookFormToPayload({
      title,
      author,
      stars,
      bgColor,
      textColor,
      starColor,
      width,
      height,
      titleSize,
      titleWeight,
      titleTracking,
    });

    setSaving(true);
    setFieldErrors({});

    try {
      let saved: Book;
      if (isEdit) {
        saved = await adminFetch<Book>(`/api/admin/books/${book.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        saved = await adminFetch<Book>("/api/admin/books", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      addNotification(
        "success",
        isEdit ? "Book updated successfully" : "Book created successfully",
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
      aria-labelledby="book-form-title"
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
        className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto rounded-sm p-6"
        style={{
          background: "#2a1810",
          border: "1px solid #c9a86a",
        }}
      >
        <h2
          id="book-form-title"
          className="font-headline text-lg mb-5"
          style={{ color: "#f5e9cf" }}
        >
          {isEdit ? "Edit Book" : "Create Book"}
        </h2>

        <div className="flex gap-6">
          {/* Form fields */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 grid grid-cols-2 gap-x-4 gap-y-3 content-start"
          >
            {/* Title — full width */}
            <div className="col-span-2">
              {renderField(
                "title",
                "Title",
                <ThemedInput
                  id="title"
                  name="title"
                  aria-label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />,
              )}
            </div>

            {/* Author — full width */}
            <div className="col-span-2">
              {renderField(
                "author",
                "Author",
                <ThemedInput
                  id="author"
                  name="author"
                  aria-label="Author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />,
              )}
            </div>

            {/* Stars */}
            {renderField(
              "stars",
              "Stars (1-5)",
              <ThemedInput
                id="stars"
                name="stars"
                aria-label="Stars"
                type="number"
                min={1}
                max={5}
                value={stars}
                onChange={(e) =>
                  setStars(Number.parseInt(e.target.value, 10) || 0)
                }
              />,
            )}

            {/* Background Color */}
            {renderField(
              "bgColor",
              "Background Color",
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-sm border-0 cursor-pointer"
                  style={{ background: "transparent" }}
                  aria-label="Background color picker"
                />
                <ThemedInput
                  id="bgColor"
                  name="bgColor"
                  aria-label="Background Color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
              </div>,
            )}

            {/* Text Color */}
            {renderField(
              "textColor",
              "Text Color",
              <ThemedInput
                id="textColor"
                name="textColor"
                aria-label="Text Color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
              />,
            )}

            {/* Star Color (optional) */}
            {renderField(
              "starColor",
              "Star Color (optional)",
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={starColor || "#c9a86a"}
                  onChange={(e) => setStarColor(e.target.value)}
                  className="w-8 h-8 rounded-sm border-0 cursor-pointer"
                  style={{ background: "transparent" }}
                  aria-label="Star color picker"
                />
                <ThemedInput
                  id="starColor"
                  name="starColor"
                  aria-label="Star Color"
                  value={starColor}
                  onChange={(e) => setStarColor(e.target.value)}
                  placeholder="Leave empty for default"
                />
                {starColor && (
                  <button
                    type="button"
                    onClick={() => setStarColor("")}
                    className="font-label text-xs uppercase tracking-wider px-2 py-1 rounded-sm cursor-pointer"
                    style={{
                      color: "#ff9999",
                      background: "#4a1010",
                      border: "1px solid rgba(139,32,32,0.4)",
                      whiteSpace: "nowrap",
                    }}
                    aria-label="Clear star color"
                  >
                    Clear
                  </button>
                )}
              </div>,
            )}

            {/* Width */}
            {renderField(
              "width",
              "Width (px)",
              <ThemedInput
                id="width"
                name="width"
                aria-label="Width"
                type="number"
                value={width}
                onChange={(e) =>
                  setWidth(Number.parseInt(e.target.value, 10) || 0)
                }
              />,
            )}

            {/* Height */}
            {renderField(
              "height",
              "Height (px)",
              <ThemedInput
                id="height"
                name="height"
                aria-label="Height"
                type="number"
                value={height}
                onChange={(e) =>
                  setHeight(Number.parseInt(e.target.value, 10) || 0)
                }
              />,
            )}

            {/* Title Size */}
            {renderField(
              "titleSize",
              "Title Size",
              <ThemedInput
                id="titleSize"
                name="titleSize"
                aria-label="Title Size"
                value={titleSize}
                onChange={(e) => setTitleSize(e.target.value)}
                placeholder="e.g. text-base"
              />,
            )}

            {/* Title Weight */}
            {renderField(
              "titleWeight",
              "Title Weight",
              <ThemedInput
                id="titleWeight"
                name="titleWeight"
                aria-label="Title Weight"
                value={titleWeight}
                onChange={(e) => setTitleWeight(e.target.value)}
                placeholder="e.g. font-bold"
              />,
            )}

            {/* Title Tracking */}
            {renderField(
              "titleTracking",
              "Title Tracking",
              <ThemedInput
                id="titleTracking"
                name="titleTracking"
                aria-label="Title Tracking"
                value={titleTracking}
                onChange={(e) => setTitleTracking(e.target.value)}
                placeholder="e.g. tracking-widest"
              />,
            )}

            {/* Action buttons — full width */}
            <div className="col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-[#c9a86a]/20">
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
                  "Update Book"
                ) : (
                  "Create Book"
                )}
              </ThemedButton>
            </div>
          </form>

          {/* Live preview */}
          <div className="flex-shrink-0">
            <BookSpinePreview
              title={title}
              author={author}
              stars={stars}
              bgColor={bgColor}
              textColor={textColor}
              starColor={starColor || undefined}
              width={width}
              height={height}
              titleSize={titleSize}
              titleWeight={titleWeight}
              titleTracking={titleTracking}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
