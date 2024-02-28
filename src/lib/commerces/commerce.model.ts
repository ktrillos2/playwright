import mongoose, { Document, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { DBCommerce } from "@/interfaces";

interface CommerceDocument extends Document, DBCommerce {}

const commerceSchema = new Schema<CommerceDocument>({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  url: { type: String, required: true },
  queries: { type: String, default: null },
  image: { type: String, required: true },
  categories: {
    categoryId: { type: mongoose.Types.ObjectId, ref: "Category" },
    path: { type: String, required: true },
    default: []
  },
});

commerceSchema.plugin(mongoosePaginate);

export const CommerceModel: PaginateModel<CommerceDocument> =
  (mongoose.models.Commerce as PaginateModel<CommerceDocument>) ||
  mongoose.model<CommerceDocument, PaginateModel<CommerceDocument>>(
    "Commerce",
    commerceSchema
  );