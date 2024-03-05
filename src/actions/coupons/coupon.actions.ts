"use server";

import {
  FilterQuery,
  PaginateOptions,
} from "mongoose";
import { ObjectId } from "mongodb";

import { CouponModel, categoryLookup, commerceLookup, dbConnect } from "@/lib";
import { Coupon, DBCoupon } from "@/interfaces";
import { transformData } from "@/helpers";

interface PaginateProps {
  page?: number;
  limit?: number;
  sort?: string;
}

interface PaginatorProps<T = any> extends PaginateProps {
  query?: FilterQuery<T>;
}

interface CommercesAndCategoriesProps extends PaginateProps {
  commerces?: string[];
  categories?: string[];
}

dbConnect();
const couponModel = CouponModel;

export const getCoupons = async (): Promise<Coupon[]> => {
  return couponModel.find().populate("category").populate("commerce").exec();
};

export const getCouponById = async (id: string): Promise<Coupon | null> => {
  if (!ObjectId.isValid(id)) return null;
  const coupon = await couponModel
    .findById(id)
    .populate(["commerce", "category"]);
  return coupon ? transformData(coupon) : null;
};

export const getPaginateCoupons = async ({
  limit = 5,
  page = 1,
  sort = "-discountPercentage",
  query = {},
}: PaginatorProps<Coupon> = {}) => {
  const response = await couponModel.paginate(query, {
    limit,
    page,
    sort,
    populate: ["category", "commerce"],
  });
  return { ...response, docs: transformData(response.docs) };
};

export const getPaginateCouponByCategoryAndCommerce = async ({
  limit = 5,
  page = 1,
  sort = "-discountPercentage",
  categories,
  commerces,
}: CommercesAndCategoriesProps) => {
  const options: PaginateOptions = {
    limit,
    page,
    sort,
  };

  const marchQuery: FilterQuery<Coupon> = {};

  if (categories) marchQuery["category.slug"] = { $in: categories };
  if (commerces) marchQuery["commerce.slug"] = { $in: commerces };

  const aggregate = couponModel.aggregate([
    ...commerceLookup({ unwindData: true }),
    ...categoryLookup({ unwindData: true }),
    { $match: marchQuery },
  ]);

  const response = await couponModel.aggregatePaginate(aggregate, options);
  return { ...response, docs: transformData(response.docs) };
};

export const saveCoupons = async (coupons: DBCoupon[]) => {
  return await couponModel.insertMany(coupons);
};

export const deleteAllCoupons = async () => {
  return couponModel.deleteMany({});
};

export const deleteCouponsFromPage = async (page: string) => {
  return couponModel.deleteMany({ page });
};

export const deleteCouponsByCommerceAndCategory = async (
  commerceId: string,
  categoryId: string
) => {
  return couponModel.deleteMany({
    commerce: commerceId,
    category: categoryId,
  });
};
