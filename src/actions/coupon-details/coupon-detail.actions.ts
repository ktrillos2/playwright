"use server";

import { convertBase64ToFile, transformData } from "@/helpers";
import { commerceLookup, CouponDetailModel, couponLookup, dbConnect, validateMongoId } from "@/lib";
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

export const getCouponDetailById = async (_id: string) => {

    const result = await couponDetailModel.aggregate([
        {
            $match: validateMongoId(_id)
        },
        ...couponLookup({
            unwindData: true, pipeline: [
                ...commerceLookup({ unwindData: true }),
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        url: 1,
                        commerce: {
                            _id: 1,
                            name: 1,
                            companyKumonera: 1
                        },
                    }
                }
            ]
        }),

    ])

    return transformData(result[0]);
};