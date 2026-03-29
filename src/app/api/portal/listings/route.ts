import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";
import { successResponse, handleApiError } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    const { agentId } = authenticateRequest(req);

    const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "20");
    const status = req.nextUrl.searchParams.get("status");
    const skip = (page - 1) * limit;

    const where = {
      agentId,
      ...(status ? { status } : {}),
    };

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          photos: { where: { isPrimary: true }, take: 1 },
          _count: { select: { inquiries: true } },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return successResponse({
      listings: listings.map((l) => ({
        ...l,
        priceCents: l.priceCents.toString(),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
