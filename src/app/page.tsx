'use client';

// src/app/page.tsx
import { useEffect, useState } from 'react';
import { useSearch } from '@/context/SearchContext';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Seller {
  id?: string;
  name?: string;
  phone: string;
  email?: string;
  city?: string;
  state?: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  city: string;
  state: string;
  views?: number;
  seller?: Seller;
  user?: Seller;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export default function HomePage() {
  const { searchQuery, selectedCategory } = useSearch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1); // Reset to page 1 when search or category changes
    fetchProducts(1);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = async (pageNum: number) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '20',
        sortBy: 'latest',
      });

      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('categoryId', selectedCategory);

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      // Ensure products array exists and normalize each product
      const normalizedProducts = (data.products || []).map((product: any) => ({
        ...product,
        // Ensure images is always an array
        images: Array.isArray(product.images) ? product.images : [],
        // Normalize seller field - use seller if available, otherwise user
        seller: product.seller || product.user || null,
      }));

      setProducts(normalizedProducts);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">
          {searchQuery ? `Search results for "${searchQuery}"` : 'Browse Products'}
        </h1>
        <p className="text-gray-600">
          {products.length > 0 ? `${products.length} products found` : 'No products found'}
        </p>
      </div>

      {/* Products Grid or Empty State */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-2">No products found</p>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}