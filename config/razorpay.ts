import Razorpay from 'razorpay';

// Factory function that creates a Razorpay instance when needed
// This avoids initialization during build time
export function getRazorpayInstance(): Razorpay {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('Razorpay API keys not found in environment variables.');
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
  });
} 