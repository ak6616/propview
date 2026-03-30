"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { formatPrice } from "@/lib/mock-data";

interface MapListing {
  id: string;
  slug: string;
  title: string;
  priceCents: string;
  address: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  latitude: number | null;
  longitude: number | null;
}

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

function PropertyMarker({
  listing,
  isSelected,
  onClick,
}: {
  listing: MapListing;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <AdvancedMarker
      position={{ lat: listing.latitude!, lng: listing.longitude! }}
      onClick={onClick}
      zIndex={isSelected ? 20 : 1}
    >
      <div
        className={`rounded-full px-2 py-1 text-[11px] font-bold shadow-md transition cursor-pointer ${
          isSelected
            ? "bg-emerald-700 text-white scale-110"
            : "bg-white text-slate-800 hover:bg-emerald-50"
        }`}
      >
        {formatPrice(Number(listing.priceCents))
          .replace(",000", "K")
          .replace("$", "$")}
      </div>
    </AdvancedMarker>
  );
}

function MapContent({
  listings,
  selectedId,
  setSelectedId,
}: {
  listings: MapListing[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}) {
  const map = useMap();
  const geoListings = listings.filter((l) => l.latitude && l.longitude);
  const selected = selectedId
    ? geoListings.find((l) => l.id === selectedId)
    : null;

  // Fit bounds to all markers on load
  useEffect(() => {
    if (!map || geoListings.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    geoListings.forEach((l) =>
      bounds.extend({ lat: l.latitude!, lng: l.longitude! })
    );
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 80, left: 50 });
  }, [map, geoListings.length]);

  return (
    <>
      {geoListings.map((listing) => (
        <PropertyMarker
          key={listing.id}
          listing={listing}
          isSelected={selectedId === listing.id}
          onClick={() =>
            setSelectedId(selectedId === listing.id ? null : listing.id)
          }
        />
      ))}

      {selected && selected.latitude && selected.longitude && (
        <InfoWindow
          position={{ lat: selected.latitude, lng: selected.longitude }}
          onCloseClick={() => setSelectedId(null)}
          pixelOffset={[0, -30]}
        >
          <div className="w-56 p-1">
            <p className="text-sm font-bold text-emerald-700">
              {formatPrice(Number(selected.priceCents))}
            </p>
            <p className="text-sm font-medium text-slate-800">
              {selected.title}
            </p>
            <p className="text-xs text-slate-500">
              {selected.address}, {selected.city}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {selected.bedrooms} bed &middot; {selected.bathrooms} bath &middot;{" "}
              {selected.areaSqft.toLocaleString()} sqft
            </p>
            <Link
              href={`/listings/${selected.slug}`}
              className="mt-2 block rounded-lg bg-emerald-600 py-1.5 text-center text-xs font-semibold text-white hover:bg-emerald-700"
            >
              View Details
            </Link>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function FallbackMap({
  listings,
  selectedId,
  setSelectedId,
}: {
  listings: MapListing[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}) {
  const geoListings = listings.filter((l) => l.latitude && l.longitude);
  const selected = selectedId
    ? listings.find((l) => l.id === selectedId)
    : null;

  return (
    <div className="relative flex flex-1 items-center justify-center bg-slate-100">
      <div className="text-center text-slate-400">
        <svg
          className="mx-auto h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <p className="mt-3 text-sm font-medium">Google Maps Integration</p>
        <p className="mt-1 text-xs">
          Requires NEXT_PUBLIC_GOOGLE_MAPS_KEY environment variable
        </p>
      </div>

      {geoListings.map((listing) => {
        const x = ((listing.longitude! + 122.8) / 0.2) * 100;
        const y = ((45.56 - listing.latitude!) / 0.16) * 100;
        return (
          <button
            key={listing.id}
            className={`absolute z-10 -translate-x-1/2 -translate-y-full rounded-full px-2 py-1 text-[10px] font-bold shadow-md transition ${
              selectedId === listing.id
                ? "z-20 bg-emerald-700 text-white scale-110"
                : "bg-white text-slate-800 hover:bg-emerald-50"
            }`}
            style={{
              left: `${Math.min(90, Math.max(10, x))}%`,
              top: `${Math.min(90, Math.max(10, y))}%`,
            }}
            onClick={() => setSelectedId(listing.id)}
          >
            {formatPrice(Number(listing.priceCents))
              .replace(",000", "K")
              .replace("$", "$")}
          </button>
        );
      })}

      {selected && (
        <div className="absolute bottom-6 left-1/2 z-30 w-72 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
          <div className="aspect-video rounded-lg bg-slate-100" />
          <p className="mt-2 text-sm font-bold text-emerald-700">
            {formatPrice(Number(selected.priceCents))}
          </p>
          <p className="text-sm font-medium text-slate-800">{selected.title}</p>
          <p className="text-xs text-slate-500">
            {selected.bedrooms} bed &middot; {selected.bathrooms} bath &middot;{" "}
            {selected.areaSqft.toLocaleString()} sqft
          </p>
          <Link
            href={`/listings/${selected.slug}`}
            className="mt-2 block rounded-lg bg-emerald-600 py-1.5 text-center text-xs font-semibold text-white hover:bg-emerald-700"
          >
            View Details
          </Link>
        </div>
      )}
    </div>
  );
}

export default function MapPage() {
  const [listings, setListings] = useState<MapListing[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/listings?limit=50");
        const json = await res.json();
        if (res.ok && json.data) {
          setListings(json.data.listings);
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
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
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

      {/* Right panel — map */}
      {MAPS_KEY ? (
        <div className="relative flex-1">
          <APIProvider apiKey={MAPS_KEY}>
            <Map
              className="h-full w-full"
              defaultCenter={{ lat: 45.52, lng: -122.68 }}
              defaultZoom={11}
              mapId="934898e84c64ef4c3fe620c1"
              gestureHandling="greedy"
              disableDefaultUI={false}
            >
              <MapContent
                listings={listings}
                selectedId={selectedId}
                setSelectedId={handleSelect}
              />
            </Map>
          </APIProvider>
        </div>
      ) : (
        <FallbackMap
          listings={listings}
          selectedId={selectedId}
          setSelectedId={handleSelect}
        />
      )}
    </div>
  );
}
