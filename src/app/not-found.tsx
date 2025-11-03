'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#E06B2D] text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home size={20} />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center cursor-pointer justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}