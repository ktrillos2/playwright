import mongoose, { Document, Model, Schema } from "mongoose";
import { Inmueble } from "@/interfaces";

import paginate from "mongoose-paginate-v2";
import { PaginateModel } from "mongoose";

interface InmuebleDocument extends Document, Inmueble {}

const InmuebleSchema = new Schema<InmuebleDocument>({
  image: { type: String, required: true },
  location: { type: String, required: true },
  name: { type: String, required: true },
  page: { type: String, required: true },
  price: { type: String, required: true },
  url: { type: String, required: true },
});

InmuebleSchema.plugin(paginate);

export const InmuebleModel: PaginateModel<InmuebleDocument> =
  (mongoose.models.Inmuebles as PaginateModel<InmuebleDocument>) ||
  mongoose.model<InmuebleDocument, PaginateModel<InmuebleDocument>>(
    "Inmuebles",
    InmuebleSchema,
    "inmuebles"
  );
