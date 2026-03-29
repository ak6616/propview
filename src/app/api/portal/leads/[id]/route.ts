import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateRequest, AuthError } from "@/lib/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { agentId } = authenticateRequest(req);
    const { id } = await context.params;

    const inquiry = await prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) return errorResponse("Lead not found", 404);
    if (inquiry.agentId !== agentId) {
      throw new AuthError("Not authorized", 403);
    }

    const body = await req.json();
    const updated = await prisma.inquiry.update({
      where: { id },
      data: { isRead: body.isRead ?? true },
    });

    return successResponse(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
