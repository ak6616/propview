import { NextRequest } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { authenticateRequest, AuthError } from "@/lib/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { agentId } = authenticateRequest(req);
    const { id } = await context.params;

    const photo = await prisma.listingPhoto.findUnique({
      where: { id },
      include: { listing: { select: { agentId: true } } },
    });

    if (!photo) return errorResponse("Photo not found", 404);
    if (photo.listing.agentId !== agentId) {
      throw new AuthError("Not authorized to delete this photo", 403);
    }

    // Delete from Vercel Blob
    await del(photo.url);

    // Delete from database
    await prisma.listingPhoto.delete({ where: { id } });

    return successResponse({ message: "Photo deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
