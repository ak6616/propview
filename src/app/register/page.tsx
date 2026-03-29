"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<"buyer" | "agent">("buyer");
  const [password, setPassword] = useState("");

  const strengthScore = (() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthColors = ["bg-slate-200", "bg-red-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-600"];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-emerald-700">PropView</Link>
          <h1 className="mt-4 text-xl font-semibold text-slate-900">Create your account</h1>
        </div>

        {/* Account type toggle */}
        <div className="mt-6 flex rounded-lg bg-slate-100 p-1">
          <button
            onClick={() => setAccountType("buyer")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              accountType === "buyer" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            Buyer / Renter
          </button>
          <button
            onClick={() => setAccountType("agent")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              accountType === "agent" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            Agent / Broker
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
            <input id="name" type="text" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700">Email</label>
            <input id="reg-email" type="email" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700">Password</label>
            <input
              id="reg-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
            {password && (
              <div className="mt-2 flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full ${i < strengthScore ? strengthColors[strengthScore] : "bg-slate-200"}`}
                  />
                ))}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">Confirm Password</label>
            <input id="confirm-password" type="password" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
          </div>

          {accountType === "agent" && (
            <>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone</label>
                <input id="phone" type="tel" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label htmlFor="agency" className="block text-sm font-medium text-slate-700">Agency Name</label>
                <input id="agency" type="text" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
              </div>
            </>
          )}

          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input type="checkbox" required className="mt-0.5 text-emerald-600" />
            I agree to the Terms of Service and Privacy Policy
          </label>
          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input type="checkbox" className="mt-0.5 text-emerald-600" />
            Send me property alerts and newsletters
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
