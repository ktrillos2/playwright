"use server";

import { FilterQuery } from "mongoose";

import { CouponModel, dbConnect } from "@/lib";
import { Coupon } from "@/interfaces";
import { ObjectId } from "mongodb";

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
  return couponModel.find();
};

export const getCouponById = async (id: string): Promise<Coupon | null> => {
  if (!ObjectId.isValid(id)) return null;
  const coupon = await couponModel.findById(id);
  return coupon ? parseData(coupon) : null;
};

export const getPaginateCoupons = async ({
  limit = 5,
  page = 1,
  sort = "-discountPercentage",
  query = {},
}: PaginatorProps<Coupon> = {}) => {
  return couponModel.paginate(query, { limit, page, sort });
};

export const deleteAllCoupons = async () => {
  return couponModel.deleteMany({});
};

export const deleteCouponsFromPage = async (page: string) => {
  return couponModel.deleteMany({ page });
};

export const saveCoupons = async (coupons: Coupon[]) => {
  return couponModel.insertMany(coupons);
};

const parseData = (data: any) => {
  const parsedData = data.toJSON();
  parsedData._id = parsedData._id.toString();
  return parsedData;
};
