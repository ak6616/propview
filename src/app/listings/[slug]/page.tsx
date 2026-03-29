"use client";

import { use, useState } from "react";
import Link from "next/link";
import PhotoGallery from "@/components/PhotoGallery";
import ContactFormModal from "@/components/ContactFormModal";
import { mockListings, formatPrice, formatArea } from "@/lib/mock-data";

export default function ListingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const listing = mockListings.find((l) => l.slug === slug);
  const [showContact, setShowContact] = useState(false);

  if (!listing) {
    return (
      <div className="flex flex-col items-center py-32 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Property Not Found</h1>
        <p className="mt-2 text-slate-500">This listing may have been removed or the URL is incorrect.</p>
        <Link href="/listings" className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700">
          &larr; Back to listings
        </Link>
      </div>
    );
  }

  const similar = mockListings.filter((l) => l.id !== listing.id && l.city === listing.city).slice(0, 3);

  const details = [
    { label: "Type", value: listing.propertyType },
    { label: "Status", value: listing.status },
    { label: "Year Built", value: listing.yearBuilt || "N/A" },
    { label: "Lot Size", value: listing.areaSqft ? `${formatArea(listing.areaSqft)} sqft` : "N/A" },
    ...(listing.bedrooms ? [{ label: "Bedrooms", value: listing.bedrooms }] : []),
    ...(listing.bathrooms ? [{ label: "Bathrooms", value: listing.bathrooms }] : []),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/listings" className="hover:text-emerald-600">Properties</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{listing.title}</span>
      </nav>

      {/* Photo Gallery */}
      <PhotoGallery photos={listing.photos} />

      {/* Two-column layout */}
      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* Main content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{listing.title}</h1>
              <p className="mt-1 flex items-center gap-1 text-slate-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {listing.address}, {listing.city}, {listing.state} {listing.zip}
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 capitalize">
              {listing.status === "active" ? "For Sale" : listing.status}
            </span>
          </div>

          {/* Quick stats */}
          <div className="mt-6 flex flex-wrap gap-4">
            {listing.bedrooms > 0 && (
              <div className="rounded-lg bg-slate-50 px-4 py-2 text-sm">
                <span className="font-semibold text-slate-900">{listing.bedrooms}</span>
                <span className="ml-1 text-slate-500">beds</span>
              </div>
            )}
            {listing.bathrooms > 0 && (
              <div className="rounded-lg bg-slate-50 px-4 py-2 text-sm">
                <span className="font-semibold text-slate-900">{listing.bathrooms}</span>
                <span className="ml-1 text-slate-500">baths</span>
              </div>
            )}
            {listing.areaSqft > 0 && (
              <div className="rounded-lg bg-slate-50 px-4 py-2 text-sm">
                <span className="font-semibold text-slate-900">{formatArea(listing.areaSqft)}</span>
                <span className="ml-1 text-slate-500">sqft</span>
              </div>
            )}
            {listing.yearBuilt > 0 && (
              <div className="rounded-lg bg-slate-50 px-4 py-2 text-sm">
                <span className="text-slate-500">Built</span>
                <span className="ml-1 font-semibold text-slate-900">{listing.yearBuilt}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Description</h2>
            <p className="mt-3 leading-relaxed text-slate-600">{listing.description}</p>
          </div>

          {/* Details Table */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Property Details</h2>
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
              {details.map((d) => (
                <div key={d.label}>
                  <dt className="text-slate-500">{d.label}</dt>
                  <dd className="mt-0.5 font-medium capitalize text-slate-900">{String(d.value)}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Amenities */}
          {listing.amenities.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">Features &amp; Amenities</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {listing.amenities.map((a) => (
                  <span key={a} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 capitalize">
                    {a.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Virtual Tour */}
          {listing.virtualTourUrl && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">Virtual Tour</h2>
              <div className="mt-3 flex aspect-video items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm">360&deg; Virtual Tour Available</p>
                  <p className="mt-1 text-xs text-slate-300">Click and drag to look around</p>
                </div>
              </div>
            </div>
          )}

          {/* Location Map placeholder */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Location</h2>
            <div className="mt-3 flex aspect-[2/1] items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="mt-2 text-sm">Google Maps integration</p>
                <p className="mt-1 text-xs text-slate-300">Requires GOOGLE_MAPS_API_KEY</p>
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          {similar.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">Similar Properties</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {similar.map((s) => (
                  <Link
                    key={s.id}
                    href={`/listings/${s.slug}`}
                    className="rounded-lg border border-slate-200 p-3 transition hover:shadow-md"
                  >
                    <div className="aspect-video rounded bg-slate-100" />
                    <p className="mt-2 text-sm font-semibold text-emerald-700">{formatPrice(s.priceCents)}</p>
                    <p className="truncate text-sm text-slate-600">{s.title}</p>
                    <p className="text-xs text-slate-400">
                      {s.bedrooms} bed{s.bedrooms !== 1 ? "s" : ""} &middot; {s.bathrooms} bath{s.bathrooms !== 1 ? "s" : ""}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Sidebar */}
        <div className="shrink-0 lg:w-80">
          <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-3xl font-bold text-emerald-700">{formatPrice(listing.priceCents)}</p>

            <button
              onClick={() => setShowContact(true)}
              className="mt-4 w-full rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Contact Agent
            </button>
            <button className="mt-2 w-full rounded-lg border border-slate-300 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Schedule a Tour
            </button>
            <button className="mt-2 w-full rounded-lg border border-slate-300 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Save Property
              </span>
            </button>

            {/* Agent Card */}
            <div className="mt-6 border-t border-slate-200 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{listing.agent.name}</p>
                  <p className="text-sm text-slate-500">{listing.agent.agencyName}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-sm">
                <svg className="h-4 w-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">{listing.agent.rating}</span>
                <span className="text-slate-400">({listing.agent.reviewCount} reviews)</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">{listing.agent.phone}</p>
            </div>

            {/* Mortgage Calculator */}
            <div className="mt-6 border-t border-slate-200 pt-6">
              <h3 className="text-sm font-semibold text-slate-900">Estimated Monthly Payment</h3>
              <p className="mt-1 text-2xl font-bold text-slate-700">
                {formatPrice(Math.round(listing.priceCents * 0.005))}
                <span className="text-sm font-normal text-slate-400">/mo</span>
              </p>
              <p className="mt-1 text-xs text-slate-400">Based on 20% down, 30yr fixed at 6.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-4 lg:hidden">
        <div className="flex gap-3">
          <button className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button className="flex-1 rounded-lg border border-slate-300 py-3 text-sm font-semibold text-slate-700">
            Tour
          </button>
          <button
            onClick={() => setShowContact(true)}
            className="flex-1 rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white"
          >
            Contact
          </button>
        </div>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <ContactFormModal
          agent={listing.agent}
          propertyAddress={`${listing.address}, ${listing.city}`}
          onClose={() => setShowContact(false)}
        />
      )}
    </div>
  );
}
