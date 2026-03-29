import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AuthError } from "./auth";

export function successResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof AuthError) {
    return errorResponse(error.message, error.statusCode);
  }
  if (error instanceof ZodError) {
    const issues = error.issues.map(
      (e) => `${e.path.join(".")}: ${e.message}`
    );
    return errorResponse(issues.join("; "), 400);
  }
  console.error("Unhandled API error:", error);
  return errorResponse("Internal server error", 500);
}
