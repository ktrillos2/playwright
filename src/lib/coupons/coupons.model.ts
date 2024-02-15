import mongoose, { Document, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { Coupon } from "@/interfaces";

interface CouponDocument extends Document, Coupon {}

const CouponSchema = new Schema<CouponDocument>({
  name: { type: String, required: true },
  brandName: { type: String, default: null },
  images: { type: [String], default: [] },
  priceWithoutDiscount: { type: Number, required: true },
  discountWithCard: { type: Number, default: null},
  discountPercentage: { type: Number, required: true },
  url: { type: String, required: true },
  page: { type: String, required: true },
});

CouponSchema.plugin(mongoosePaginate);

export const CouponModel: PaginateModel<CouponDocument> =
  (mongoose.models.Coupon as PaginateModel<CouponDocument>) ||
  mongoose.model<CouponDocument, PaginateModel<CouponDocument>>(
    "Coupon",
    CouponSchema
  );
