import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { bookCollection } from "@/lib/schema";
import { and, eq } from "drizzle-orm";

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ id: string; bookId: string }> },
) {
	const auth = await requireAdmin();
	if (auth instanceof Response) return auth;

	const { id, bookId } = await params;

	await db
		.delete(bookCollection)
		.where(
			and(
				eq(bookCollection.collectionId, id),
				eq(bookCollection.bookId, bookId),
			),
		);

	return new Response(null, { status: 204 });
}
