import Link from 'next/link';
import { Package, Home, Search } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <Package size={48} className="text-gray-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Product Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          This product may have been sold or removed by the seller.
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

          <Link
            href="/products"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Search size={20} />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}