import mongoose, { Schema } from "mongoose";

import { DBCategory } from "@/interfaces";

const categorySchema = new Schema<DBCategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true },
});

export const CategoryModel = mongoose.model("Category", categorySchema);
