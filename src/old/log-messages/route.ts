import { NextRequest, NextResponse } from "next/server";
import { logMessageService, dbConnect } from "@/lib";
import { getSearchParams } from "@/helpers";
import { LogCategory, LogType } from "@/interfaces";

export async function GET(request: NextRequest) {
  const { category } = getSearchParams(request);
  try {
    await dbConnect();
    const logMessages = await logMessageService.getLogMessagesByCategory(
      category as LogCategory
    );
    return new NextResponse(JSON.stringify(logMessages), { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { type, category, message, error } = await request.json();
  try {
    await dbConnect();
    const newLogMessage = await logMessageService.createLogMessage({
      type: type as LogType,
      category: category as LogCategory,
      message,
      error,
    });
    return new NextResponse(JSON.stringify(newLogMessage), { status: 201 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { category } = await request.json();
  try {
    await dbConnect();
    await logMessageService.deleteLogMessagesByCategory(
      category as LogCategory
    );
    return new NextResponse(JSON.stringify({}), { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
