"use client";

import { useState } from "react";

interface Photo {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const primary = photos.find((p) => p.isPrimary) ?? photos[0];
  const rest = photos.filter((p) => p !== primary).slice(0, 4);

  return (
    <>
      {/* Grid layout */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:grid-rows-2">
        {/* Main image */}
        <button
          onClick={() => setLightboxIndex(0)}
          className="relative col-span-1 row-span-2 aspect-[4/3] overflow-hidden rounded-l-xl bg-slate-100 md:col-span-2"
        >
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="rounded-md bg-black/60 px-3 py-1.5 text-xs font-medium text-white">
              View All {photos.length} Photos
            </span>
          </div>
        </button>

        {/* Thumbnails */}
        {rest.map((photo, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(photos.indexOf(photo))}
            className={`aspect-[4/3] overflow-hidden bg-slate-100 ${
              i === 1 ? "rounded-tr-xl" : i === 3 ? "rounded-br-xl" : ""
            }`}
          >
            <div className="flex h-full w-full items-center justify-center text-slate-200">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 text-white hover:text-slate-300"
            aria-label="Close"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={() => setLightboxIndex(Math.max(0, lightboxIndex - 1))}
            className="absolute left-4 text-white hover:text-slate-300 disabled:opacity-30"
            disabled={lightboxIndex === 0}
            aria-label="Previous"
          >
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="mx-16 flex max-h-[80vh] max-w-4xl flex-col items-center">
            <div className="flex h-96 w-full items-center justify-center rounded-lg bg-slate-800 text-slate-400">
              <div className="text-center">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm">{photos[lightboxIndex]?.alt}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              {lightboxIndex + 1} / {photos.length}
            </p>
          </div>

          <button
            onClick={() => setLightboxIndex(Math.min(photos.length - 1, lightboxIndex + 1))}
            className="absolute right-4 text-white hover:text-slate-300 disabled:opacity-30"
            disabled={lightboxIndex === photos.length - 1}
            aria-label="Next"
          >
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
