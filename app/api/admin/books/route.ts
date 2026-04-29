import { requireAdmin } from "@/lib/admin-auth";
import { validateBookInput } from "@/lib/validation/book";
import { db } from "@/lib/db";
import { book } from "@/lib/schema";

export async function GET() {
	const auth = await requireAdmin();
	if (auth instanceof Response) return auth;

	const books = await db.select().from(book);
	return Response.json(books);
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

	const result = validateBookInput(body);
	if ("error" in result) {
		return Response.json(result.error, { status: 400 });
	}

	const [created] = await db.insert(book).values(result.data).returning();
	return Response.json(created, { status: 201 });
}
