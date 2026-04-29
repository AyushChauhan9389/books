import { requireAdmin } from "@/lib/admin-auth";
import { validateCollectionInput } from "@/lib/validation/collection";
import { db } from "@/lib/db";
import { collection } from "@/lib/schema";
import { eq, count } from "drizzle-orm";

export async function GET() {
	const auth = await requireAdmin();
	if (auth instanceof Response) return auth;

	const collections = await db.select().from(collection);
	return Response.json(collections);
}

export async function POST(request: Request) {
	const auth = await requireAdmin();
	if (auth instanceof Response) return auth;

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

	// Enforce reception collection limit (max 3)
	if (result.data.isReception) {
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

	// Handle duplicate slug constraint violation
	try {
		const [created] = await db
			.insert(collection)
			.values(result.data)
			.returning();
		return Response.json(created, { status: 201 });
	} catch (error: unknown) {
		if (
			error instanceof Error &&
			error.message.includes("unique") 
		) {
			return Response.json(
				{ error: "A collection with this slug already exists" },
				{ status: 409 },
			);
		}
		throw error;
	}
}
