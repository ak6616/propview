"use client";

import { use } from "react";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { mockAgents, mockListings } from "@/lib/mock-data";

export default function AgentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const agent = mockAgents.find((a) => a.id === id);

  if (!agent) {
    return (
      <div className="flex flex-col items-center py-32 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Agent Not Found</h1>
        <Link href="/" className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700">
          &larr; Back to home
        </Link>
      </div>
    );
  }

  const agentListings = mockListings.filter((l) => l.agent.id === agent.id);

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
          <p className="text-slate-500">{agent.agencyName}</p>
          <div className="mt-2 flex items-center justify-center gap-1 text-sm sm:justify-start">
            <svg className="h-4 w-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium">{agent.rating}</span>
            <span className="text-slate-400">({agent.reviewCount} reviews)</span>
            <span className="ml-2 text-slate-400">&middot;</span>
            <span className="ml-2 text-slate-500">{agent.listingCount} listings</span>
          </div>
          <p className="mt-3 max-w-xl text-sm text-slate-600">{agent.bio}</p>
          <div className="mt-4 flex gap-3">
            <a href={`tel:${agent.phone}`} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
              Call Agent
            </a>
            <a href={`mailto:${agent.email}`} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Email Agent
            </a>
          </div>
        </div>
      </div>

      {/* Agent listings */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-slate-900">Listings by {agent.name}</h2>
        {agentListings.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {agentListings.map((listing) => (
              <PropertyCard key={listing.id} property={listing} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">No active listings at this time.</p>
        )}
      </div>
    </div>
  );
}
