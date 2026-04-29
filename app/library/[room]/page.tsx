import { notFound } from "next/navigation";
import { getCollectionBySlug } from "@/lib/data/collections";
import { getBooksByCollectionSlug } from "@/lib/data/books";
import RoomClient from "./room-client";

export default async function RoomPage({ params }: { params: Promise<{ room: string }> }) {
  const { room } = await params;

  const collection = await getCollectionBySlug(room);
  if (!collection) {
    notFound();
  }

  const books = await getBooksByCollectionSlug(room);
  return <RoomClient books={books} collectionName={collection.name} slug={room} />;
}
