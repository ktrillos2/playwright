import { CalculatedCoupon, Coupon } from "@/interfaces";

export const formatCalculatedCoupon = (data: Coupon[]) => {
  const formattedData: CalculatedCoupon[] = data.map((coupon) => ({
    lowPrice: coupon.priceWithoutDiscount * (coupon.discountPercentage / 100),
    priceWithCard: coupon.priceWithCard
      ? coupon.priceWithoutDiscount - coupon.priceWithCard
      : null,
    ...coupon,
  }));
  return formattedData;
};