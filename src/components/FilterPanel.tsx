"use client";

import { useState } from "react";

export interface Filters {
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  beds: string;
  baths: string;
  query: string;
}

const defaultFilters: Filters = {
  propertyType: "",
  minPrice: "",
  maxPrice: "",
  beds: "",
  baths: "",
  query: "",
};

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  className?: string;
}

export default function FilterPanel({ filters, onChange, className }: Props) {
  const [open, setOpen] = useState(false);

  const propertyTypes = [
    { value: "", label: "All Types" },
    { value: "house", label: "House" },
    { value: "apartment", label: "Apartment" },
    { value: "condo", label: "Condo" },
    { value: "townhouse", label: "Townhouse" },
    { value: "land", label: "Land" },
  ];

  const bedOptions = ["", "1", "2", "3", "4", "5"];
  const bathOptions = ["", "1", "2", "3", "4"];

  function clearAll() {
    onChange(defaultFilters);
  }

  return (
    <div className={className}>
      {/* Mobile toggle */}
      <button
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 lg:hidden"
        onClick={() => setOpen(!open)}
      >
        <span>Filters</span>
        <svg className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`mt-3 space-y-5 lg:mt-0 lg:block ${open ? "block" : "hidden"}`}>
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Search</label>
          <input
            type="text"
            placeholder="City, address, keyword..."
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Property Type</label>
          <div className="mt-2 space-y-1">
            {propertyTypes.map((t) => (
              <label key={t.value} className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="radio"
                  name="propertyType"
                  value={t.value}
                  checked={filters.propertyType === t.value}
                  onChange={() => onChange({ ...filters, propertyType: t.value })}
                  className="text-emerald-600"
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Price Range</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
            <span className="text-slate-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Bedrooms</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {bedOptions.map((b) => (
              <button
                key={b}
                onClick={() => onChange({ ...filters, beds: b })}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  filters.beds === b
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {b === "" ? "Any" : b === "5" ? "5+" : b}
              </button>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Bathrooms</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {bathOptions.map((b) => (
              <button
                key={b}
                onClick={() => onChange({ ...filters, baths: b })}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  filters.baths === b
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {b === "" ? "Any" : b === "4" ? "4+" : b}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={clearAll}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

export { defaultFilters };
