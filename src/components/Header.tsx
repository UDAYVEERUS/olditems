"use client";

// src/components/Header.tsx
// Responsive header with mobile menu and search modal

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSearch } from "@/context/SearchContext";
import {
  Search,
  User,
  LogOut,
  Package,
  Plus,
  Menu,
  X,
  ChevronDown,
  Home,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  subCategories?: Category[];
}

interface Product {
  id: string;
  title: string;
  price: number;
  image?: string;
  images?: string[];
}

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { searchQuery, selectedCategory, setSearchQuery, setSelectedCategory } =
    useSearch();
  const [categories, setCategories] = useState<Category[]>([]);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null); // New ref for desktop search
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
    setShowSearchModal(false);
  }, [router]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu || showSearchModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMobileMenu, showSearchModal]);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      // Change from 2 to 3 characters minimum
      if (localSearch.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const params = new URLSearchParams({
          search: localSearch,
          limit: "5",
        });

        if (selectedCategory) {
          params.append("category", selectedCategory);
        }

        const res = await fetch(`/api/products?${params}`);
        const data = await res.json();
        setSuggestions(data.products || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [localSearch, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setShowSuggestions(false);
    setShowSearchModal(false);
    router.push(`/products?search=${encodeURIComponent(localSearch)}`);
  };

  const handleSuggestionClick = (product: Product) => {
    setShowSuggestions(false);
    setShowSearchModal(false);
    setLocalSearch("");
    setSearchQuery("");
    router.push(`/products/${product.id}`);
  };

  const handleCategoryChange = (categoryId: string) => {
    const newCategory = categoryId === "all" ? null : categoryId;
    setSelectedCategory(newCategory);
    setShowSearchModal(false);

    // Build query params for navigation
    const params = new URLSearchParams();
    if (newCategory) {
      params.append('category', newCategory);
    }
    if (localSearch) {
      params.append('search', localSearch);
    }

    // Navigate with query params
    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ''}`);
  };
  
  const handleLogout = async () => {
    await logout();
    setShowMobileMenu(false);
    setShowUserDropdown(false);
    router.push("/");
  };

  // Get product image
  const getProductImage = (product: Product) => {
    if (product.image) return product.image;
    if (product.images && product.images.length > 0) return product.images[0];
    return null;
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image src="/logo.png" height={50} width={50} alt="logo" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 flex-1 mx-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                All Products
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4 flex-1 justify-end">
              {/* Desktop Search Inline - Wrapped in relative div */}
              <div className="relative max-w-xl w-full" ref={desktopSearchRef}>
                <form
                  onSubmit={handleSearch}
                  className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-300"
                >
                  {/* Category Selector - Fixed width */}
                  <select
                    value={selectedCategory || "all"}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="bg-gray-100 px-3 py-2 text-gray-700 border-r border-gray-300 focus:outline-none flex-shrink-0"
                    style={{ minWidth: "100px", maxWidth: "100px" }}
                  >
                    <option value="all">All</option>
                    {categories.map((cat) => (
                      <>
                        {/* Parent category option */}
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                        {/* Subcategories with indentation */}
                        {cat.subCategories?.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            &nbsp;&nbsp;{sub.name}
                          </option>
                        ))}
                      </>
                    ))}
                  </select>

                  {/* Search Input - Takes remaining space */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      placeholder="Search products..."
                      className="w-full px-3 py-2 bg-gray-100 focus:outline-none text-gray-700"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-600"
                    >
                      <Search size={20} />
                    </button>
                  </div>
                </form>

                {/* Suggestions Dropdown - Positioned relative to wrapper */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg mt-1 z-50">
                    {isLoadingSuggestions ? (
                      <div className="p-3 text-sm text-gray-500 text-center">
                        Loading...
                      </div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((product) => {
                        const productImage = getProductImage(product);
                        return (
                          <div
                            key={product.id}
                            onClick={() => handleSuggestionClick(product)}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer"
                          >
                            {productImage ? (
                              <img
                                src={productImage}
                                alt={product.title}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded">
                                <Package
                                  size={18}
                                  className="text-gray-400"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-gray-800 text-sm font-medium">
                                {product.title}
                              </p>
                              <p className="text-blue-600 text-sm font-semibold">
                                ₹{product.price.toLocaleString("en-IN")}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-3 text-sm text-gray-500 text-center">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sell Button */}
              <Link
                href="/products/new"
                className="flex items-center gap-2 px-4 py-2 bg-[#F37A33] text-white rounded-lg font-medium hover:bg-[#e06b2d]"
              >
                <Plus size={18} />
                Sell
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-base font-semibold"
                    title={user.name}
                  >
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border">
                      <div className="px-4 py-2 border-b">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <Package size={18} />
                        My Products
                      </Link>
                      <Link
                        href="/products/new"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <Plus size={18} />
                        Sell Product
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    className="px-2 py-2 w-full text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center space-x-2">
              {/* Mobile Search Button */}
              <button
                onClick={() => setShowSearchModal(true)}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Search size={20} />
              </button>

              {/* Mobile Sell Button */}
              <Link
                href="/products/new"
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
              >
                <Plus size={16} />
                Sell
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(true)}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-white bg-opacity-30 opacity-60"
            onClick={() => setShowMobileMenu(false)}
          />

          <div className="fixed right-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto h-full pb-20">
              {user ? (
                <div className="p-4 border-b">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              ) : null}

              <nav className="p-4 space-y-2">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Home size={20} />
                  Home
                </Link>

                <Link
                  href="/products"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <ShoppingBag size={20} />
                  All Products
                </Link>

                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Package size={20} />
                      My Products
                    </Link>

                    <Link
                      href="/products/new"
                      className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Plus size={20} />
                      Sell Product
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full text-left"
                    >
                      <LogOut size={20} />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-2 pt-4 border-t">
                    <Link
                      href="/login"
                      className="block px-3 py-2 text-center text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Login
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="fixed inset-0 bg-white bg-opacity-30 opacity-60"
            onClick={() => setShowSearchModal(false)}
          />

          <div
            className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl"
            ref={searchRef}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Search Products</h2>
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </form>

              {/* Suggestions */}
              {showSuggestions && (
                <div className="mt-4 border-t pt-4 max-h-64 overflow-y-auto">
                  {isLoadingSuggestions ? (
                    <div className="text-gray-500 text-center py-4">
                      Loading...
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500 mb-2">Suggestions</p>
                      {suggestions.map((product) => {
                        const productImage = getProductImage(product);
                        return (
                          <div
                            key={product.id}
                            onClick={() => handleSuggestionClick(product)}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer rounded-lg"
                          >
                            {productImage ? (
                              <img
                                src={productImage}
                                alt={product.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <Package size={20} className="text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {product.title}
                              </div>
                              <div className="text-sm text-blue-600 font-semibold">
                                ₹{product.price.toLocaleString("en-IN")}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-4">
                      No products found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}