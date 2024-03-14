"use server";

import { CommerceModel, dbConnect } from "@/lib";
import { Commerce, DBCommerce } from "@/interfaces";
import { transformData } from "@/helpers";

dbConnect();
const commerceModel = CommerceModel;

export const getCommerceBySlug = async (
  slug: string
): Promise<Commerce | null> => {
  try {
    const commerce = await commerceModel.findOne({ slug });
    if (!commerce) return null;
    return transformData<Commerce>(commerce);
  } catch (error) {
    return null;
  }
};

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

export const getCommerceById = async (
  commerceId: string
): Promise<DBCommerce | null> => {
  // if (isValidId(commerceId)) throw new Error("El id no es válido");
  try {
    const commerce = await commerceModel.findById(commerceId);
    if (!commerce) return null;
    return transformData<DBCommerce>(commerce);
  } catch (error) {
    return null;
  }
};

export const createCommerce = async (
  commerce: Omit<DBCommerce, "slug" | "categories">
) => {
  const slug = commerce.name.toLowerCase().replace(/ /g, "-");
  const newCommerce = commerceModel.create({ ...commerce, slug });
  return transformData<Commerce>(newCommerce);
};

export const editCommerce = async (
  commerceId: string,
  commerce: Omit<DBCommerce, "slug" | "categories"> & { slug?: string }
) => {

  if (commerce.name) {
    commerce.slug = commerce.name.toLowerCase().replace(/ /g, "-");
  }

  const updatedCommerce = await commerceModel.findByIdAndUpdate(
    commerceId,
    commerce,
    {
      new: true,
    }
  );
  return transformData<Commerce>(updatedCommerce);
};
