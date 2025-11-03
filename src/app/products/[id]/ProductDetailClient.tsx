'use client';

// src/app/products/[id]/ProductDetailClient.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ImageGallery from '@/components/ImageGallery';
import {
  Loader2,
  MapPin,
  Phone,
  User,
  Calendar,
  Tag,
  Share2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  status: string;
  views: number;
  phoneClicks: number;
  city: string;
  state: string;
  pincode: string;
  createdAt: string;
  user: {
    id: string; // This comes from database as string
    name: string;
    phone: string;
    city: string;
    state: string;
  };
  category: {
    id: string;
    name: string;
  };
}

export default function ProductDetailClient({ productId }: { productId: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [showPhone, setShowPhone] = useState(true);

  useEffect(() => {
    fetchProduct();
    trackView();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products/${productId}/details`);
      const data = await res.json();

      if (res.ok) {
        setProduct(data.product);
      } else {
        toast.error('Product not found');
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    try {
      await fetch(`/api/products/${productId}/view`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const handleCallSeller = async () => {
    setShowPhone(true);

    try {
      await fetch(`/api/products/${productId}/phone-click`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error tracking phone click:', error);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: `Check out this product: ${product?.title}`,
          url: url,
        });
      } catch (error) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Compare IDs: user.id is number, product.user.id is string
  const isOwnProduct = user && String(user.id) === product.user.id;
  const isSold = product.status === 'SOLD';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-800 mb-4"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Sold Banner */}
      {isSold && (
        <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg">
          <div className="flex items-center gap-2 text-gray-700">
            <AlertCircle size={20} />
            <span className="font-medium">This product has been sold</span>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {/* Left - Images */}
        <div>
          <ImageGallery images={product.images} title={product.title} />
        </div>

        {/* Right - Details */}
        <div className="space-y-6">
          {/* Title & Price */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {product.title}
            </h1>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-bold text-blue-600">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Category & Location */}
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
              <Tag size={16} />
              <span>{product.category.name}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
              <MapPin size={16} />
              <span>{product.city}, {product.state}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Seller Info */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-3">Seller Information</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <User size={18} />
                <span>{product.user.name}</span>
              </div>

              {/* Phone Number - Always visible and clickable */}
              <a 
                href={`tel:${product.user.phone}`}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
              >
                <Phone size={18} />
                <span className="font-medium">{product.user.phone}</span>
              </a>

              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={18} />
                <span>{product.user.city}, {product.user.state}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar size={16} />
                <span>Listed on {new Date(product.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            {isOwnProduct ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-center font-medium mb-3">
                  This is your product. Manage it from your dashboard.
                </p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full cursor-pointer py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <>
                {!showPhone ? (
                  <button
                    onClick={handleCallSeller}
                    disabled={isSold}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-lg transition-colors"
                  >
                    <Phone size={20} />
                    Show Phone Number
                  </button>
                ) : (
                  <a
                    href={`tel:${product.user.phone}`}
                    className="block w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center font-medium text-lg transition-colors"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Phone size={20} />
                      <span>Call Seller</span>
                    </div>
                  </a>
                )}

                <button
                  onClick={handleShare}
                  className="w-full py-3 border border-gray-400 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2 font-medium transition-colors"
                >
                  <Share2 size={20} />
                  Share Product
                </button>
              </>
            )}
          </div>

          {/* Safety Warning */}
          {!isOwnProduct && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              <strong>Safety Tips:</strong> Meet in public places. Never send money in advance. 
              Inspect the product before payment.
            </div>
          )}
        </div>
      </div>

      {/* Additional Details */}
      <div className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg mb-3">Product Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium">{product.category.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">{product.city}, {product.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pincode:</span>
              <span className="font-medium">{product.pincode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${isSold ? 'text-gray-600' : 'text-green-600'}`}>
                {product.status}
              </span>
            </div>
          </div>
        </div>

        {/* <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg mb-3">Ad Statistics</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Views:</span>
              <span className="font-medium">{product.views}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone Clicks:</span>
              <span className="font-medium">{product.phoneClicks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Posted By:</span>
              <span className="font-medium">{product.user.name}</span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}