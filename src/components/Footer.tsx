import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="text-lg font-bold text-white">
              PropView
            </Link>
            <p className="mt-3 text-sm text-slate-400">
              Find your dream property with confidence. Verified listings, trusted agents, and powerful search tools.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Browse</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/listings" className="hover:text-white">All Listings</Link></li>
              <li><Link href="/listings?type=house" className="hover:text-white">Houses</Link></li>
              <li><Link href="/listings?type=apartment" className="hover:text-white">Apartments</Link></li>
              <li><Link href="/listings?type=condo" className="hover:text-white">Condos</Link></li>
              <li><Link href="/map" className="hover:text-white">Map View</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">For Agents</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/register" className="hover:text-white">Create Account</Link></li>
              <li><Link href="/portal" className="hover:text-white">Agent Portal</Link></li>
              <li><Link href="/portal/listings/new" className="hover:text-white">List a Property</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Company</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white">About Us</Link></li>
              <li><Link href="#" className="hover:text-white">Contact</Link></li>
              <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-700 pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} PropView. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
