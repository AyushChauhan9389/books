import { getAllBooks } from "@/lib/data/books";
import { getReceptionCollections } from "@/lib/data/collections";
import SearchClient from "./search-client";

export default async function SearchPage() {
  const [books, collections] = await Promise.all([
    getAllBooks(),
    getReceptionCollections(),
  ]);
  return <SearchClient books={books} collections={collections} />;
}
