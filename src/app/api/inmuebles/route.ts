import { NextResponse } from "next/server";
import { connect } from "../../../../lib";

export async function GET(request: Request) {
  try {
    const { Inmueble } = await connect();
    const inmuebles = await Inmueble.find();
    return new Response(JSON.stringify(inmuebles), { status: 200 });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { Inmueble } = await connect();
    await Inmueble.deleteMany({});
    return new Response(JSON.stringify({}), { status: 200 });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
