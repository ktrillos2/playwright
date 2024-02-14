//IMPORT MONGOOSE
import mongoose, { Model } from "mongoose";
import { Inmueble } from "../src/interfaces";

// CONNECTING TO MONGOOSE (Get Database Url from .env.local)
const { MONGODB_URI } = process.env;

// connection function
export const connect = async () => {
  const conn = await mongoose
    .connect(MONGODB_URI as string)
    .catch((err) => console.log(err));
  console.log("Mongoose Connection Established");

  const InmuebleSchema = new mongoose.Schema<Inmueble>({
    image: String,
    location: String,
    name: String,
    page: String,
    price: String,
    url: String,
  });

  const Inmueble = mongoose.models.Inmueble || mongoose.model("Inmueble", InmuebleSchema);

  return { conn, Inmueble };
};
