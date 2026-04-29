import { eq, asc } from "drizzle-orm";
import { db } from "../db";
import { book, bookCollection, collection } from "../schema";
import type { Collection, CollectionWithBooks } from "../types";

/**
 * Fetches a single collection by its slug.
 * Returns null if no collection matches the given slug.
 */
export async function getCollectionBySlug(
	slug: string,
): Promise<Collection | null> {
	const rows = await db
		.select({
			id: collection.id,
			name: collection.name,
			slug: collection.slug,
			description: collection.description,
			isReception: collection.isReception,
			displayOrder: collection.displayOrder,
		})
		.from(collection)
		.where(eq(collection.slug, slug));

	if (rows.length === 0) {
		return null;
	}

	return rows[0];
}

/**
 * Fetches all collections where isReception is true, ordered by displayOrder ascending.
 * Each collection includes its books ordered by position ascending.
 */
export async function getReceptionCollections(): Promise<CollectionWithBooks[]> {
	// Fetch reception collections ordered by displayOrder
	const collections = await db
		.select({
			id: collection.id,
			name: collection.name,
			slug: collection.slug,
			description: collection.description,
			isReception: collection.isReception,
			displayOrder: collection.displayOrder,
		})
		.from(collection)
		.where(eq(collection.isReception, true))
		.orderBy(asc(collection.displayOrder));

	// For each collection, fetch its books ordered by position
	const results: CollectionWithBooks[] = await Promise.all(
		collections.map(async (col) => {
			const books = await db
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
				.innerJoin(book, eq(bookCollection.bookId, book.id))
				.where(eq(bookCollection.collectionId, col.id))
				.orderBy(asc(bookCollection.position));

			return {
				...col,
				books,
			};
		}),
	);

	return results;
}
