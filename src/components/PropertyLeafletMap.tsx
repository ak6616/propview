"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatPrice } from "@/lib/mock-data";

export interface MapListing {
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

function priceLabel(priceCents: string): string {
  return formatPrice(Number(priceCents)).replace(",000", "K");
}

// Price-pill marker as an HTML divIcon (avoids Leaflet's default image-asset paths).
function pinIcon(label: string, selected: boolean): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="transform:translate(-50%,-100%);white-space:nowrap;border-radius:9999px;padding:2px 8px;font-size:11px;font-weight:700;box-shadow:0 1px 4px rgba(0,0,0,.25);${
      selected
        ? "background:#047857;color:#fff;"
        : "background:#fff;color:#1e293b;"
    }">${label}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 13);
      return;
    }
    map.fitBounds(points, { padding: [50, 50] });
  }, [map, points]);
  return null;
}

export default function PropertyLeafletMap({
  listings,
  selectedId,
  setSelectedId,
}: {
  listings: MapListing[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}) {
  const geoListings = useMemo(
    () => listings.filter((l) => l.latitude != null && l.longitude != null),
    [listings]
  );
  const points = useMemo(
    () => geoListings.map((l) => [l.latitude!, l.longitude!] as [number, number]),
    [geoListings]
  );

  return (
    <MapContainer
      center={[52.0, 19.4]} // Poland
      zoom={6}
      scrollWheelZoom
      className="h-full w-full"
      style={{ background: "#e2e8f0" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points} />
      {geoListings.map((listing) => (
        <Marker
          key={listing.id}
          position={[listing.latitude!, listing.longitude!]}
          icon={pinIcon(priceLabel(listing.priceCents), selectedId === listing.id)}
          eventHandlers={{ click: () => setSelectedId(listing.id) }}
        >
          <Popup>
            <div className="w-52">
              <p className="text-sm font-bold text-emerald-700">
                {formatPrice(Number(listing.priceCents))}
              </p>
              <p className="text-sm font-medium text-slate-800">{listing.title}</p>
              <p className="text-xs text-slate-500">
                {listing.address}, {listing.city}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {listing.bedrooms > 0 ? `${listing.bedrooms} bed · ` : ""}
                {listing.bathrooms > 0 ? `${listing.bathrooms} bath · ` : ""}
                {listing.areaSqft > 0 ? `${listing.areaSqft.toLocaleString()} sqft` : ""}
              </p>
              <Link
                href={`/listings/${listing.slug}`}
                className="mt-2 block rounded-lg bg-emerald-600 py-1.5 text-center text-xs font-semibold text-white hover:bg-emerald-700"
              >
                View Details
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
