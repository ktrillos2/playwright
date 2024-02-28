"use server";

import { CategoryModel, dbConnect } from "@/lib";
import { Coupon, DBCategory } from "@/interfaces";

const categoryModel = CategoryModel;
dbConnect();

export const getCategories = async (): Promise<Coupon[]> => {
  return categoryModel.find();
};

export const saveCategory = async (category: DBCategory) => {
  return categoryModel.create(category);
};
