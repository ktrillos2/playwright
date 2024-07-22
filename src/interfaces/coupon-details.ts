import { Coupon } from "./coupon.interface"

export interface DBCouponDetail {
    image: string
    coupon: string
}

export interface CouponDetail {
    image: string
    coupon: Coupon
}