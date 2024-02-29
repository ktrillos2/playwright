import mongoose, { PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { DBCategory } from "@/interfaces";

interface CategoryDocument extends Document, DBCategory {}

const categorySchema = new Schema<CategoryDocument>({
  name: { type: String, required: true },
  slug: { type: String, required: true },
});

categorySchema.plugin(mongoosePaginate);

export const CategoryModel: PaginateModel<CategoryDocument> =
  (mongoose.models.Category as PaginateModel<CategoryDocument>) ||
  mongoose.model<CategoryDocument, PaginateModel<CategoryDocument>>(
    "Category",
    categorySchema
  );
