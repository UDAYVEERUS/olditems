// src/components/Footer.tsx

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <img src="logo.png" width={100} height={100} alt='Logo' className='mb-4 bg-white p-2' />
            <p className="text-sm text-white mb-4">
              India's trusted marketplace for buying and selling products. Connect with millions of buyers 
              and sellers nationwide.
            </p>
            
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-white hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-white hover:text-blue-400 transition-colors">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white hover:text-blue-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              {/* <li>
                <Link href="/privacy-policy" className="text-white hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-400" />
                <a 
                  href="mailto:support@marketplace.com" 
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  olditemss@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-400" />
                <a 
                  href="tel:+918001234567" 
                  className="text-white hover:text-blue-400 transition-colors"
                >
                 +91-9838824898
                </a>
              </li>
              {/* <li className="flex items-start gap-2">
                <MapPin size={16} className="text-blue-400 mt-1" />
                <span className="text-white">
                  Gurugram, Haryana<br />
                  India
                </span>
              </li> */}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-4 mb-4">
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-[#E06B2D] p-2 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-[#E06B2D] p-2 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-[#E06B2D] p-2 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
            <p className="text-xs text-white">
              Connect with us on social media for updates and news.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white">
          <p>© {currentYear} Marketplace. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-conditions" className="hover:text-blue-400 transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-blue-400 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}