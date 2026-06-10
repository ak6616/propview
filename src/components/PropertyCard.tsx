import Link from "next/link";
import { type Property, formatPrice, formatArea } from "@/lib/mock-data";
import { resolveImg } from "@/lib/img";

export default function PropertyCard({ property }: { property: Property }) {
  const primaryPhoto = property.photos.find((p) => p.isPrimary) ?? property.photos[0];
  const badgeColor =
    property.status === "sold"
      ? "bg-slate-600"
      : property.status === "pending"
        ? "bg-amber-500"
        : "bg-emerald-600";

  return (
    <Link
      href={`/listings/${property.slug}`}
      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
    >
      {/* Photo */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolveImg(primaryPhoto?.url, 800, 500)}
          alt={primaryPhoto?.alt || property.title}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <span className={`rounded-full ${badgeColor} px-2.5 py-1 text-xs font-semibold text-white`}>
            {property.status === "active" ? "For Sale" : property.status === "pending" ? "Pending" : "Sold"}
          </span>
        </div>
        <div className="absolute right-3 top-3">
          <span className="rounded-md bg-slate-800/70 px-2 py-1 text-xs text-white capitalize">
            {property.propertyType}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-lg font-bold text-emerald-700">{formatPrice(property.priceCents)}</p>
        <h3 className="mt-1 truncate text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
          {property.title}
        </h3>
        <p className="mt-0.5 truncate text-sm text-slate-500">
          {property.address}, {property.city}, {property.state}
        </p>
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
              </svg>
              {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}
            </span>
          )}
          {property.bathrooms > 0 && (
            <span>{property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}</span>
          )}
          {property.areaSqft > 0 && <span>{formatArea(property.areaSqft)} sqft</span>}
        </div>
      </div>
    </Link>
  );
}
