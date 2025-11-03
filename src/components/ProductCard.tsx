'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Eye, Phone } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  city: string;
  state: string;
  views?: number;
  // Support both user and seller fields
  user?: {
    id?: string;
    name?: string;
    phone: string;
    city?: string;
    state?: string;
  };
  seller?: {
    id?: string;
    name?: string;
    phone: string;
    email?: string;
    city?: string;
    state?: string;
  };
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Get phone from either seller or user field
  const phoneNumber = product.seller?.phone || product.user?.phone;
  const sellerName = product.seller?.name || product.user?.name;

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
        {/* Product Image */}
        <div className="relative h-48 sm:h-60 bg-gray-200">
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4">
          <h3 className="font-semibold text-sm sm:text-lg line-clamp-2 hover:text-[#E06B2D]">
            {product.title}
          </h3>

          <p className="text-lg sm:text-2xl font-bold text-[#E06B2D]">
            ₹{product.price.toLocaleString('en-IN')}
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span className="line-clamp-1">{product.city}, {product.state}</span>
              </div>
              
              {/* {product.views !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  <span>{product.views}</span>
                </div>
              )} */}
            </div>

            {/* Phone Number - Now handles both user and seller */}
            {phoneNumber && (
              <div className="flex items-center gap-1 text-sm text-gray-700">
                <Phone size={16} />
                <span>{phoneNumber}</span>
              </div>
            )}

            {/* Optional: Show seller name if available */}
            {/* {sellerName && (
              <div className="text-sm text-gray-600">
                by {sellerName}
              </div>
            )} */}
          </div>
        </div>
      </div>
    </Link>
  );
}