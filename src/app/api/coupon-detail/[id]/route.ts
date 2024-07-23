import { couponDetailActions } from "@/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {

  const { id } = params;

  try {
    const couponDetail = await couponDetailActions.getCouponDetailById(id as string);
    if (!couponDetail) throw new Error("errors.coupon-detail-not-found");
    return new NextResponse(JSON.stringify(couponDetail), { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
} 