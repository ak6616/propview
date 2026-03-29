"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/mock-data";

interface AgentData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  agencyName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  listings: {
    id: string;
    title: string;
    slug: string;
    priceCents: string;
    city: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    photos: { url: string; altText: string | null; isPrimary: boolean }[];
  }[];
}

export default function AgentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchAgent() {
      try {
        const res = await fetch(`/api/agents/${id}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        const json = await res.json();
        if (res.ok && json.data) {
          setAgent(json.data);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchAgent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  if (notFound || !agent) {
    return (
      <div className="flex flex-col items-center py-32 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Agent Not Found</h1>
        <Link href="/" className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700">
          &larr; Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile header */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-slate-900">{agent.name}</h1>
          {agent.agencyName && <p className="text-slate-500">{agent.agencyName}</p>}
          <p className="mt-1 text-sm text-slate-500">{agent.listings.length} active listings</p>
          {agent.bio && <p className="mt-3 max-w-xl text-sm text-slate-600">{agent.bio}</p>}
          <div className="mt-4 flex gap-3">
            {agent.phone && (
              <a href={`tel:${agent.phone}`} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                Call Agent
              </a>
            )}
            <a href={`mailto:${agent.email}`} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Email Agent
            </a>
          </div>
        </div>
      </div>

      {/* Agent listings */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-slate-900">Listings by {agent.name}</h2>
        {agent.listings.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {agent.listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.slug}`}
                className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
                    </svg>
                  </div>
                  <div className="absolute right-3 top-3">
                    <span className="rounded-md bg-slate-800/70 px-2 py-1 text-xs text-white capitalize">{listing.propertyType}</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-lg font-bold text-emerald-700">{formatPrice(Number(listing.priceCents))}</p>
                  <h3 className="mt-1 truncate text-sm font-semibold text-slate-900 group-hover:text-emerald-700">{listing.title}</h3>
                  <p className="mt-0.5 truncate text-sm text-slate-500">{listing.city}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                    {listing.bedrooms > 0 && <span>{listing.bedrooms} bed{listing.bedrooms !== 1 ? "s" : ""}</span>}
                    {listing.bathrooms > 0 && <span>{listing.bathrooms} bath{listing.bathrooms !== 1 ? "s" : ""}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">No active listings at this time.</p>
        )}
      </div>
    </div>
  );
}
