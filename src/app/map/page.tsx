"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { formatPrice } from "@/lib/mock-data";
import type { MapListing } from "@/components/PropertyLeafletMap";

// Leaflet touches `window`, so load it client-side only.
const PropertyLeafletMap = dynamic(
  () => import("@/components/PropertyLeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-1 items-center justify-center bg-slate-100 text-sm text-slate-400">
        Loading map…
      </div>
    ),
  }
);

export default function MapPage() {
  const [listings, setListings] = useState<MapListing[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/listings?limit=200");
        const json = await res.json();
        if (res.ok && json.listings) {
          setListings(json.listings);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  const handleSelect = useCallback(
    (id: string | null) => setSelectedId(id),
    []
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* Left panel — listing cards */}
      <div className="w-full shrink-0 overflow-y-auto border-r border-slate-200 bg-white lg:w-96">
        <div className="border-b border-slate-200 p-4">
          <input
            type="text"
            placeholder="Search location..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          />
          <p className="mt-2 text-xs text-slate-500">
            {loading ? "Loading..." : `${listings.length} properties`}
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {listings.map((listing) => (
            <button
              key={listing.id}
              className={`flex w-full gap-3 p-4 text-left transition hover:bg-slate-50 ${
                selectedId === listing.id
                  ? "border-l-2 border-emerald-600 bg-emerald-50"
                  : ""
              }`}
              onClick={() => setSelectedId(listing.id)}
            >
              <div className="h-20 w-20 shrink-0 rounded-lg bg-slate-100" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-emerald-700">
                  {formatPrice(Number(listing.priceCents))}
                </p>
                <p className="truncate text-sm font-medium text-slate-800">
                  {listing.title}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {listing.address}, {listing.city}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {listing.bedrooms > 0 ? `${listing.bedrooms} bed · ` : ""}
                  {listing.bathrooms > 0 ? `${listing.bathrooms} bath · ` : ""}
                  {listing.areaSqft > 0
                    ? `${listing.areaSqft.toLocaleString()} sqft`
                    : ""}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right panel — keyless OpenStreetMap (Leaflet) */}
      <div className="relative flex-1">
        <PropertyLeafletMap
          listings={listings}
          selectedId={selectedId}
          setSelectedId={handleSelect}
        />
      </div>
    </div>
  );
}
