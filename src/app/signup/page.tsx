'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // ==================== OTP STATE (COMMENTED OUT) ====================
  // const [otpSent, setOtpSent] = useState(false);
  // const [otpVerified, setOtpVerified] = useState(false);
  // const [otp, setOtp] = useState('');
  // ==================== END OTP STATE ====================

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    city: '',
    state: '',
    pincode: '',
  });

  // ==================== OTP FUNCTIONS (COMMENTED OUT) ====================
  // // Send OTP
  // const sendOtp = async () => {
  //   if (!/^[0-9]{10}$/.test(formData.phone)) {
  //     toast.error('Enter a valid 10-digit phone number');
  //     return;
  //   }
  //
  //   setLoading(true);
  //   const res = await fetch('/api/auth/send-otp', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ phone: formData.phone }),
  //   });
  //
  //   const data = await res.json();
  //   setLoading(false);
  //
  //   if (res.ok) {
  //     setOtpSent(true);
  //     toast.success('OTP sent successfully!');
  //   } else {
  //     toast.error(data.error || 'Failed to send OTP');
  //   }
  // };
  //
  // // Verify OTP
  // const verifyOtp = async () => {
  //   if (!otp) {
  //     toast.error('Enter OTP');
  //     return;
  //   }
  //
  //   setLoading(true);
  //   const res = await fetch('/api/auth/verify-otp', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ phone: formData.phone, otp }),
  //   });
  //
  //   const data = await res.json();
  //   setLoading(false);
  //
  //   if (res.ok) {
  //     setOtpVerified(true);
  //     toast.success('Phone verified successfully!');
  //   } else {
  //     toast.error(data.error || 'Invalid OTP');
  //   }
  // };
  // ==================== END OTP FUNCTIONS ====================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ==================== OTP CHECK (COMMENTED OUT) ====================
    // if (!otpVerified) {
    //   toast.error('Please verify your phone number first');
    //   return;
    // }
    // ==================== END OTP CHECK ====================

    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      toast.error('Please enter valid 6-digit pincode');
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData, latitude: 0, longitude: 0 };
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        toast.success('Account created successfully!');
        router.push('/');
      } else {
        toast.error(data.error || 'Signup failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Email - Row on desktop, stack on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Phone & Password - Row on desktop, stack on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                pattern="[0-9]{10}"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10-digit mobile number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          {/* ==================== OTP UI (COMMENTED OUT) ==================== */}
          {/* Phone + Send OTP */}
          {/* <div>
            <label className="block text-sm font-medium mb-1">Phone Number *</label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                pattern="[0-9]{10}"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10-digit mobile number"
              />
              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
              </button>
            </div>
          </div> */}

          {/* OTP Field (only visible after OTP sent) */}
          {/* {otpSent && (
            <div>
              <label className="block text-sm font-medium mb-1">Enter OTP *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter OTP"
                />
                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={loading}
                  className="px-4 py-2 bg-[#E06B2D] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
              {otpVerified && (
                <p className="text-green-600 text-sm mt-1">✅ Phone verified</p>
              )}
            </div>
          )} */}
          {/* ==================== END OTP UI ==================== */}

          {/* ==================== CONFIRM PASSWORD FIELD (REMOVED) ==================== */}
          {/* <div>
            <label className="block text-sm font-medium mb-1">Confirm Password *</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Re-enter password"
            />
          </div> */}
          {/* ==================== END CONFIRM PASSWORD FIELD ==================== */}

          {/* City, State, Pincode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">State *</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your state"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pincode *</label>
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              required
              pattern="[0-9]{6}"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="6-digit pincode"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#E06B2D] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-[#E06B2D] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}