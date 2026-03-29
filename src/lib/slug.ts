import slugify from "slugify";
import { prisma } from "./db";

export async function generateUniqueSlug(title: string): Promise<string> {
  const base = slugify(title, { lower: true, strict: true });
  let slug = base;
  let counter = 1;

  while (await prisma.listing.findUnique({ where: { slug } })) {
    slug = `${base}-${counter}`;
    counter++;
  }

  return slug;
}
