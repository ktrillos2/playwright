export interface Coupon {
  name: string;
  brandName?: string | null;
  images: string[];
  lowPrice: number;
  priceWithoutDiscount: number;
  discountWithCard: number;
  discountPercentage: number;
  url: string;
  page: string;
}
