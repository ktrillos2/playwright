import { CommerceSlugs } from "@/enums";
import { Category } from ".";

interface DBCategoryCommerce {
  category: string;
  path: string;
}

export interface DBCommerce {
  name: string;
  slug: CommerceSlugs;
  url: string;
  queries?: string | null;
  image: string;
  categories: DBCategoryCommerce[];
}

interface CategoryCommerce {
  category: Category
  path: string;
}

export interface Commerce extends Omit<DBCommerce, "categories"> {
  _id: string;
  categories: CategoryCommerce[];
}
