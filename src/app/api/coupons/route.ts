import { NextRequest, NextResponse } from "next/server";
import { getSearchParams } from "@/helpers";
import { couponService, dbConnect } from "@/lib";

export async function GET(request: NextRequest) {
  const { page: pageParam, limit: limitParam } = getSearchParams(request);
  const page = +pageParam || 1;
  const limit = +limitParam || 25;
  try {
    await dbConnect();
    const coupons = await couponService.getPaginateCoupons({
      page,
      limit,
    });
    return new NextResponse(JSON.stringify(coupons), { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    await couponService.deleteAllCoupons();
    return new NextResponse(JSON.stringify({}), { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
