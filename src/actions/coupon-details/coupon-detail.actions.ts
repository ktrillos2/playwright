"use server";

import { convertBase64ToFile, transformData } from "@/helpers";
import { CouponDetailModel, dbConnect } from "@/lib";
import { kumoneraService } from "@/service/cloud.service";

dbConnect();
const couponDetailModel = CouponDetailModel;

export const saveCouponDetail = async (imgBase64: any, couponId: string) => {

    const file = convertBase64ToFile(imgBase64, couponId)

    const formData = new FormData();
    formData.append('file', file);

    const path = await kumoneraService.uploadFile(formData);

    const couponDetail = await couponDetailModel.create({
        coupon: couponId,
        image: path
    });

    return transformData(couponDetail)
};