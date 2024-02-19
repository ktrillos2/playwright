import { Coupon } from "@/interfaces";
import { couponService, dbConnect } from "@/lib";

export const saveCoupons = async (data: Coupon[]) => {
        try {
            await dbConnect();
            await couponService.deleteAllCoupons();
            await couponService.saveCoupons(data);
            return true;
        } catch (error: any) {
            return error
        }
};