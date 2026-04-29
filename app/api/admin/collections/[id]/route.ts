import { requireAdmin } from "@/lib/admin-auth";
import { validateCollectionInput } from "@/lib/validation/collection";
import { db } from "@/lib/db";
import { collection } from "@/lib/schema";
import { eq, count } from "drizzle-orm";

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

	const result = validateCollectionInput(body);
	if ("error" in result) {
		return Response.json(result.error, { status: 400 });
	}

	// Enforce reception collection limit (max 3) when setting isReception to true
	if (result.data.isReception) {
		// Check if this collection is already a reception collection
		const [existing] = await db
			.select({ isReception: collection.isReception })
			.from(collection)
			.where(eq(collection.id, id));

		if (!existing?.isReception) {
			const [{ value: receptionCount }] = await db
				.select({ value: count() })
				.from(collection)
				.where(eq(collection.isReception, true));

			if (receptionCount >= 3) {
				return Response.json(
					{ error: "Maximum of 3 reception collections allowed" },
					{ status: 409 },
				);
			}
		}
	}

	// Handle duplicate slug constraint violation
	try {
		const [updated] = await db
			.update(collection)
			.set(result.data)
			.where(eq(collection.id, id))
			.returning();

		if (!updated) {
			return Response.json(
				{ error: "Collection not found" },
				{ status: 404 },
			);
		}

		return Response.json(updated);
	} catch (error: unknown) {
		if (error instanceof Error && error.message.includes("unique")) {
			return Response.json(
				{ error: "A collection with this slug already exists" },
				{ status: 409 },
			);
		}
		throw error;
	}
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const auth = await requireAdmin();
	if (auth instanceof Response) return auth;

	const { id } = await params;

	const [deleted] = await db
		.delete(collection)
		.where(eq(collection.id, id))
		.returning();

	if (!deleted) {
		return Response.json(
			{ error: "Collection not found" },
			{ status: 404 },
		);
	}

	return new Response(null, { status: 204 });
}
