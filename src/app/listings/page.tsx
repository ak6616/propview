"use client";

import { useState, useEffect, useCallback } from "react";
import PropertyCard from "@/components/PropertyCard";
import FilterPanel, { type Filters, defaultFilters } from "@/components/FilterPanel";
import { type Property, formatPrice } from "@/lib/mock-data";

type SortOption = "newest" | "price-asc" | "price-desc";

export default function ListingsPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sort, setSort] = useState<SortOption>("newest");
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();

    if (filters.query) params.set("q", filters.query);
    if (filters.propertyType) params.set("type", filters.propertyType);
    if (filters.minPrice) params.set("minPrice", String(parseInt(filters.minPrice) * 100));
    if (filters.maxPrice) params.set("maxPrice", String(parseInt(filters.maxPrice) * 100));
    if (filters.beds) params.set("beds", filters.beds);
    if (filters.baths) params.set("baths", filters.baths);
    params.set("limit", "50");

    try {
      const res = await fetch(`/api/listings?${params}`);
      const json = await res.json();
      if (res.ok && json.listings) {
        const mapped: Property[] = json.listings.map((l: Record<string, unknown>) => ({
          id: l.id,
          slug: l.slug,
          title: l.title,
          description: l.description || "",
          propertyType: l.propertyType,
          status: l.status,
          priceCents: Number(l.priceCents),
          bedrooms: l.bedrooms ?? 0,
          bathrooms: l.bathrooms ?? 0,
          areaSqft: l.areaSqft ?? 0,
          address: l.address,
          city: l.city,
          state: l.state,
          zip: l.zip,
          latitude: l.latitude ?? 0,
          longitude: l.longitude ?? 0,
          virtualTourUrl: l.virtualTourUrl,
          yearBuilt: l.yearBuilt ?? 0,
          amenities: l.amenities ?? [],
          photos: (l.photos as Array<Record<string, unknown>>) ?? [],
          agent: l.agent ?? { id: "", name: "", email: "", phone: "", agencyName: "", avatarUrl: "", bio: "", listingCount: 0, rating: 0, reviewCount: 0 },
          createdAt: l.createdAt as string,
        }));

        // Client-side sort
        switch (sort) {
          case "price-asc":
            mapped.sort((a, b) => a.priceCents - b.priceCents);
            break;
          case "price-desc":
            mapped.sort((a, b) => b.priceCents - a.priceCents);
            break;
          case "newest":
          default:
            mapped.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        setListings(mapped);
        setTotal(json.total);
      }
    } catch {
      // silently fail, show empty state
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Properties</h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading ? "Loading..." : `${total} properties found`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-500">Sort by:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <FilterPanel filters={filters} onChange={setFilters} className="w-full shrink-0 lg:w-64" />

        {/* Results */}
        <div className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
              <p className="mt-4 text-sm text-slate-500">Loading properties...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <svg className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="mt-4 font-medium text-slate-600">No properties match your filters</p>
              <p className="mt-1 text-sm text-slate-400">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <PropertyCard key={listing.id} property={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
