import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";
import { createListingSchema, listingsQuerySchema, parseSearchParams } from "@/lib/validation";
import { successResponse, handleApiError } from "@/lib/api-utils";
import { generateUniqueSlug } from "@/lib/slug";
import { Prisma } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const params = parseSearchParams(req.nextUrl.searchParams);
    const query = listingsQuerySchema.parse(params);

    const where: Prisma.ListingWhereInput = { status: "active" };

    if (query.city) where.city = { equals: query.city, mode: "insensitive" };
    if (query.type) where.propertyType = query.type;
    if (query.beds) where.bedrooms = { gte: query.beds };
    if (query.baths) where.bathrooms = { gte: query.baths };

    if (query.minPrice || query.maxPrice) {
      where.priceCents = {};
      if (query.minPrice) where.priceCents.gte = BigInt(query.minPrice);
      if (query.maxPrice) where.priceCents.lte = BigInt(query.maxPrice);
    }

    // Full-text search using Prisma's contains (PostGIS geospatial handled via raw query)
    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: "insensitive" } },
        { description: { contains: query.q, mode: "insensitive" } },
        { city: { contains: query.q, mode: "insensitive" } },
        { address: { contains: query.q, mode: "insensitive" } },
      ];
    }

    // For geospatial radius search, use raw query
    if (query.lat !== undefined && query.lng !== undefined && query.radius) {
      const radiusMeters = query.radius * 1000;
      const geoListings = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
        `SELECT id FROM listings
         WHERE status = 'active'
         AND latitude IS NOT NULL AND longitude IS NOT NULL
         AND (
           6371000 * acos(
             cos(radians($1)) * cos(radians(latitude))
             * cos(radians(longitude) - radians($2))
             + sin(radians($1)) * sin(radians(latitude))
           )
         ) <= $3
         ORDER BY (
           6371000 * acos(
             cos(radians($1)) * cos(radians(latitude))
             * cos(radians(longitude) - radians($2))
             + sin(radians($1)) * sin(radians(latitude))
           )
         )`,
        query.lat,
        query.lng,
        radiusMeters
      );
      const ids = geoListings.map((l) => l.id);
      if (ids.length === 0) {
        return successResponse({ listings: [], total: 0, page: query.page, limit: query.limit });
      }
      where.id = { in: ids };
    }

    const skip = (query.page - 1) * query.limit;

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          agent: { select: { id: true, name: true, agencyName: true, avatarUrl: true } },
          photos: { where: { isPrimary: true }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: query.limit,
      }),
      prisma.listing.count({ where }),
    ]);

    // Serialize BigInt
    const serialized = listings.map((l) => ({
      ...l,
      priceCents: l.priceCents.toString(),
    }));

    return successResponse({
      listings: serialized,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { agentId } = authenticateRequest(req);
    const body = await req.json();
    const data = createListingSchema.parse(body);

    const slug = await generateUniqueSlug(data.title);

    const listing = await prisma.listing.create({
      data: {
        agentId,
        title: data.title,
        slug,
        description: data.description,
        propertyType: data.propertyType,
        priceCents: BigInt(data.priceCents),
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        areaSqft: data.areaSqft,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        latitude: data.latitude,
        longitude: data.longitude,
        virtualTourUrl: data.virtualTourUrl,
        yearBuilt: data.yearBuilt,
        amenities: data.amenities ?? [],
      },
      include: {
        agent: { select: { id: true, name: true } },
      },
    });

    return successResponse(
      { ...listing, priceCents: listing.priceCents.toString() },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
