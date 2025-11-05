// src/app/dashboard/products/[id]/edit/page.tsx
// Edit product page

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
}

interface ProductData {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  city: string;
  state: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<ProductData>({
    title: '',
    description: '',
    price: 0,
    categoryId: '',
    images: [],
    city: '',
    state: '',
    pincode: '',
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProductData();
    fetchCategories();
  }, [productId, user]);

  const fetchProductData = async () => {
    try {
      const res = await fetch(`/api/products/${productId}/edit`);
      if (!res.ok) {
        throw new Error('Failed to fetch product');
      }
      const data = await res.json();
      setFormData(data.product);
    } catch (error) {
      toast.error('Failed to load product');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check total images count
    if (formData.images.length + files.length > 3) {
      toast.error('Maximum 3 images allowed');
      return;
    }

    setUploadingImage(true);
    const newImages: string[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image`);
          continue;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          newImages.push(data.url);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (newImages.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages],
        }));
        toast.success('Images uploaded successfully');
      }
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.description || !formData.price || !formData.categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.images.length === 0) {
      toast.error('At least one image is required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          latitude: formData.latitude || 0,
          longitude: formData.longitude || 0,
        }),
      });

      if (res.ok) {
        toast.success('Product updated successfully');
        router.push('/dashboard');
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to update product');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-[#E06B2D]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#E06B2D] focus:border-transparent"
                placeholder="Enter product title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#E06B2D] focus:border-transparent"
                placeholder="Describe your product"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#E06B2D] focus:border-transparent"
                  placeholder="Enter price"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#E06B2D] focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Images <span className="text-sm font-normal text-gray-500">(Max 3 images)</span>
          </h2>
          
          {/* Existing Images */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="relative h-32 md:h-40 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`Product ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {formData.images.length < 3 && (
            <div>
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#E06B2D] transition-colors">
                  <div className="flex flex-col items-center">
                    {uploadingImage ? (
                      <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
                    ) : (
                      <Upload size={32} className="text-gray-400" />
                    )}
                    <span className="mt-2 text-sm text-gray-600">
                      {uploadingImage ? 'Uploading...' : 'Click to upload images'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      JPG, PNG up to 5MB
                    </span>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Location</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#E06B2D] focus:border-transparent"
                placeholder="Enter city"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#E06B2D] focus:border-transparent"
                placeholder="Enter state"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#E06B2D] focus:border-transparent"
                placeholder="Enter pincode"
                pattern="[0-9]{6}"
                maxLength={6}
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 sm:flex-initial px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#E06B2D] text-white rounded-lg hover:bg-[#C05A26] disabled:opacity-50 transition-colors font-medium flex items-center justify-center gap-2"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Updating...
              </>
            ) : (
              'Update Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}