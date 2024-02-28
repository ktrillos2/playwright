import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { DBCategory } from "@/interfaces";

const categorySchema = new Schema<DBCategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true },
});

categorySchema.plugin(mongoosePaginate);

export const CategoryModel = mongoose.model("Category", categorySchema);
