'use client';

import { useEffect, useState } from 'react';
import { useSearch } from '@/context/SearchContext';
import ProductsGrid from '@/components/ProductsGrid';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
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

export default function HomePage() {
  const { searchQuery, selectedCategory } = useSearch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reset to page 1 when search/category changes
  useEffect(() => {
    setPage(1);
    fetchProducts(1);
  }, [searchQuery, selectedCategory]);

  // Fetch products when page changes
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

      // Normalize products data
      const normalizedProducts = (data.products || []).map((product: any) => ({
        ...product,
        images: Array.isArray(product.images) ? product.images : [],
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
    return <LoadingSpinner />;
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

      {/* Products or Empty State */}
      {products.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ProductsGrid products={products} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}