import Link from "next/link";

const dashboardCards = [
  { label: "Active Listings", value: "12", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", href: "/portal/listings" },
  { label: "New Leads", value: "5", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", href: "/portal/leads" },
  { label: "Page Views (30d)", value: "2,450", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z", href: "#" },
  { label: "Avg. Response Time", value: "2.4h", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", href: "#" },
];

export default function PortalDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agent Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Welcome back! Here&apos;s your overview.</p>
        </div>
        <Link
          href="/portal/listings/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + New Listing
        </Link>
      </div>

      {/* Stats cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                <p className="text-sm text-slate-500">{card.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
        <div className="mt-4 space-y-4">
          {[
            { action: "New inquiry", detail: "John D. asked about Modern Downtown Loft", time: "2 hours ago" },
            { action: "Listing viewed", detail: "Luxury Waterfront Estate was viewed 15 times", time: "5 hours ago" },
            { action: "Lead replied", detail: "You responded to Maria S.", time: "1 day ago" },
            { action: "Listing created", detail: "Penthouse Condo with 360 Views published", time: "2 days ago" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
              <div>
                <p className="font-medium text-slate-800">{item.action}</p>
                <p className="text-slate-500">{item.detail}</p>
              </div>
              <span className="ml-auto shrink-0 text-xs text-slate-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
