import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, signToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = loginSchema.parse(body);

    const agent = await prisma.agent.findUnique({
      where: { email: data.email },
    });
    if (!agent) {
      return errorResponse("Invalid email or password", 401);
    }

    const valid = await verifyPassword(data.password, agent.passwordHash);
    if (!valid) {
      return errorResponse("Invalid email or password", 401);
    }

    const token = signToken({ agentId: agent.id, email: agent.email });

    return successResponse({
      token,
      agent: {
        id: agent.id,
        email: agent.email,
        name: agent.name,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
