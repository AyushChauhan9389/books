import { revalidateTag } from "next/cache";

/** Invalidate all cached book data (book lists, collection book memberships). */
export function revalidateBooks() {
	revalidateTag("books", { expire: 0 });
}

/** Invalidate all cached collection data. */
export function revalidateCollections() {
	revalidateTag("collections", { expire: 0 });
}
