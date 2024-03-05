import { FilterQuery } from "mongoose";
import { InmuebleModel } from "..";
import { type Inmueble } from "@/interfaces";

interface PaginateProps {
  page?: number;
  limit?: number;
  sort?: string;
}

interface PaginatorProps<T = any> extends PaginateProps {
  query?: FilterQuery<T>;
}

class InmuebleDbService {
  constructor(private inmuebleModel = InmuebleModel) {}

  async getInmuebles(): Promise<Inmueble[]> {
    return this.inmuebleModel.find();
  }

  async getPaginateInmuebles({
    limit = 5,
    page = 1,
    sort = "createdAt",
    query = {},
  }: PaginatorProps<Inmueble> = {}) {
    return this.inmuebleModel.paginate(query, { limit, page, sort });
  }

  async deleteAllInmuebles() {
    return this.inmuebleModel.deleteMany({});
  }

  async saveInmuebles(inmuebles: Inmueble[]) {
    return this.inmuebleModel.insertMany(inmuebles);
  }
}

export const inmuebleService = new InmuebleDbService();
