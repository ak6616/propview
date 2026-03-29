"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const AMENITY_OPTIONS = ["Pool", "Garage", "Air Conditioning", "Garden", "Elevator", "Gym", "Parking", "Balcony", "Rooftop", "EV Charging", "Waterfront", "Wine Cellar"];

function amenityKey(label: string) {
  return label.toLowerCase().replace(/ /g, "_");
}

export default function NewListingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    propertyType: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    areaSqft: "",
    yearBuilt: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    virtualTourUrl: "",
    amenities: [] as string[],
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleAmenity(amenity: string) {
    const key = amenityKey(amenity);
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(key)
        ? prev.amenities.filter((a) => a !== key)
        : [...prev.amenities, key],
    }));
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setPhotos((prev) => [...prev, ...files]);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  }

  function removePhoto(index: number) {
    URL.revokeObjectURL(previews[index]);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to create a listing");
      setLoading(false);
      return;
    }

    try {
      const body = {
        title: form.title,
        description: form.description,
        propertyType: form.propertyType,
        priceCents: Math.round(parseFloat(form.price) * 100),
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
        ...(form.bedrooms ? { bedrooms: parseInt(form.bedrooms) } : {}),
        ...(form.bathrooms ? { bathrooms: parseFloat(form.bathrooms) } : {}),
        ...(form.areaSqft ? { areaSqft: parseInt(form.areaSqft) } : {}),
        ...(form.yearBuilt ? { yearBuilt: parseInt(form.yearBuilt) } : {}),
        ...(form.virtualTourUrl ? { virtualTourUrl: form.virtualTourUrl } : {}),
        ...(form.amenities.length > 0 ? { amenities: form.amenities } : {}),
      };

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create listing");
        return;
      }

      const listingId = data.data.id;

      // Upload photos
      for (let i = 0; i < photos.length; i++) {
        const fd = new FormData();
        fd.append("file", photos[i]);
        fd.append("listingId", listingId);
        fd.append("isPrimary", i === 0 ? "true" : "false");
        fd.append("altText", photos[i].name);

        await fetch("/api/uploads/photo", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
      }

      router.push("/portal/listings");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">Create New Listing</h1>
      <p className="mt-1 text-sm text-slate-500">Fill in the details below to list a new property.</p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* Basic Info */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Property Title</label>
              <input type="text" required placeholder="e.g., Modern Downtown Loft with City Views" value={form.title} onChange={(e) => updateField("title", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea rows={4} required value={form.description} onChange={(e) => updateField("description", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Property Type</label>
              <select required value={form.propertyType} onChange={(e) => updateField("propertyType", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none">
                <option value="">Select type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Price ($)</label>
              <input type="number" required min={0} value={form.price} onChange={(e) => updateField("price", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Bedrooms</label>
              <input type="number" min={0} value={form.bedrooms} onChange={(e) => updateField("bedrooms", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Bathrooms</label>
              <input type="number" min={0} step={0.5} value={form.bathrooms} onChange={(e) => updateField("bathrooms", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Area (sqft)</label>
              <input type="number" min={0} value={form.areaSqft} onChange={(e) => updateField("areaSqft", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Year Built</label>
              <input type="number" min={1800} max={2030} value={form.yearBuilt} onChange={(e) => updateField("yearBuilt", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Location</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Street Address</label>
              <input type="text" required value={form.address} onChange={(e) => updateField("address", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">City</label>
              <input type="text" required value={form.city} onChange={(e) => updateField("city", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">State</label>
              <input type="text" required value={form.state} onChange={(e) => updateField("state", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">ZIP Code</label>
              <input type="text" required value={form.zip} onChange={(e) => updateField("zip", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
          </div>
        </section>

        {/* Photos */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Photos</h2>
          <div className="mt-4">
            {previews.length > 0 && (
              <div className="mb-4 grid grid-cols-3 gap-3">
                {previews.map((url, i) => (
                  <div key={i} className="group relative aspect-video rounded-lg bg-slate-100 overflow-hidden">
                    <img src={url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                    {i === 0 && (
                      <span className="absolute left-1 top-1 rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-medium text-white">Primary</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute right-1 top-1 rounded-full bg-red-600 p-0.5 text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-slate-300 py-12 transition hover:border-emerald-400"
            >
              <div className="text-center">
                <svg className="mx-auto h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm text-slate-600">Click to browse for photos</p>
                <p className="mt-1 text-xs text-slate-400">JPEG, PNG, WebP up to 10MB</p>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        </section>

        {/* Virtual Tour */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Virtual Tour (Optional)</h2>
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700">Virtual Tour URL</label>
            <input type="url" placeholder="https://my.matterport.com/show/?m=..." value={form.virtualTourUrl} onChange={(e) => updateField("virtualTourUrl", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            <p className="mt-1 text-xs text-slate-400">Supports Matterport and YouTube 360 URLs</p>
          </div>
        </section>

        {/* Amenities */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Amenities</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {AMENITY_OPTIONS.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="text-emerald-600"
                  checked={form.amenities.includes(amenityKey(amenity))}
                  onChange={() => toggleAmenity(amenity)}
                />
                {amenity}
              </label>
            ))}
          </div>
        </section>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish Listing"}
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );
}
