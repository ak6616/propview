import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";
import { successResponse, handleApiError } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    const { agentId } = authenticateRequest(req);

    const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "20");
    const skip = (page - 1) * limit;

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where: { agentId },
        include: {
          listing: { select: { id: true, title: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.inquiry.count({ where: { agentId } }),
    ]);

    return successResponse({
      leads: inquiries,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
