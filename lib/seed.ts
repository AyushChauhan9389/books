import "dotenv/config";
import { eq, and } from "drizzle-orm";
import { db } from "./db";
import { book, collection, bookCollection } from "./schema";
import { books } from "../app/books-data";

/**
 * Upsert a single book by title + author. Returns the book ID.
 */
async function upsertBook(b: (typeof books)[number]): Promise<string> {
  const existing = await db
    .select()
    .from(book)
    .where(and(eq(book.title, b.title), eq(book.author, b.author)))
    .limit(1);

  if (existing.length > 0) {
    const [updated] = await db
      .update(book)
      .set({
        stars: b.stars,
        bgColor: b.bgColor,
        textColor: b.textColor,
        starColor: b.starColor ?? null,
        width: b.width,
        height: b.height,
        titleSize: b.titleSize,
        titleWeight: b.titleWeight,
        titleTracking: b.titleTracking,
      })
      .where(eq(book.id, existing[0].id))
      .returning();
    return updated.id;
  }

  const [inserted] = await db
    .insert(book)
    .values({
      title: b.title,
      author: b.author,
      stars: b.stars,
      bgColor: b.bgColor,
      textColor: b.textColor,
      starColor: b.starColor ?? null,
      width: b.width,
      height: b.height,
      titleSize: b.titleSize,
      titleWeight: b.titleWeight,
      titleTracking: b.titleTracking,
    })
    .returning();
  return inserted.id;
}

/**
 * Upsert a collection by slug. Returns the collection row.
 */
async function upsertCollection(values: {
  name: string;
  slug: string;
  isReception?: boolean;
  displayOrder?: number;
}) {
  const [row] = await db
    .insert(collection)
    .values({
      name: values.name,
      slug: values.slug,
      isReception: values.isReception ?? false,
      displayOrder: values.displayOrder ?? 0,
    })
    .onConflictDoUpdate({
      target: collection.slug,
      set: {
        name: values.name,
        isReception: values.isReception ?? false,
        displayOrder: values.displayOrder ?? 0,
        updatedAt: new Date(),
      },
    })
    .returning();
  return row;
}

/**
 * Link a book to a collection at a given position (upsert).
 */
async function linkBook(bookId: string, collectionId: string, position: number) {
  await db
    .insert(bookCollection)
    .values({ bookId, collectionId, position })
    .onConflictDoUpdate({
      target: [bookCollection.bookId, bookCollection.collectionId],
      set: { position },
    });
}


/*
 * Category assignments — indices into the `books` array.
 * Some books appear in multiple collections (that's fine, the join table allows it).
 */

/** Fiction: novels and literary fiction */
const FICTION_INDICES = [0, 2, 3, 4, 7, 11, 12, 15, 16];

/** Essays & Non-Fiction */
const ESSAYS_INDICES = [1, 5, 6, 8, 9, 10, 17, 18, 20, 21];

/** Classics & Graphic Novels */
const CLASSICS_INDICES = [4, 5, 12, 13, 14, 19, 22, 23];

async function seed() {
  console.log("🌱 Seeding database...\n");

  // ── 1. Upsert all books and collect their IDs ──
  const bookIds: string[] = [];
  for (let i = 0; i < books.length; i++) {
    const id = await upsertBook(books[i]);
    bookIds.push(id);
    console.log(`  📖 ${books[i].title} by ${books[i].author}`);
  }
  console.log(`\n✅ ${books.length} books upserted\n`);

  // ── 2. Upsert collections ──
  const homeCol = await upsertCollection({
    name: "Prompts of 2026",
    slug: "home",
    isReception: false,
    displayOrder: 0,
  });
  console.log(`📚 Home collection upserted (id: ${homeCol.id})`);

  const fictionCol = await upsertCollection({
    name: "Fiction",
    slug: "fiction",
    isReception: true,
    displayOrder: 1,
  });
  console.log(`📚 Fiction collection upserted (id: ${fictionCol.id})`);

  const essaysCol = await upsertCollection({
    name: "Essays & Non-Fiction",
    slug: "essays",
    isReception: true,
    displayOrder: 2,
  });
  console.log(`📚 Essays collection upserted (id: ${essaysCol.id})`);

  const classicsCol = await upsertCollection({
    name: "Classics",
    slug: "classics",
    isReception: true,
    displayOrder: 3,
  });
  console.log(`📚 Classics collection upserted (id: ${classicsCol.id})\n`);

  // ── 3. Link books to collections ──

  // Home — all books in original order
  for (let i = 0; i < bookIds.length; i++) {
    await linkBook(bookIds[i], homeCol.id, i);
  }
  console.log(`  🏠 Home: ${bookIds.length} books linked`);

  // Fiction
  for (let pos = 0; pos < FICTION_INDICES.length; pos++) {
    await linkBook(bookIds[FICTION_INDICES[pos]], fictionCol.id, pos);
  }
  console.log(`  📖 Fiction: ${FICTION_INDICES.length} books linked`);

  // Essays & Non-Fiction
  for (let pos = 0; pos < ESSAYS_INDICES.length; pos++) {
    await linkBook(bookIds[ESSAYS_INDICES[pos]], essaysCol.id, pos);
  }
  console.log(`  📝 Essays: ${ESSAYS_INDICES.length} books linked`);

  // Classics
  for (let pos = 0; pos < CLASSICS_INDICES.length; pos++) {
    await linkBook(bookIds[CLASSICS_INDICES[pos]], classicsCol.id, pos);
  }
  console.log(`  📜 Classics: ${CLASSICS_INDICES.length} books linked`);

  console.log("\n✅ Seed complete!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
