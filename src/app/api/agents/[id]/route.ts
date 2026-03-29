import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const agent = await prisma.agent.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        agencyName: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        listings: {
          where: { status: "active" },
          select: {
            id: true,
            title: true,
            slug: true,
            priceCents: true,
            city: true,
            propertyType: true,
            bedrooms: true,
            bathrooms: true,
            photos: { where: { isPrimary: true }, take: 1 },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!agent) return errorResponse("Agent not found", 404);

    return successResponse({
      ...agent,
      listings: agent.listings.map((l) => ({
        ...l,
        priceCents: l.priceCents.toString(),
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
