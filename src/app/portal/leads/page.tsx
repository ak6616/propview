"use client";

import { useEffect, useState } from "react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
  listing: { id: string; title: string; slug: string };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/portal/leads", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (res.ok && json.data) {
          setLeads(json.data.leads);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  async function markRead(leadId: string) {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/portal/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isRead: true }),
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, isRead: true } : l));
      }
    } catch {
      // silently fail
    }
  }

  const unreadCount = leads.filter((l) => !l.isRead).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">Lead Inbox</h1>
      <p className="mt-1 text-sm text-slate-500">
        {loading ? "Loading..." : `${unreadCount} unread inquiries`}
      </p>

      {loading ? (
        <div className="mt-12 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
        </div>
      ) : leads.length === 0 ? (
        <div className="mt-12 text-center text-sm text-slate-500">
          <p>No leads yet. Inquiries from potential buyers will appear here.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className={`rounded-xl border p-5 transition hover:shadow-md ${
                lead.isRead ? "border-slate-200 bg-white" : "border-emerald-200 bg-emerald-50"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  {!lead.isRead && <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />}
                  <div>
                    <p className="font-semibold text-slate-900">{lead.name}</p>
                    <p className="text-sm text-slate-500">{lead.email}</p>
                    <p className="mt-1 text-xs text-emerald-600">Re: {lead.listing.title}</p>
                    <p className="mt-2 text-sm text-slate-600">{lead.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:shrink-0">
                  <span className="text-xs text-slate-400">{timeAgo(lead.createdAt)}</span>
                  <a
                    href={`mailto:${lead.email}`}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                  >
                    Reply
                  </a>
                  {!lead.isRead && (
                    <button
                      onClick={() => markRead(lead.id)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
