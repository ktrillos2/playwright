import { HttpStatusCode } from "axios";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export function stringToObjectId(id: string): mongoose.Types.ObjectId | null {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  } else {
    return null;
  }
}

export function createErrorResponse(
  message: string,
  status: HttpStatusCode
): NextResponse {
  const errorResponse = {
    status,
    message,
  };

  return new NextResponse(JSON.stringify(errorResponse), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
