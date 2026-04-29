import { eq, asc } from "drizzle-orm";
import { db } from "../db";
import { book, bookCollection, collection } from "../schema";
import type { Book } from "../types";

/**
 * Fetches all books belonging to a collection identified by its slug,
 * ordered by their position within the collection (ascending).
 */
export async function getBooksByCollectionSlug(
	slug: string,
): Promise<Book[]> {
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
}

/**
 * Fetches all book records from the database.
 */
export async function getAllBooks(): Promise<Book[]> {
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
}
