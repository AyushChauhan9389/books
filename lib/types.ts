export type Book = {
  id: string;
  title: string;
  author: string;
  stars: number;
  bgColor: string;
  textColor: string;
  starColor?: string | null;
  width: number;
  height: number;
  titleSize: string;
  titleWeight: string;
  titleTracking: string;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isReception: boolean;
  displayOrder: number;
};

export type CollectionWithBooks = Collection & {
  books: Book[];
};
