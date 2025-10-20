// src/lib/msg91.ts
// MSG91 SMS OTP utilities

import axios from 'axios';

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY!;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID!;

// Send OTP to phone number
export async function sendOTP(phone: string, otp: string) {
  try {
    const response = await axios.post(
      'https://control.msg91.com/api/v5/otp',
      {
        template_id: MSG91_TEMPLATE_ID,
        mobile: phone,
        authkey: MSG91_AUTH_KEY,
        otp: otp,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      message: 'OTP sent successfully',
      data: response.data,
    };
  } catch (error: any) {
    console.error('MSG91 Send OTP Error:', error.response?.data || error.message);
    return {
      success: false,
      message: 'Failed to send OTP',
      error: error.response?.data || error.message,
    };
  }
}

// Alternative: Send OTP using SMS route (more reliable)
export async function sendOTPViaSMS(phone: string, otp: string) {
  try {
    const message = `Your Marketplace verification code is: ${otp}. Valid for 5 minutes. Do not share with anyone.`;
    
    const response = await axios.get(
      `https://api.msg91.com/api/v2/sendsms`,
      {
        params: {
          authkey: MSG91_AUTH_KEY,
          mobiles: phone,
          message: message,
          sender: 'MARKET', // Your 6-char sender ID
          route: 4, // Transactional route
          country: 91, // India
        },
      }
    );

    return {
      success: true,
      message: 'OTP sent successfully',
      data: response.data,
    };
  } catch (error: any) {
    console.error('MSG91 SMS Error:', error.response?.data || error.message);
    return {
      success: false,
      message: 'Failed to send OTP',
      error: error.response?.data || error.message,
    };
  }
}

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Verify OTP (store in memory/redis - simple version)
const otpStore = new Map<string, { otp: string; expires: number }>();

export function storeOTP(phone: string, otp: string) {
  const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore.set(phone, { otp, expires });
}

export function verifyOTP(phone: string, otp: string): boolean {
  const stored = otpStore.get(phone);
  
  if (!stored) {
    return false;
  }

  if (Date.now() > stored.expires) {
    otpStore.delete(phone);
    return false;
  }

  if (stored.otp !== otp) {
    return false;
  }

  // OTP verified, delete it
  otpStore.delete(phone);
  return true;
}

export function clearOTP(phone: string) {
  otpStore.delete(phone);
}