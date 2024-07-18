import mongoose, { AggregatePaginateModel, Document, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";



import { Coupon } from "@/interfaces";

interface CouponDocument extends Document, Coupon { }

interface CouponModel extends AggregatePaginateModel<CouponDocument>, PaginateModel<CouponDocument> { }

const couponSchema = new Schema<CouponDocument>({
  name: { type: String, required: true, trim: true },
  brandName: { type: String, default: null, trim: true },
  images: { type: [String], default: [] },
  lowPrice: { type: Number, required: true },
  priceWithoutDiscount: { type: Number, required: true },
  discountWithCard: { type: Number, default: null },
  discountPercentage: { type: Number, required: true },
  url: { type: String, required: true },
  commerce: { type: mongoose.Types.ObjectId, ref: "ScraperCommerce", required: true },
  category: { type: mongoose.Types.ObjectId, ref: "ScraperCategory", required: true }
});

couponSchema.plugin(mongoosePaginate);
couponSchema.plugin(aggregatePaginate);

export const CouponModel: CouponModel =
  (mongoose.models.ScraperCoupon as CouponModel) ||
  mongoose.model<CouponDocument, CouponModel>(
    "ScraperCoupon",
    couponSchema
  );
