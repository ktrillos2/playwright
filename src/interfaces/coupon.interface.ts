export interface Coupon {
  name: string;
  brandName?: string | null;
  images: string[]|string;
  priceWithoutDiscount: number;
  priceWithCard?: number | null;
  discountPercentage?: number | null;
  url: string;
  page: string;
}
