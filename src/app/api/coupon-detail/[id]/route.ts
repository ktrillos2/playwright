import { couponDetailActions } from "@/actions";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(request: NextApiRequest, { params }: { params: { id: string } }) {

  const { id } = params;


  try {
    const couponDetail = await couponDetailActions.getCouponDetailById(id as string);
    return new NextResponse(JSON.stringify(couponDetail), { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
} 