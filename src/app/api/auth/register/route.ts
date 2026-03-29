import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import { successResponse, handleApiError } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const existing = await prisma.agent.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return Response.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await hashPassword(data.password);
    const agent = await prisma.agent.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        phone: data.phone,
        agencyName: data.agencyName,
      },
    });

    const token = signToken({ agentId: agent.id, email: agent.email });

    return successResponse(
      {
        token,
        agent: {
          id: agent.id,
          email: agent.email,
          name: agent.name,
        },
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
