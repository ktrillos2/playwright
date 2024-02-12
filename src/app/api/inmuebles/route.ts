import { dbConnect, inmuebleService } from "@/app/lib";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // const params = request.nextUrl.searchParams;
  // console.log({params})
  try {
    await dbConnect();
    const inmuebles = await inmuebleService.getPaginateInmuebles({});
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
