import { CalculatedCoupon, Coupon } from "@/interfaces";

export const formatCalculatedCoupon = (data: Coupon[]) => {
  const formattedData: CalculatedCoupon[] = data.map((coupon) => ({
    lowPrice: coupon.priceWithoutDiscount * (coupon.discountPercentage / 100),
    priceWithCard: coupon.discountWithCard
      ? coupon.priceWithoutDiscount - coupon.discountWithCard
      : null,
    ...coupon,
  }));
  return formattedData;
};