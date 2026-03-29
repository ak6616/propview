"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-emerald-700">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
          </svg>
          PropView
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/listings" className="text-sm font-medium text-slate-600 hover:text-emerald-700">
            Buy
          </Link>
          <Link href="/listings?status=rent" className="text-sm font-medium text-slate-600 hover:text-emerald-700">
            Rent
          </Link>
          <Link href="/map" className="text-sm font-medium text-slate-600 hover:text-emerald-700">
            Map
          </Link>
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-emerald-700">
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/listings" className="text-sm font-medium text-slate-600 hover:text-emerald-700" onClick={() => setMobileOpen(false)}>
              Buy
            </Link>
            <Link href="/listings?status=rent" className="text-sm font-medium text-slate-600 hover:text-emerald-700" onClick={() => setMobileOpen(false)}>
              Rent
            </Link>
            <Link href="/map" className="text-sm font-medium text-slate-600 hover:text-emerald-700" onClick={() => setMobileOpen(false)}>
              Map
            </Link>
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-emerald-700" onClick={() => setMobileOpen(false)}>
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-emerald-700"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
