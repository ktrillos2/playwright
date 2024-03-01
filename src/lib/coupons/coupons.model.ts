import mongoose, { Document, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');


import { Coupon } from "@/interfaces";

interface CouponDocument extends Document, Coupon {}

const couponSchema = new Schema<CouponDocument>({
  name: { type: String, required: true },
  brandName: { type: String, default: null },
  images: { type: [String], default: [] },
  lowPrice: { type: Number, required: true },
  priceWithoutDiscount: { type: Number, required: true },
  discountWithCard: { type: Number, default: null},
  discountPercentage: { type: Number, required: true },
  url: { type: String, required: true },
  commerce: { type: mongoose.Types.ObjectId, ref: "Commerce", required: true },
  category:  { type: mongoose.Types.ObjectId, ref: "Category", required: true }
});

couponSchema.plugin(mongoosePaginate);

export const CouponModel: PaginateModel<CouponDocument> =
  (mongoose.models.Coupon as PaginateModel<CouponDocument>) ||
  mongoose.model<CouponDocument, PaginateModel<CouponDocument>>(
    "Coupon",
    couponSchema
  );
