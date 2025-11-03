// src/app/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import ProductsGridWrapper from '@/components/ProductsGridWrapper';
import LoadingSpinner from '@/components/LoadingSpinner';

export const metadata: Metadata = {
  title: 'Olditems - Buy & Sell Used Products in India | Free Classifieds',
  description:
    'Browse thousands of used products across India. Find great deals on mobiles, electronics, furniture, vehicles and more. Post your free ad today on Olditems.in',
  openGraph: {
    title: 'Olditems - Buy & Sell Used Products in India',
    description: 'Browse thousands of used products. Post free ads today!',
    url: 'https://www.olditems.in',
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* SEO Content - Always visible */}
        <div className="mb-8 sm:text-left text-center">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">
            Buy & Sell Used Products Online in India
          </h1>
          <p className="text-gray-600">
            Discover thousands of products from verified sellers across India
          </p>
        </div>

        {/* Products with Suspense for loading state */}
        <Suspense fallback={<LoadingSpinner />}>
          <ProductsGridWrapper />
        </Suspense>
      </div>
    </>
  );
}