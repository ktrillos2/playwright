
// get route coupon by id in next js
// something like this : export async function GET(request: NextRequest) {
//   const { page: pageParam, limit: limitParam } = getSearchParams(request);
//   const page = +pageParam || 1;
//   const limit = +limitParam || 25;
//   try {
//     await dbConnect();
//     const coupons = await couponService.getPaginateCoupons({
//       page,
//       limit,
//     });
//     return new NextResponse(JSON.stringify(coupons), { status: 200 });
//   } catch (error: any) {
//     return new NextResponse(error.message, { status: 500 });
//   }
// }

import { NextRequest } from "next/server";

//
// export async function GET(request: NextRequest) {
//   const {id} = request.params;
// }