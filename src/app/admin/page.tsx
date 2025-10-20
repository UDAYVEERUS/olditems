'use client';

// src/app/admin/page.tsx
// Admin dashboard - mobile-friendly

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import {
  Loader2,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Eye,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Stats {
  totalUsers: number;
  activeSubscribers: number;
  totalProducts: number;
  activeProducts: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  subscriptionStatus: string;
  subscriptionEndDate?: string;
  createdAt: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  status: string;
  views: number;
  phoneClicks: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  category: {
    name: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'products'>('stats');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch stats
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.status === 403) {
        toast.error('Admin access required');
        router.push('/');
        return;
      }
      const statsData = await statsRes.json();
      setStats(statsData.stats);

      // Fetch users
      const usersRes = await fetch('/api/admin/users');
      const usersData = await usersRes.json();
      setUsers(usersData.users || []);

      // Fetch products
      const productsRes = await fetch('/api/admin/products');
      const productsData = await productsRes.json();
      setProducts(productsData.products || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700';
      case 'INACTIVE': return 'bg-gray-100 text-gray-700';
      case 'PAST_DUE': return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="text-blue-600" size={32} />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, products, and view statistics</p>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Users size={18} />
              <span className="text-sm">Total Users</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <TrendingUp size={18} />
              <span className="text-sm">Subscribers</span>
            </div>
            <p className="text-2xl font-bold">{stats.activeSubscribers}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Package size={18} />
              <span className="text-sm">Total Products</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <Package size={18} />
              <span className="text-sm">Active Products</span>
            </div>
            <p className="text-2xl font-bold">{stats.activeProducts}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-2 text-yellow-600 mb-1">
              <DollarSign size={18} />
              <span className="text-sm">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold">₹{stats.totalRevenue}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-2 text-orange-600 mb-1">
              <DollarSign size={18} />
              <span className="text-sm">This Month</span>
            </div>
            <p className="text-2xl font-bold">₹{stats.monthlyRevenue}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
            activeTab === 'stats'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Products ({products.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Platform Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Conversion Rate (Users → Subscribers):</span>
              <span className="font-bold">
                {stats && stats.totalUsers > 0
                  ? ((stats.activeSubscribers / stats.totalUsers) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Revenue per User:</span>
              <span className="font-bold">
                ₹{stats && stats.totalUsers > 0
                  ? (stats.totalRevenue / stats.totalUsers).toFixed(2)
                  : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Products per Active User:</span>
              <span className="font-bold">
                {stats && stats.activeSubscribers > 0
                  ? (stats.totalProducts / stats.activeSubscribers).toFixed(1)
                  : 0}
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Subscription</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{user.name}</td>
                    <td className="px-4 py-3 text-sm">{user.email}</td>
                    <td className="px-4 py-3 text-sm">{user.phone}</td>
                    <td className="px-4 py-3 text-sm">{user.city}, {user.state}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(user.subscriptionStatus)}`}>
                        {user.subscriptionStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
                <span className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                  product.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {product.status}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold line-clamp-2 mb-2">{product.title}</h3>
                <p className="text-lg font-bold text-blue-600 mb-2">₹{product.price.toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-600 mb-2">{product.category.name}</p>
                <p className="text-xs text-gray-500 mb-2">By: {product.user.name}</p>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span>{product.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone size={14} />
                    <span>{product.phoneClicks}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}