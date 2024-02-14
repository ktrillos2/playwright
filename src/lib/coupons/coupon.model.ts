// import mongoose, { Document, Model, Schema } from "mongoose";

// interface Coupon {
//   name:      string;
//   brandName: string;
//   images:     string[];
//   lowPrice:  number;
//   discountPercentage: number;
//   priceWithoutDiscount: number
// }

// import paginate from "mongoose-paginate-v2";
// import { PaginateModel } from "mongoose";

// const InmuebleSchema = new Schema<InmuebleDocument>({
//   image: { type: String, required: true },
//   location: { type: String, required: true },
//   name: { type: String, required: true },
//   page: { type: String, required: true },
//   price: { type: String, required: true },
//   url: { type: String, required: true },
// });

// InmuebleSchema.plugin(paginate);

// interface InmuebleDocument extends Document, Coupon {}

// export const InmuebleModel: PaginateModel<InmuebleDocument> =
//   (mongoose.models.Inmuebles as PaginateModel<InmuebleDocument>) ||
//   mongoose.model<InmuebleDocument, PaginateModel<InmuebleDocument>>(
//     "Inmuebles",
//     InmuebleSchema,
//     "inmuebles"
//   );
