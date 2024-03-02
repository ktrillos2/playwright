"use server";

import { CategoryModel, dbConnect } from "@/lib";
import { Category, DBCategory } from "@/interfaces";
import { transformData } from "@/helpers";

dbConnect();
const categoryModel = CategoryModel;

export const getCategories = async (): Promise<Category[]> => {
  const categories = await categoryModel.find();
  return transformData(categories)
};

export const saveCategory = async (category: DBCategory) => {
  return await categoryModel.create(category);
};
