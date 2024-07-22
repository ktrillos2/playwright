import { Category, Commerce } from ".";


export interface DBCoupon {
  name: string;
  brandName?: string | null;
  images: string[];
  lowPrice: number;
  priceWithoutDiscount: number;
  discountWithCard: number;
  discountPercentage: number;
  url: string;
  // page: string;
  commerce: string
  category: string
}

export interface Coupon {
  _id: string
  name: string;
  brandName?: string | null;
  images: string[];
  lowPrice: number;
  priceWithoutDiscount: number;
  discountWithCard: number;
  discountPercentage: number;
  url: string;
  // page: string;
  commerce: Commerce
  category: Category
}

export interface CouponLayout {
  name: string;
  layout: (props: any) => any;
  size: { width: string; height: string };
  image: string;
}