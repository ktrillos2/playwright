import { couponActions } from "@/actions";
import { DBCoupon } from "@/interfaces";
import { dbConnect } from "@/lib";

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
		await couponActions.deleteCouponsByCommerceAndCategory(
			commerceId,
			categoryId
		);
		await couponActions.saveCoupons(data);
		return true;
	} catch (error: any) {
		throw error;
	}
};
