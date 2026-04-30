import { eq, asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "../db";
import { book, bookCollection, collection } from "../schema";
import type { Book } from "../types";

/**
 * Fetches all books belonging to a collection identified by its slug,
 * ordered by their position within the collection (ascending).
 */
export const getBooksByCollectionSlug = unstable_cache(
	async (slug: string): Promise<Book[]> => {
		const rows = await db
			.select({
				id: book.id,
				title: book.title,
				author: book.author,
				stars: book.stars,
				bgColor: book.bgColor,
				textColor: book.textColor,
				starColor: book.starColor,
				width: book.width,
				height: book.height,
				titleSize: book.titleSize,
				titleWeight: book.titleWeight,
				titleTracking: book.titleTracking,
			})
			.from(bookCollection)
			.innerJoin(collection, eq(bookCollection.collectionId, collection.id))
			.innerJoin(book, eq(bookCollection.bookId, book.id))
			.where(eq(collection.slug, slug))
			.orderBy(asc(bookCollection.position));

		return rows;
	},
	["books-by-collection-slug"],
	{ tags: ["books", "collections"] },
);

/**
 * Fetches all book records from the database.
 */
export const getAllBooks = unstable_cache(
	async (): Promise<Book[]> => {
		const rows = await db
			.select({
				id: book.id,
				title: book.title,
				author: book.author,
				stars: book.stars,
				bgColor: book.bgColor,
				textColor: book.textColor,
				starColor: book.starColor,
				width: book.width,
				height: book.height,
				titleSize: book.titleSize,
				titleWeight: book.titleWeight,
				titleTracking: book.titleTracking,
			})
			.from(book);

		return rows;
	},
	["all-books"],
	{ tags: ["books"] },
);
