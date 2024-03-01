export interface DBCategory {
  name: string;
  slug: string;
}

export interface Category extends DBCategory {
  _id: string;
}
