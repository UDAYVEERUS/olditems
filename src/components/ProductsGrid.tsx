'use client';

import ProductCard from './ProductCard';

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

interface ProductsGridProps {
  products: Product[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}