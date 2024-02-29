"use server";

import { CommerceModel, dbConnect } from "@/lib";
import { Commerce, DBCommerce } from "@/interfaces";
import { transformData } from "../../helpers/actions.helpers";

dbConnect();
const commerceModel = CommerceModel;

export const getCommerces = async (): Promise<Commerce[]> => {
  try {
    const commerces = await commerceModel
      .find()
      .populate("categories.category")
      .exec();

    return transformData<Commerce[]>(commerces);
  } catch (error) {
    return [];
  }
};

export const saveCommerce = async (commerce: DBCommerce) => {
  return commerceModel.create(commerce);
};
