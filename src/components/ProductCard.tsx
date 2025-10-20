'use client';

// src/components/ProductCard.tsx
// Product card with link to detail page

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Eye } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  city: string;
  state: string;
  views?: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
        {/* Product Image */}
        <div className="relative h-48 bg-gray-200">
          {product.images[0] ? (
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
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600">
            {product.title}
          </h3>

          <p className="text-2xl font-bold text-blue-600 mb-2">
            ₹{product.price.toLocaleString('en-IN')}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span className="line-clamp-1">{product.city}, {product.state}</span>
            </div>
            
            {product.views !== undefined && (
              <div className="flex items-center gap-1">
                <Eye size={16} />
                <span>{product.views}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}