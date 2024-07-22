import mongoose, { AggregatePaginateModel, Document, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { CouponDetail } from "@/interfaces";

interface CouponDetailDocument extends Document, CouponDetail { }

interface CouponDetailModel extends AggregatePaginateModel<CouponDetailDocument>, PaginateModel<CouponDetailDocument> { }

const couponDetailSchema = new Schema<CouponDetailDocument>({
    image: { type: String, required: true, trim: true },
    coupon: { type: mongoose.Types.ObjectId, ref: "ScraperCoupon", required: true },
});

couponDetailSchema.plugin(mongoosePaginate);
couponDetailSchema.plugin(aggregatePaginate);

export const CouponDetailModel: CouponDetailModel =
    (mongoose.models.ScraperCouponDetail as CouponDetailModel) ||
    mongoose.model<CouponDetailDocument, CouponDetailModel>(
        "ScraperCouponDetail",
        couponDetailSchema
    );
