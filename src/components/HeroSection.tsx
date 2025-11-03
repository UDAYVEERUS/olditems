// components/HeroSection.tsx
import React from 'react';
import Link from 'next/link';

interface HeroSectionProps {
    className?: string;
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
    return (
        <section className={`relative bg-[#54CEBD] text-white ${className}`}>
            <div className="lg:px-8 py-20">
                <div className="text-center">
                    {/* Main Heading */}
                    <h1 className="text-2xl md:text-4xl font-bold mb-6 leading-tight">
                        Buy & Sell Your Old Products
                        <span className="block text-white">With Ease</span>
                    </h1>
                    {/* CTA Buttons */}
                    <div className="flex flex-row gap-4 justify-center">
                        <Link
                            href="/products/new"
                            className="bg-[#F37A33] text-white px-4 py-2 rounded-lg text-lg transition-colors shadow-lg"
                        >
                            Start Selling
                        </Link>
                        <Link
                            href="/products"
                            className="bg-white text-black px-4 py-2 rounded-lg text-lg transition-colors"
                        >
                            Browse Products
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    {/* <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-blue-100">
                        <div>
                            <span className="block text-3xl font-bold text-white">10k+</span>
                            Active Users
                        </div>
                        <div>
                            <span className="block text-3xl font-bold text-white">50k+</span>
                            Products Sold
                        </div>
                        <div>
                            <span className="block text-3xl font-bold text-white">4.8★</span>
                            Average Rating
                        </div>
                    </div> */}
                </div>
            </div>
        </section>
    );
}