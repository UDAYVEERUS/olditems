// src/app/layout.tsx
// Root layout with Context Providers

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { AuthProvider } from '@/context/AuthContext';
import { SearchProvider } from '@/context/SearchContext';
import { Toaster } from 'react-hot-toast';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Marketplace - Buy & Sell Products',
  description: 'Buy and sell products across India',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SearchProvider>
            <Header />
            <main className="min-h-screen bg-gray-50">
              {children}
            </main>
            <Toaster position="top-right" />
            <Footer />
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}