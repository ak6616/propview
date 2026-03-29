import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";
import { successResponse, handleApiError } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    const { agentId } = authenticateRequest(req);

    const agent = await prisma.agent.findUniqueOrThrow({
      where: { id: agentId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        agencyName: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
      },
    });

    return successResponse(agent);
  } catch (error) {
    return handleApiError(error);
  }
}
