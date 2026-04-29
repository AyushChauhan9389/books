import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { bookCollection } from "@/lib/schema";
import { and, eq } from "drizzle-orm";

export async function PUT(
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

	if (!Array.isArray(body)) {
		return Response.json(
			{ error: "Request body must be an array" },
			{ status: 400 },
		);
	}

	for (const entry of body) {
		if (
			!entry ||
			typeof entry !== "object" ||
			typeof entry.bookId !== "string" ||
			typeof entry.position !== "number"
		) {
			return Response.json(
				{ error: "Each entry must have a bookId (string) and position (number)" },
				{ status: 400 },
			);
		}
	}

	for (const entry of body as { bookId: string; position: number }[]) {
		await db
			.update(bookCollection)
			.set({ position: entry.position })
			.where(
				and(
					eq(bookCollection.collectionId, id),
					eq(bookCollection.bookId, entry.bookId),
				),
			);
	}

	return Response.json({ message: "Books reordered successfully" });
}
