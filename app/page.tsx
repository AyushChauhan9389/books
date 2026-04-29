import { getBooksByCollectionSlug } from "@/lib/data/books";
import HomeClient from "./home-client";

export default async function Home() {
  const books = await getBooksByCollectionSlug("home");
  return <HomeClient books={books} />;
}
