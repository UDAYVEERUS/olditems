'use client';

// src/app/products/new/page.tsx
// Product creation - FREE FOR ALL (subscription code commented out)

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ImageUpload from '@/components/ImageUpload';
import toast from 'react-hot-toast';
import { Loader2, AlertCircle, Lock } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  subCategories?: Category[];
}

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  // ==================== SUBSCRIPTION STATE (COMMENTED OUT) ====================
  // const [checkingSubscription, setCheckingSubscription] = useState(true);
  // const [canList, setCanList] = useState(false);
  // const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);
  // ==================== END SUBSCRIPTION STATE ====================
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    images: [] as string[],
    city: user?.city || '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // ==================== SUBSCRIPTION CHECK (COMMENTED OUT) ====================
    // checkSubscription();
    // ==================== END SUBSCRIPTION CHECK ====================
    fetchCategories();
  }, [user]);

  // ==================== SUBSCRIPTION CHECK FUNCTION (COMMENTED OUT) ====================
  // const checkSubscription = async () => {
  //   try {
  //     const res = await fetch('/api/subscription/check');
  //     const data = await res.json();
  //     
  //     setSubscriptionInfo(data);
  //     setCanList(data.canList);
  //     
  //     if (!data.canList) {
  //       toast.error('Subscribe for ₹10/month to start listing products');
  //     }
  //   } catch (error) {
  //     console.error('Error checking subscription:', error);
  //     toast.error('Failed to check subscription status');
  //   } finally {
  //     setCheckingSubscription(false);
  //   }
  // };
  // ==================== END SUBSCRIPTION CHECK FUNCTION ====================

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    if (formData.images.length > 3) {
      toast.error('Maximum 3 images allowed');
      return;
    }

    // ==================== SUBSCRIPTION CHECK BEFORE SUBMIT (COMMENTED OUT) ====================
    // if (!canList) {
    //   toast.error('Please subscribe to list products');
    //   router.push('/subscription');
    //   return;
    // }
    // ==================== END SUBSCRIPTION CHECK ====================

    setLoading(true);

    try {
      const res = await fetch('/api/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Product listed successfully!');
        router.push('/dashboard');
      } else {
        // ==================== SUBSCRIPTION ERROR HANDLING (COMMENTED OUT) ====================
        // if (data.needsPayment) {
        //   toast.error('Please subscribe to continue listing');
        //   router.push('/subscription');
        // } else {
        //   toast.error(data.error || 'Failed to create product');
        // }
        // ==================== END SUBSCRIPTION ERROR HANDLING ====================
        
        // FREE LISTING - Simple error handling
        toast.error(data.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('Create product error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  // ==================== SUBSCRIPTION LOADING STATE (COMMENTED OUT) ====================
  // if (checkingSubscription) {
  //   return (
  //     <div className="flex justify-center items-center min-h-[60vh]">
  //       <Loader2 className="animate-spin text-blue-600" size={48} />
  //     </div>
  //   );
  // }
  // ==================== END SUBSCRIPTION LOADING STATE ====================

  // ==================== SUBSCRIPTION REQUIRED SCREEN (COMMENTED OUT) ====================
  // Show subscription required screen if not subscribed
  // if (!canList) {
  //   return (
  //     <div className="max-w-2xl mx-auto px-4 py-12">
  //       <div className="bg-white rounded-lg shadow-md p-8 text-center">
  //         <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
  //           <Lock className="text-blue-600" size={32} />
  //         </div>
  //         
  //         <h1 className="text-2xl font-bold mb-2">Subscription Required</h1>
  //         <p className="text-gray-600 mb-6">
  //           Subscribe for just ₹10/month to start listing your products
  //         </p>
  //
  //         <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
  //           <h3 className="font-semibold text-lg mb-3">What You Get:</h3>
  //           <ul className="text-left space-y-2">
  //             <li className="flex items-center gap-2">
  //               <span className="text-green-600">✓</span>
  //               <span>List unlimited products</span>
  //             </li>
  //             <li className="flex items-center gap-2">
  //               <span className="text-green-600">✓</span>
  //               <span>Auto-renewal every month</span>
  //             </li>
  //             <li className="flex items-center gap-2">
  //               <span className="text-green-600">✓</span>
  //               <span>Reach buyers across India</span>
  //             </li>
  //             <li className="flex items-center gap-2">
  //               <span className="text-green-600">✓</span>
  //               <span>Manage all listings from dashboard</span>
  //             </li>
  //           </ul>
  //         </div>
  //
  //         <button
  //           onClick={() => router.push('/subscription')}
  //           className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg"
  //         >
  //           Subscribe Now - ₹10/month
  //         </button>
  //
  //         <button
  //           onClick={() => router.push('/')}
  //           className="w-full mt-3 py-2 text-gray-600 hover:text-gray-800"
  //         >
  //           Back to Home
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }
  // ==================== END SUBSCRIPTION REQUIRED SCREEN ====================

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">List Your Product</h1>

        {/* ==================== ACTIVE SUBSCRIPTION BANNER (COMMENTED OUT) ==================== */}
        {/* Active Subscription Banner */}
        {/* <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-start gap-2">
            <AlertCircle size={20} className="text-green-600" />
            <div className="flex-1">
              <p className="text-sm text-green-700 font-medium">
                ✓ Active subscription - List unlimited products
              </p>
              {subscriptionInfo?.subscriptionEndDate && (
                <p className="text-xs text-green-600 mt-1">
                  Valid until: {new Date(subscriptionInfo.subscriptionEndDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div> */}
        {/* ==================== END ACTIVE SUBSCRIPTION BANNER ==================== */}

        {/* FREE LISTING BANNER (NEW) */}
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
          <p className="text-sm text-green-700 font-medium">
            ✓ Free product listing - No subscription required!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              maxLength={100}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., iPhone 13 Pro Max 256GB"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={5}
              maxLength={1000}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your product in detail..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/1000 characters
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Category *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <optgroup key={cat.id} label={cat.name}>
                  <option value={cat.id}>{cat.name}</option>
                  {cat.subCategories?.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      &nbsp;&nbsp;{sub.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              min="1"
              step="1"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter price in rupees"
            />
          </div>

          {/* Images */}
          <ImageUpload
            images={formData.images}
            setImages={(images) => setFormData({ ...formData, images })}
          />

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                State *
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Pincode *
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                required
                pattern="[0-9]{6}"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="6-digit"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Listing Product...
              </>
            ) : (
              'List Product for Free' // Changed button text
            )}
          </button>
        </form>
      </div>
    </div>
  );
}