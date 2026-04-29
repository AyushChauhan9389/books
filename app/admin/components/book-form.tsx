"use client";

import { type FormEvent, useState } from "react";
import type { Book } from "@/lib/types";
import { ApiError, adminFetch } from "./api";
import { BookSpinePreview } from "./book-spine-preview";
import { useNotification } from "./notification";
import { PrimaryButton, Spinner, ThemedButton, ThemedInput, ThemedLabel } from "./themed-ui";

type BookFormProps = {
  book?: Book | null;
  onSave: (book: Book) => void;
  onClose: () => void;
};

export function bookFormToPayload(form: {
  title: string; author: string; stars: number; bgColor: string; textColor: string;
  starColor: string; width: number; height: number; titleSize: string; titleWeight: string; titleTracking: string;
}) {
  return {
    title: form.title, author: form.author, stars: form.stars, bgColor: form.bgColor,
    textColor: form.textColor, starColor: form.starColor || null, width: form.width,
    height: form.height, titleSize: form.titleSize, titleWeight: form.titleWeight, titleTracking: form.titleTracking,
  };
}

export function bookToFormValues(book: Book) {
  return {
    title: book.title, author: book.author, stars: book.stars, bgColor: book.bgColor,
    textColor: book.textColor, starColor: book.starColor ?? "", width: book.width,
    height: book.height, titleSize: book.titleSize, titleWeight: book.titleWeight, titleTracking: book.titleTracking,
  };
}

const DEFAULT_VALUES = {
  title: "", author: "", stars: 3, bgColor: "#2a1810", textColor: "text-amber-100",
  starColor: "", width: 60, height: 400, titleSize: "text-base", titleWeight: "font-bold", titleTracking: "tracking-widest",
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
    if (!title.trim()) errors.title = "Title is required";
    if (!author.trim()) errors.author = "Author is required";
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) errors.stars = "Must be 1–5";
    if (!bgColor) errors.bgColor = "Required";
    if (!textColor) errors.textColor = "Required";
    if (!titleSize) errors.titleSize = "Required";
    if (!titleWeight) errors.titleWeight = "Required";
    if (!titleTracking) errors.titleTracking = "Required";
    if (typeof width !== "number" || Number.isNaN(width)) errors.width = "Required";
    if (typeof height !== "number" || Number.isNaN(height)) errors.height = "Required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateFields()) return;

    const payload = bookFormToPayload({ title, author, stars, bgColor, textColor, starColor, width, height, titleSize, titleWeight, titleTracking });
    setSaving(true);
    setFieldErrors({});

    try {
      let saved: Book;
      if (isEdit) {
        saved = await adminFetch<Book>(`/api/admin/books/${book.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        saved = await adminFetch<Book>("/api/admin/books", { method: "POST", body: JSON.stringify(payload) });
      }
      addNotification("success", isEdit ? "Book updated" : "Book created");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="book-form-title">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close dialog"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", border: "none" }}
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
      />

      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg"
        style={{ background: "#1a0f0a", border: "1px solid rgba(201,168,106,0.2)", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4" style={{ background: "#1a0f0a", borderBottom: "1px solid rgba(201,168,106,0.1)" }}>
          <h2 id="book-form-title" className="font-headline text-lg font-bold" style={{ color: "#f5e9cf" }}>
            {isEdit ? "Edit Book" : "New Book"}
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

        <div className="flex gap-6 p-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 grid grid-cols-2 gap-x-4 gap-y-3 content-start">
            <div className="col-span-2">
              {renderField("title", "Title", <ThemedInput id="title" name="title" aria-label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />)}
            </div>
            <div className="col-span-2">
              {renderField("author", "Author", <ThemedInput id="author" name="author" aria-label="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />)}
            </div>

            {renderField("stars", "Stars (1-5)", <ThemedInput id="stars" name="stars" aria-label="Stars" type="number" min={1} max={5} value={stars} onChange={(e) => setStars(Number.parseInt(e.target.value, 10) || 0)} />)}

            {renderField("bgColor", "Background Color",
              <div className="flex gap-2 items-center">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded border-0 cursor-pointer" style={{ background: "transparent" }} aria-label="Background color picker" />
                <ThemedInput id="bgColor" name="bgColor" aria-label="Background Color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
              </div>,
            )}

            {renderField("textColor", "Text Color", <ThemedInput id="textColor" name="textColor" aria-label="Text Color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />)}

            {renderField("starColor", "Star Color (optional)",
              <div className="flex gap-2 items-center">
                <input type="color" value={starColor || "#c9a86a"} onChange={(e) => setStarColor(e.target.value)} className="w-8 h-8 rounded border-0 cursor-pointer" style={{ background: "transparent" }} aria-label="Star color picker" />
                <ThemedInput id="starColor" name="starColor" aria-label="Star Color" value={starColor} onChange={(e) => setStarColor(e.target.value)} placeholder="Leave empty for default" />
                {starColor && (
                  <button type="button" onClick={() => setStarColor("")} className="font-label text-[10px] uppercase tracking-wider px-2 py-1 rounded cursor-pointer whitespace-nowrap" style={{ color: "#ff9999", background: "rgba(139,32,32,0.15)", border: "1px solid rgba(139,32,32,0.3)" }} aria-label="Clear star color">
                    Clear
                  </button>
                )}
              </div>,
            )}

            {renderField("width", "Width (px)", <ThemedInput id="width" name="width" aria-label="Width" type="number" value={width} onChange={(e) => setWidth(Number.parseInt(e.target.value, 10) || 0)} />)}
            {renderField("height", "Height (px)", <ThemedInput id="height" name="height" aria-label="Height" type="number" value={height} onChange={(e) => setHeight(Number.parseInt(e.target.value, 10) || 0)} />)}
            {renderField("titleSize", "Title Size", <ThemedInput id="titleSize" name="titleSize" aria-label="Title Size" value={titleSize} onChange={(e) => setTitleSize(e.target.value)} placeholder="e.g. text-base" />)}
            {renderField("titleWeight", "Title Weight", <ThemedInput id="titleWeight" name="titleWeight" aria-label="Title Weight" value={titleWeight} onChange={(e) => setTitleWeight(e.target.value)} placeholder="e.g. font-bold" />)}
            {renderField("titleTracking", "Title Tracking", <ThemedInput id="titleTracking" name="titleTracking" aria-label="Title Tracking" value={titleTracking} onChange={(e) => setTitleTracking(e.target.value)} placeholder="e.g. tracking-widest" />)}

            <div className="col-span-2 flex justify-end gap-3 mt-4 pt-4" style={{ borderTop: "1px solid rgba(201,168,106,0.1)" }}>
              <ThemedButton type="button" onClick={onClose} disabled={saving}>Cancel</ThemedButton>
              <PrimaryButton type="submit" disabled={saving}>
                {saving ? <span className="inline-flex items-center gap-2"><Spinner size={14} />Saving…</span> : isEdit ? "Update Book" : "Create Book"}
              </PrimaryButton>
            </div>
          </form>

          {/* Live preview */}
          <div className="flex-shrink-0 hidden lg:block">
            <BookSpinePreview title={title} author={author} stars={stars} bgColor={bgColor} textColor={textColor} starColor={starColor || undefined} width={width} height={height} titleSize={titleSize} titleWeight={titleWeight} titleTracking={titleTracking} />
          </div>
        </div>
      </div>
    </div>
  );
}
