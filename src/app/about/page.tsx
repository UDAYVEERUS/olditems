'use client';

// src/app/about/page.tsx

import { MapPin, Users, Target, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const features = [
    {
      icon: Target,
      title: 'Our Mission',
      description:
        'To provide a safe, reliable, and user-friendly marketplace where people can buy and sell products easily across India.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description:
        'We believe in building a trustworthy community where buyers and sellers can connect and transact with confidence.',
    },
    {
      icon: Shield,
      title: 'Safe Transactions',
      description:
        'Your safety is our priority. We implement best practices to ensure secure and fraud-free transactions.',
    },
    {
      icon: MapPin,
      title: 'Pan-India Coverage',
      description:
        'Operating across India, we serve millions of users looking to buy and sell products in their local areas.',
    },
  ];

  const team = [
    {
      name: 'Uday Veeru',
      role: 'Founder & CEO',
      description: 'Passionate about creating a seamless marketplace experience.',
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#54CEBD] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-white">
            Building India's most trusted marketplace for buying and selling products
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Our Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Story</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            Founded with a vision to revolutionize how people buy and sell products in India, 
            our marketplace connects millions of users across the country. We started with a simple 
            idea: make online buying and selling accessible, safe, and convenient for everyone.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Today, we're proud to be one of the fastest-growing classifieds platforms in India, 
            trusted by thousands of sellers and millions of buyers who conduct transactions daily.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Why Choose Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <Icon className="text-[#E06B2D] mb-4" size={32} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 py-12 px-6 rounded-lg mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">By The Numbers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-[#E06B2D] mb-2">100K+</p>
              <p className="text-gray-700">Products Listed</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-[#E06B2D] mb-2">50K+</p>
              <p className="text-gray-700">Active Sellers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-[#E06B2D] mb-2">500K+</p>
              <p className="text-gray-700">Happy Users</p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trust</h3>
              <p className="text-gray-600">
                We build trust through transparency, secure transactions, and reliable customer support.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                Continuously improving our platform to provide the best user experience.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Supporting our community of buyers and sellers to grow together.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        {/* <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Leadership Team</h2>
          <div className="grid md:grid-cols-1 gap-6">
            {team.map((member, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-[#E06B2D] font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div> */}

        {/* CTA Section */}
        <div className="bg-[#54CEBD] text-white py-12 px-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Learn More?</h2>
          <p className="text-white mb-6 text-lg">
            Have questions? We'd love to hear from you. Get in touch with our team.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}