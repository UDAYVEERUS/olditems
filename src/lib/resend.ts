// src/lib/resend.ts
// Resend email utilities

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Marketplace <noreply@yourdomain.com>';

// Send welcome email
export async function sendWelcomeEmail(to: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: 'Welcome to Marketplace! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Welcome to Marketplace!</h1>
          <p>Hi ${name},</p>
          <p>Thank you for joining our marketplace. We're excited to have you here!</p>
          <p>You can now:</p>
          <ul>
            <li>Browse products from sellers across India</li>
            <li>Subscribe for just ₹10/month to list your products</li>
            <li>Connect directly with buyers via phone</li>
          </ul>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Start Browsing
            </a>
          </p>
          <p>Best regards,<br>The Marketplace Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Send welcome email error:', error);
    return { success: false, error };
  }
}

// Send password reset email
export async function sendPasswordResetEmail(to: string, name: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: 'Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Reset Your Password</h1>
          <p>Hi ${name},</p>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          <p>
            <a href="${resetUrl}" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The Marketplace Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Send reset email error:', error);
    return { success: false, error };
  }
}

// Send subscription reminder
export async function sendSubscriptionReminderEmail(to: string, name: string, daysLeft: number) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Your Subscription Expires in ${daysLeft} Days`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #f59e0b;">Subscription Reminder</h1>
          <p>Hi ${name},</p>
          <p>Your marketplace subscription will expire in <strong>${daysLeft} days</strong>.</p>
          <p>Make sure your payment method is up to date to avoid interruption in your listings.</p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Manage Subscription
            </a>
          </p>
          <p>Best regards,<br>The Marketplace Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Send reminder email error:', error);
    return { success: false, error };
  }
}

// Send subscription expiry email
export async function sendSubscriptionExpiredEmail(to: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: 'Your Subscription Has Expired',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Subscription Expired</h1>
          <p>Hi ${name},</p>
          <p>Your marketplace subscription has expired. Your product listings are now hidden.</p>
          <p>Renew your subscription to continue listing products:</p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/subscription" 
               style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Renew Subscription (₹10/month)
            </a>
          </p>
          <p>Best regards,<br>The Marketplace Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Send expired email error:', error);
    return { success: false, error };
  }
}

// Send payment receipt
export async function sendPaymentReceiptEmail(
  to: string,
  name: string,
  amount: number,
  transactionId: string,
  date: Date
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: 'Payment Receipt - Marketplace Subscription',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Payment Successful!</h1>
          <p>Hi ${name},</p>
          <p>Thank you for your payment. Your subscription is now active.</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Amount Paid:</strong> ₹${amount}</p>
            <p><strong>Transaction ID:</strong> ${transactionId}</p>
            <p><strong>Date:</strong> ${date.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</p>
          </div>
          <p>Your subscription is valid for 30 days and will auto-renew.</p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Start Listing Products
            </a>
          </p>
          <p>Best regards,<br>The Marketplace Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Send receipt email error:', error);
    return { success: false, error };
  }
}