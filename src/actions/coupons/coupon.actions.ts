"use server";

import { FilterQuery } from "mongoose";
import { ObjectId } from "mongodb";

import { CouponModel, dbConnect } from "@/lib";
import { Coupon } from "@/interfaces";
import { transformData } from "@/helpers";

interface PaginateProps {
  page?: number;
  limit?: number;
  sort?: string;
}

interface PaginatorProps<T = any> extends PaginateProps {
  query?: FilterQuery<T>;
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
  return coupon ? parseData(coupon) : null;
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

export const deleteAllCoupons = async () => {
  return couponModel.deleteMany({});
};

export const deleteCouponsFromPage = async (page: string) => {
  return couponModel.deleteMany({ page });
};

const parseData = (data: any) => {
  const parsedData = data.toJSON();
  parsedData._id = parsedData._id.toString();
  return parsedData;
};
