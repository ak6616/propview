export default function LeadsPage() {
  const leads = [
    { id: "1", name: "John Davidson", email: "john@example.com", property: "Modern Downtown Loft", message: "I am interested in this property and would like to schedule a viewing.", time: "2 hours ago", read: false },
    { id: "2", name: "Maria Santos", email: "maria@example.com", property: "Luxury Waterfront Estate", message: "What is the HOA fee for this property? Also interested in the virtual tour.", time: "5 hours ago", read: false },
    { id: "3", name: "Alex Kim", email: "alex@example.com", property: "Charming Craftsman Bungalow", message: "Is the property still available? I'd love to schedule a tour this weekend.", time: "1 day ago", read: true },
    { id: "4", name: "Sarah Thompson", email: "sarah@example.com", property: "Spacious Family Home", message: "We are relocating to the area and this looks perfect for our family. Can we arrange a visit?", time: "2 days ago", read: true },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">Lead Inbox</h1>
      <p className="mt-1 text-sm text-slate-500">{leads.filter((l) => !l.read).length} unread inquiries</p>

      <div className="mt-6 space-y-3">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className={`rounded-xl border p-5 transition hover:shadow-md ${
              lead.read ? "border-slate-200 bg-white" : "border-emerald-200 bg-emerald-50"
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                {!lead.read && <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />}
                <div>
                  <p className="font-semibold text-slate-900">{lead.name}</p>
                  <p className="text-sm text-slate-500">{lead.email}</p>
                  <p className="mt-1 text-xs text-emerald-600">Re: {lead.property}</p>
                  <p className="mt-2 text-sm text-slate-600">{lead.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:shrink-0">
                <span className="text-xs text-slate-400">{lead.time}</span>
                <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                  Reply
                </button>
                {!lead.read && (
                  <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
