import { auth } from "./auth";
import { headers } from "next/headers";

export async function requireAdmin(): Promise<{ userId: string } | Response> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  return { userId: session.user.id };
}
