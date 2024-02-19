export interface Coupon {
  name: string;
  brandName?: string | null;
  images: string[]|string;
  priceWithoutDiscount: number;
  discountWithCard: number;
  discountPercentage: number;
  url: string;
  page: string;
}
