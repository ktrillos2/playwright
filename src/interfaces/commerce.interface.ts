import { Category } from ".";

interface DBCategoryCommerce {
  categoryId: string;
  path: string;
}

export interface DBCommerce {
  name: string;
  slug: string;
  url: string;
  queries?: string | null;
  image: string;
  categories: DBCategoryCommerce[];
}

interface CategoryCommerce {
  category: Category;
  path: string;
}

export interface Commerce extends Omit<DBCommerce, "categories"> {
  _id: string;
  categories: CategoryCommerce[];
}
