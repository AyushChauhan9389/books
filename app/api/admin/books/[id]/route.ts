import { requireAdmin } from "@/lib/admin-auth";
import { validateBookInput } from "@/lib/validation/book";
import { db } from "@/lib/db";
import { book } from "@/lib/schema";
import { eq } from "drizzle-orm";

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

	const result = validateBookInput(body);
	if ("error" in result) {
		return Response.json(result.error, { status: 400 });
	}

	const [updated] = await db
		.update(book)
		.set(result.data)
		.where(eq(book.id, id))
		.returning();

	if (!updated) {
		return Response.json({ error: "Book not found" }, { status: 404 });
	}

	return Response.json(updated);
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const auth = await requireAdmin();
	if (auth instanceof Response) return auth;

	const { id } = await params;

	const [deleted] = await db
		.delete(book)
		.where(eq(book.id, id))
		.returning();

	if (!deleted) {
		return Response.json({ error: "Book not found" }, { status: 404 });
	}

	return new Response(null, { status: 204 });
}
