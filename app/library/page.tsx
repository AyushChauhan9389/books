import { getReceptionCollections } from "@/lib/data/collections";
import ReceptionClient from "./reception-client";

export default async function LibraryReceptionPage() {
  const collections = await getReceptionCollections();
  return <ReceptionClient collections={collections} />;
}
