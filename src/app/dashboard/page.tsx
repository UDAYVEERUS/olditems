'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DashboardProductCard from '@/components/DashboardProductCard';
import { 
  Loader2, 
  Plus, 
  Package, 
  TrendingUp, 
  Eye, 
  Phone,
  AlertCircle,
  CreditCard
} from 'lucide-react';
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

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'sold'>('all');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchProducts();
    fetchSubscriptionInfo();
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products/my-products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionInfo = async () => {
    try {
      const res = await fetch('/api/subscription/check');
      const data = await res.json();
      setSubscriptionInfo(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? Your products will be hidden.')) {
      return;
    }

    try {
      const res = await fetch('/api/subscription/cancel', {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Subscription cancelled');
        fetchSubscriptionInfo();
        fetchProducts();
      } else {
        toast.error(data.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  if (!user) {
    return null;
  }

  // Filter products by tab
  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return p.status === 'ACTIVE';
    if (activeTab === 'sold') return p.status === 'SOLD';
    return true;
  });

  // Calculate stats
  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === 'ACTIVE').length,
    sold: products.filter((p) => p.status === 'SOLD').length,
    totalViews: products.reduce((sum, p) => sum + p.views, 0),
    totalCalls: products.reduce((sum, p) => sum + p.phoneClicks, 0),
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your listings and subscription</p>
        </div>
        <button
          onClick={() => router.push('/products/new')}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          List Product
        </button>
      </div>

      {/* Subscription Status Card */}
      {subscriptionInfo && (
        <div className={`mb-6 p-4 rounded-lg ${
          subscriptionInfo.hasActiveSubscription 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 flex-1">
              <AlertCircle size={20} className={
                subscriptionInfo.hasActiveSubscription ? 'text-green-600' : 'text-yellow-600'
              } />
              <div className="flex-1">
                {subscriptionInfo.hasActiveSubscription ? (
                  <>
                    <p className="font-medium text-green-700">Active Subscription</p>
                    {subscriptionInfo.subscriptionEndDate && (
                      <p className="text-sm text-green-600 mt-1">
                        Valid until: {new Date(subscriptionInfo.subscriptionEndDate).toLocaleDateString()}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="font-medium text-yellow-700">No Active Subscription</p>
                    <p className="text-sm text-yellow-600 mt-1">
                      Subscribe to start listing products
                    </p>
                  </>
                )}
              </div>
            </div>
            
            {subscriptionInfo.hasActiveSubscription ? (
              <button
                onClick={handleCancelSubscription}
                className="text-sm text-red-600 hover:text-red-700 font-medium whitespace-nowrap"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={() => router.push('/subscription')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium whitespace-nowrap"
              >
                Subscribe
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Package size={18} />
            <span className="text-sm">Total</span>
          </div>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <TrendingUp size={18} />
            <span className="text-sm">Active</span>
          </div>
          <p className="text-2xl font-bold">{stats.active}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Package size={18} />
            <span className="text-sm">Sold</span>
          </div>
          <p className="text-2xl font-bold">{stats.sold}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Eye size={18} />
            <span className="text-sm">Views</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalViews}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <Phone size={18} />
            <span className="text-sm">Calls</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalCalls}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
            activeTab === 'active'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Active ({stats.active})
        </button>
        <button
          onClick={() => setActiveTab('sold')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
            activeTab === 'sold'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Sold ({stats.sold})
        </button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            {activeTab === 'all' 
              ? 'Start listing your products to see them here'
              : `No ${activeTab} products`}
          </p>
          <button
            onClick={() => router.push('/products/new')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
          >
            <Plus size={20} />
            List Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <DashboardProductCard
              key={product.id}
              product={product}
              onUpdate={fetchProducts}
            />
          ))}
        </div>
      )}
    </div>
  );
}