import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { book, bookCollection } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const auth = await requireAdmin();
	if (auth instanceof Response) return auth;

	const { id } = await params;

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
			position: bookCollection.position,
		})
		.from(bookCollection)
		.innerJoin(book, eq(bookCollection.bookId, book.id))
		.where(eq(bookCollection.collectionId, id))
		.orderBy(asc(bookCollection.position));

	return Response.json(books);
}

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const auth = await requireAdmin();
	if (auth instanceof Response) return auth;

	const { id } = await params;

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return Response.json({ error: "Invalid request body" }, { status: 400 });
	}

	const { bookId, position } = body as { bookId?: string; position?: number };

	if (!bookId || position === undefined || position === null) {
		return Response.json(
			{ error: "Missing required fields: bookId and position" },
			{ status: 400 },
		);
	}

	try {
		const [created] = await db
			.insert(bookCollection)
			.values({ collectionId: id, bookId, position })
			.returning();

		return Response.json(created, { status: 201 });
	} catch (error: unknown) {
		if (error instanceof Error && error.message.includes("unique")) {
			return Response.json(
				{ error: "This book is already in this collection" },
				{ status: 409 },
			);
		}
		throw error;
	}
}
