import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(200),
  phone: z.string().max(30).optional(),
  agencyName: z.string().max(200).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createListingSchema = z.object({
  title: z.string().min(1).max(300),
  description: z.string().min(1),
  propertyType: z.enum(["house", "apartment", "condo", "townhouse", "land"]),
  priceCents: z.number().int().positive(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  areaSqft: z.number().int().positive().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  virtualTourUrl: z.string().url().optional(),
  yearBuilt: z.number().int().min(1800).max(2100).optional(),
  amenities: z.array(z.string()).optional(),
});

export const updateListingSchema = createListingSchema.partial().extend({
  status: z.enum(["active", "pending", "sold", "draft"]).optional(),
});

export const listingsQuerySchema = z.object({
  q: z.string().optional(),
  city: z.string().optional(),
  type: z.enum(["house", "apartment", "condo", "townhouse", "land"]).optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  beds: z.coerce.number().int().min(0).optional(),
  baths: z.coerce.number().min(0).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().positive().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const contactSchema = z.object({
  listingId: z.string().uuid(),
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  message: z.string().min(1).max(5000),
});

export function parseSearchParams(
  searchParams: URLSearchParams
): Record<string, string> {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}
