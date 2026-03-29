"use client";

import { useState } from "react";
import { type AgentProfile } from "@/lib/mock-data";

interface Props {
  agent: AgentProfile;
  propertyAddress: string;
  onClose: () => void;
}

export default function ContactFormModal({ agent, propertyAddress, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I am interested in this property and would like to schedule a viewing.`,
    contactTime: "anytime",
    agreed: false,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Contact Agent</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Agent banner */}
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{agent.name}</p>
            <p className="text-xs text-slate-500">{agent.agencyName}</p>
          </div>
        </div>

        {submitted ? (
          <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-center">
            <svg className="mx-auto h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2 font-medium text-emerald-800">Your message was sent!</p>
            <p className="mt-1 text-sm text-emerald-600">{agent.name} will respond within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <p className="text-xs text-slate-500">Re: {propertyAddress}</p>

            <div>
              <label className="block text-sm font-medium text-slate-700">Your Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Message *</label>
              <textarea
                required
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <fieldset>
              <legend className="text-sm font-medium text-slate-700">Best time to contact</legend>
              <div className="mt-1 flex flex-wrap gap-3">
                {["morning", "afternoon", "evening", "anytime"].map((time) => (
                  <label key={time} className="flex items-center gap-1.5 text-sm text-slate-600">
                    <input
                      type="radio"
                      name="contactTime"
                      value={time}
                      checked={formData.contactTime === time}
                      onChange={(e) => setFormData({ ...formData, contactTime: e.target.value })}
                      className="text-emerald-600"
                    />
                    <span className="capitalize">{time}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="flex items-start gap-2 text-xs text-slate-500">
              <input
                type="checkbox"
                required
                checked={formData.agreed}
                onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                className="mt-0.5 text-emerald-600"
              />
              I agree to the Terms of Service and Privacy Policy
            </label>
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Send Message
            </button>
            <p className="text-center text-xs text-slate-400">
              Or call directly: {agent.phone}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
