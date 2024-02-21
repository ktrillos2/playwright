"use server";

import { FilterQuery } from "mongoose";

import { CouponModel } from "@/lib";
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

const couponModel = CouponModel;

export const getCoupons = async (): Promise<Coupon[]> => {
  return couponModel.find();
};

export const getCouponById = async (id: string): Promise<Coupon | null> => {
  //valida te the id is a valid ObjectId
  if(!ObjectId.isValid(id)) return null;
  return couponModel.findById(id);
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
