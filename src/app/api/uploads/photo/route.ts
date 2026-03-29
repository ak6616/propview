import { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { authenticateRequest, AuthError } from "@/lib/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const { agentId } = authenticateRequest(req);

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const listingId = formData.get("listingId") as string | null;
    const isPrimary = formData.get("isPrimary") === "true";
    const altText = formData.get("altText") as string | null;

    if (!file) return errorResponse("No file provided", 400);
    if (!listingId) return errorResponse("listingId is required", 400);

    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse("Only JPEG, PNG, and WebP images are allowed", 400);
    }
    if (file.size > MAX_SIZE) {
      return errorResponse("File size exceeds 10MB limit", 400);
    }

    // Verify the listing belongs to the agent
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { agentId: true },
    });
    if (!listing) return errorResponse("Listing not found", 404);
    if (listing.agentId !== agentId) {
      throw new AuthError("Not authorized to upload to this listing", 403);
    }

    // Upload to Vercel Blob
    const blob = await put(`listings/${listingId}/${file.name}`, file, {
      access: "public",
    });

    // Get current max sort order
    const maxSort = await prisma.listingPhoto.aggregate({
      where: { listingId },
      _max: { sortOrder: true },
    });

    const photo = await prisma.listingPhoto.create({
      data: {
        listingId,
        url: blob.url,
        altText,
        isPrimary,
        sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
      },
    });

    return successResponse(photo, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
