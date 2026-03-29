import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validation";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";

// Simple in-memory rate limiter (per IP, 3 requests per hour)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600_000 });
    return true;
  }

  if (entry.count >= 3) return false;

  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
    if (!checkRateLimit(ip)) {
      return errorResponse("Rate limit exceeded. Max 3 inquiries per hour.", 429);
    }

    const body = await req.json();
    const data = contactSchema.parse(body);

    const listing = await prisma.listing.findUnique({
      where: { id: data.listingId },
      select: { id: true, agentId: true, title: true },
    });

    if (!listing) {
      return errorResponse("Listing not found", 404);
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        listingId: listing.id,
        agentId: listing.agentId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      },
    });

    return successResponse(
      { id: inquiry.id, message: "Inquiry submitted successfully" },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
