"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import AgentCard from "@/components/AgentCard";
import { type Property, type AgentProfile } from "@/lib/mock-data";

const propertyTypes = [
  { label: "House", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { label: "Apartment", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { label: "Condo", icon: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" },
  { label: "Townhouse", icon: "M3 12l2-2m0 0l3-3m-3 3v8a2 2 0 002 2h2m8-12l3 3m0 0l2 2m-2-2v8a2 2 0 01-2 2h-2m-4 0h4" },
  { label: "Land", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" },
];

const stats = [
  { value: "10K+", label: "Listings" },
  { value: "500+", label: "Verified Agents" },
  { value: "5K+", label: "Properties Sold" },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [agents, setAgents] = useState<AgentProfile[]>([]);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/listings?limit=4");
        const json = await res.json();
        if (res.ok && json.data) {
          setFeatured(json.data.listings.map((l: Record<string, unknown>) => ({
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
            yearBuilt: l.yearBuilt ?? 0,
            amenities: l.amenities ?? [],
            photos: (l.photos as Array<Record<string, unknown>>) ?? [],
            agent: l.agent ?? { id: "", name: "", email: "", phone: "", agencyName: "", avatarUrl: "", bio: "", listingCount: 0, rating: 0, reviewCount: 0 },
            createdAt: l.createdAt as string,
          })));
        }
      } catch {
        // silently fail — homepage still renders static content
      }
    }
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find Your Dream Property
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-emerald-100">
            Search from thousands of verified listings across the country
          </p>

          {/* Search Bar */}
          <form action="/listings" className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <input
              type="text"
              name="q"
              placeholder="City, address, or keyword..."
              className="flex-1 rounded-lg border-0 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />
            <select
              name="type"
              className="rounded-lg border-0 px-4 py-3 text-slate-700 shadow-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="land">Land</option>
            </select>
            <button
              type="submit"
              className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-amber-600"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl justify-center divide-x divide-slate-200 py-8">
          {stats.map((s) => (
            <div key={s.label} className="px-8 text-center">
              <p className="text-2xl font-bold text-emerald-700">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Featured Listings</h2>
          <Link href="/listings" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
            View all &rarr;
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((listing) => (
              <PropertyCard key={listing.id} property={listing} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          </div>
        )}
      </section>

      {/* Browse by Type */}
      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl font-bold text-slate-900">Browse by Type</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {propertyTypes.map((type) => (
              <Link
                key={type.label}
                href={`/listings?type=${type.label.toLowerCase()}`}
                className="flex w-32 flex-col items-center rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
              >
                <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={type.icon} />
                </svg>
                <span className="mt-2 text-sm font-medium text-slate-700">{type.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Map Teaser */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 p-8 text-white sm:p-12">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold">Browse Properties on an Interactive Map</h2>
            <p className="mt-2 max-w-lg text-slate-300">
              Explore listings by location, see what&apos;s available in your favorite neighborhoods, and find the perfect property near you.
            </p>
            <Link
              href="/map"
              className="mt-4 inline-block rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Open Map View
            </Link>
          </div>
          <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-emerald-600/20" />
          <div className="absolute -bottom-4 right-16 h-32 w-32 rounded-full bg-emerald-600/10" />
        </div>
      </section>

      {/* Top Agents — still uses agent data from listings since there's no /api/agents list endpoint */}
      {agents.length > 0 && (
        <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-2xl font-bold text-slate-900">Top Agents</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
