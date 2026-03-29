import Link from "next/link";
import { mockListings, formatPrice } from "@/lib/mock-data";

export default function PortalListingsPage() {
  const agentListings = mockListings.slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My Listings</h1>
        <Link
          href="/portal/listings/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + New Listing
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-600">Property</th>
              <th className="px-4 py-3 font-medium text-slate-600">Price</th>
              <th className="hidden px-4 py-3 font-medium text-slate-600 sm:table-cell">Status</th>
              <th className="hidden px-4 py-3 font-medium text-slate-600 md:table-cell">Views</th>
              <th className="hidden px-4 py-3 font-medium text-slate-600 md:table-cell">Leads</th>
              <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {agentListings.map((listing) => (
              <tr key={listing.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-100" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{listing.title}</p>
                      <p className="truncate text-xs text-slate-500">{listing.address}, {listing.city}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">{formatPrice(listing.priceCents)}</td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    listing.status === "active" ? "bg-emerald-50 text-emerald-700" :
                    listing.status === "pending" ? "bg-amber-50 text-amber-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {listing.status}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-slate-500 md:table-cell">{Math.floor(Math.random() * 500)}</td>
                <td className="hidden px-4 py-3 text-slate-500 md:table-cell">{Math.floor(Math.random() * 10)}</td>
                <td className="px-4 py-3">
                  <Link href={`/listings/${listing.slug}`} className="text-emerald-600 hover:text-emerald-700">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
