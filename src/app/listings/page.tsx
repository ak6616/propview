"use client";

import { useState, useMemo } from "react";
import PropertyCard from "@/components/PropertyCard";
import FilterPanel, { type Filters, defaultFilters } from "@/components/FilterPanel";
import { mockListings } from "@/lib/mock-data";

type SortOption = "newest" | "price-asc" | "price-desc";

export default function ListingsPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sort, setSort] = useState<SortOption>("newest");

  const filtered = useMemo(() => {
    let results = [...mockListings];

    if (filters.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q)
      );
    }

    if (filters.propertyType) {
      results = results.filter((l) => l.propertyType === filters.propertyType);
    }

    if (filters.minPrice) {
      const min = parseInt(filters.minPrice) * 100;
      results = results.filter((l) => l.priceCents >= min);
    }

    if (filters.maxPrice) {
      const max = parseInt(filters.maxPrice) * 100;
      results = results.filter((l) => l.priceCents <= max);
    }

    if (filters.beds) {
      const beds = parseInt(filters.beds);
      results = results.filter((l) => l.bedrooms >= beds);
    }

    if (filters.baths) {
      const baths = parseInt(filters.baths);
      results = results.filter((l) => l.bathrooms >= baths);
    }

    switch (sort) {
      case "price-asc":
        results.sort((a, b) => a.priceCents - b.priceCents);
        break;
      case "price-desc":
        results.sort((a, b) => b.priceCents - a.priceCents);
        break;
      case "newest":
      default:
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return results;
  }, [filters, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Properties</h1>
          <p className="mt-1 text-sm text-slate-500">{filtered.length} properties found</p>
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
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <svg className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="mt-4 font-medium text-slate-600">No properties match your filters</p>
              <p className="mt-1 text-sm text-slate-400">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((listing) => (
                <PropertyCard key={listing.id} property={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
