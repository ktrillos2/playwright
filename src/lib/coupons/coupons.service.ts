import { FilterQuery } from "mongoose";

import { CouponModel } from "./coupons.model";
import { Coupon, DBCoupon } from "@/interfaces";

interface PaginateProps {
  page?: number;
  limit?: number;
  sort?: string;
}

interface PaginatorProps<T = any> extends PaginateProps {
  query?: FilterQuery<T>;
}

class CouponDbService {
  constructor(private couponModel = CouponModel) {}

  async getCoupons(): Promise<Coupon[]> {
    return this.couponModel.find();
  }

  async getCouponById(id: string): Promise<Coupon | null> {
    return this.couponModel.findById(id);
  }

  async getPaginateCoupons({
    limit = 5,
    page = 1,
    sort = "-discountPercentage",
    query = {},
  }: PaginatorProps<Coupon> = {}) {
    return this.couponModel.paginate(query, {
      limit,
      page,
      sort,
      populate: ["category", "commerce"],
    });
  }

  async deleteAllCoupons() {
    return this.couponModel.deleteMany({});
  }

  async deleteCouponsFromPage(page: string) {
    return this.couponModel.deleteMany({ page });
  }

  async deleteCouponsByCommerceAndCategory(
    commerceId: string,
    categoryId: string
  ) {
    return this.couponModel.deleteMany({
      commerce: commerceId,
      category: categoryId,
    });
  }

  async saveCoupons(coupons: DBCoupon[]) {
    return this.couponModel.insertMany(coupons);
  }
}

export const couponService = new CouponDbService();
