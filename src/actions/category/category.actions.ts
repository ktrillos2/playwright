"use server";

import { CategoryModel, dbConnect } from "@/lib";
import { Category, DBCategory } from "@/interfaces";

dbConnect();
const categoryModel = CategoryModel;

export const getCategories = async (): Promise<Category[]> => {
  return categoryModel.find();
};

export const saveCategory = async (category: DBCategory) => {
  return categoryModel.create(category);
};
