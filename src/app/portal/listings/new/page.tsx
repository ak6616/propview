"use client";

import { useState } from "react";

export default function NewListingPage() {
  const [photos, setPhotos] = useState<string[]>([]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">Create New Listing</h1>
      <p className="mt-1 text-sm text-slate-500">Fill in the details below to list a new property.</p>

      <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Basic Info */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Property Title</label>
              <input type="text" required placeholder="e.g., Modern Downtown Loft with City Views" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea rows={4} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Property Type</label>
              <select required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none">
                <option value="">Select type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Price ($)</label>
              <input type="number" required min={0} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Bedrooms</label>
              <input type="number" min={0} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Bathrooms</label>
              <input type="number" min={0} step={0.5} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Area (sqft)</label>
              <input type="number" min={0} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Year Built</label>
              <input type="number" min={1800} max={2030} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Location</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Street Address</label>
              <input type="text" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">City</label>
              <input type="text" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">State</label>
              <input type="text" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">ZIP Code</label>
              <input type="text" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
          </div>
        </section>

        {/* Photos */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Photos</h2>
          <div className="mt-4">
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 py-12">
              <div className="text-center">
                <svg className="mx-auto h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm text-slate-600">Drag and drop photos here, or click to browse</p>
                <p className="mt-1 text-xs text-slate-400">JPEG, PNG, WebP up to 10MB</p>
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" />
              </div>
            </div>
          </div>
        </section>

        {/* Virtual Tour */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Virtual Tour (Optional)</h2>
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700">Virtual Tour URL</label>
            <input type="url" placeholder="https://my.matterport.com/show/?m=..." className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            <p className="mt-1 text-xs text-slate-400">Supports Matterport and YouTube 360 URLs</p>
          </div>
        </section>

        {/* Amenities */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Amenities</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {["Pool", "Garage", "Air Conditioning", "Garden", "Elevator", "Gym", "Parking", "Balcony", "Rooftop", "EV Charging", "Waterfront", "Wine Cellar"].map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" className="text-emerald-600" />
                {amenity}
              </label>
            ))}
          </div>
        </section>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Publish Listing
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );
}
