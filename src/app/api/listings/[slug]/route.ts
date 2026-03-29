import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateRequest, AuthError } from "@/lib/auth";
import { updateListingSchema } from "@/lib/validation";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    const listing = await prisma.listing.findUnique({
      where: { slug },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            agencyName: true,
            avatarUrl: true,
            bio: true,
          },
        },
        photos: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!listing) {
      return errorResponse("Listing not found", 404);
    }

    return successResponse({
      ...listing,
      priceCents: listing.priceCents.toString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { agentId } = authenticateRequest(req);
    const { slug } = await context.params;

    const listing = await prisma.listing.findUnique({ where: { slug } });
    if (!listing) return errorResponse("Listing not found", 404);
    if (listing.agentId !== agentId) {
      throw new AuthError("Not authorized to edit this listing", 403);
    }

    const body = await req.json();
    const data = updateListingSchema.parse(body);

    const updated = await prisma.listing.update({
      where: { slug },
      data: {
        ...data,
        priceCents: data.priceCents ? BigInt(data.priceCents) : undefined,
        amenities: data.amenities ?? undefined,
      },
    });

    return successResponse({
      ...updated,
      priceCents: updated.priceCents.toString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { agentId } = authenticateRequest(req);
    const { slug } = await context.params;

    const listing = await prisma.listing.findUnique({ where: { slug } });
    if (!listing) return errorResponse("Listing not found", 404);
    if (listing.agentId !== agentId) {
      throw new AuthError("Not authorized to delete this listing", 403);
    }

    // Soft delete by setting status to draft
    await prisma.listing.update({
      where: { slug },
      data: { status: "draft" },
    });

    return successResponse({ message: "Listing deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
