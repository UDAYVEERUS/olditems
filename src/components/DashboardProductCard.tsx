'use client';

// src/components/DashboardProductCard.tsx
// Product card for seller dashboard with actions

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, Phone, MoreVertical, CheckCircle, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  status: string;
  views: number;
  phoneClicks: number;
  city: string;
  state: string;
  createdAt: string;
  category: {
    name: string;
  };
}

interface Props {
  product: Product;
  onUpdate: () => void;
}

export default function DashboardProductCard({ product, onUpdate }: Props) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMarkAsSold = async () => {
    if (!confirm('Mark this product as sold?')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'SOLD' }),
      });

      if (res.ok) {
        toast.success('Product marked as sold');
        onUpdate();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  const handleMarkAsActive = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACTIVE' }),
      });

      if (res.ok) {
        toast.success('Product marked as active');
        onUpdate();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Product deleted');
        onUpdate();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700';
      case 'SOLD': return 'bg-gray-100 text-gray-700';
      case 'HIDDEN': return 'bg-yellow-100 text-yellow-700';
      case 'ARCHIVED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(product.status)}`}>
          {product.status}
        </div>

        {/* Menu Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
            disabled={loading}
          >
            <MoreVertical size={18} />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border z-10">
              {product.status === 'ACTIVE' && (
                <button
                  onClick={handleMarkAsSold}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  <CheckCircle size={16} />
                  Mark as Sold
                </button>
              )}
              
              {product.status === 'SOLD' && (
                <button
                  onClick={handleMarkAsActive}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  <CheckCircle size={16} />
                  Mark as Active
                </button>
              )}

              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {product.title}
        </h3>

        <p className="text-2xl font-bold text-blue-600 mb-2">
          ₹{product.price.toLocaleString('en-IN')}
        </p>

        <p className="text-sm text-gray-600 mb-3">
          {product.category.name} • {product.city}, {product.state}
        </p>

        {/* Analytics */}
        <div className="flex items-center gap-4 text-sm text-gray-600 pt-3 border-t">
          <div className="flex items-center gap-1">
            <Eye size={16} />
            <span>{product.views} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone size={16} />
            <span>{product.phoneClicks} calls</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Listed {new Date(product.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}