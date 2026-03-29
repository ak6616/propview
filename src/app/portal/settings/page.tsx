"use client";

export default function PortalSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>

      <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Profile */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <button type="button" className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Change Photo
            </button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <input type="text" defaultValue="Sarah Johnson" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input type="email" defaultValue="sarah@realty.com" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Phone</label>
              <input type="tel" defaultValue="+1 (555) 123-4567" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Agency Name</label>
              <input type="text" defaultValue="Premier Realty Group" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Bio</label>
              <textarea rows={3} defaultValue="Specializing in luxury residential properties with over 15 years of experience." className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: "New inquiry notifications", description: "Get notified when someone contacts you about a listing" },
              { label: "Listing view alerts", description: "Weekly summary of listing performance" },
              { label: "Marketing emails", description: "Tips and updates from PropView" },
            ].map((pref) => (
              <label key={pref.label} className="flex items-start gap-3">
                <input type="checkbox" defaultChecked className="mt-1 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-slate-700">{pref.label}</p>
                  <p className="text-xs text-slate-500">{pref.description}</p>
                </div>
              </label>
            ))}
          </div>
        </section>

        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
