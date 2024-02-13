import { NextRequest, NextResponse } from "next/server";

import { dbConnect, inmuebleService } from "@/app/lib";
import { getSearchParams } from "@/helpers";

export async function GET(request: NextRequest) {
  const { page: pageParam, limit: limitParam } = getSearchParams(request);
  const page = +pageParam || 1;
  const limit = +limitParam || 25;
  try {
    await dbConnect();
    const inmuebles = await inmuebleService.getPaginateInmuebles({
      page,
      limit,
    });
    return new NextResponse(JSON.stringify(inmuebles), { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    await inmuebleService.deleteAllInmuebles();
    return new NextResponse(JSON.stringify({}), { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
