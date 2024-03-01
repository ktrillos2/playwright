import { DBCoupon } from "@/interfaces";
import { couponService, dbConnect } from "@/lib";

interface SaveCoupon {
	data: DBCoupon[];
	categoryId: string;
	commerceId: string;
}

export const saveCoupons = async ({
	categoryId,
	commerceId,
	data,
}: SaveCoupon) => {
	try {
		await dbConnect();
		await couponService.deleteCouponsByCommerceAndCategory(
			commerceId,
			categoryId
		);
		await couponService.saveCoupons(data);
		return true;
	} catch (error: any) {
		throw error;
	}
};
