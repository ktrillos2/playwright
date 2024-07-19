"use server";

import { CommerceModel, dbConnect } from "@/lib";
import { Commerce, DBCommerce } from "@/interfaces";
import { transformData } from "@/helpers";
import { companyService } from "@/service/company.service";
import { getSession } from "next-auth/react";
import { kumoneraService } from '../../service/cloud.service';

dbConnect();
const commerceModel = CommerceModel;

export const getCommerceBySlug = async (
  slug: string
): Promise<DBCommerce | null> => {
  try {
    const commerce = await commerceModel.findOne({ slug });
    if (!commerce) return null;
    return transformData<DBCommerce>(commerce);
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
  const newCommerce = await commerceModel.create({ ...commerce, slug });
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

export const getExternalCompanies = async () => {
  try {
    const externalCompanies = await companyService.getExternalCompanies();
    return externalCompanies.map(({
      _id,
      name,
      logo
    }: any) => ({
      _id,
      name,
      image: kumoneraService.getImage(logo)
    }));
  } catch (error) {
    throw error;
  }
};
