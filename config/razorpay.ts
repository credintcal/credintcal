// Define Razorpay API keys
const RAZORPAY_KEY_ID = 'rzp_live_RylHwwDOoIHii1';
const RAZORPAY_KEY_SECRET = 'BqQXVTKJUTho0wiUDMolXRsH';

// Use type assertions to avoid TypeScript errors
// This avoids relying on the razorpay type definitions
export function getRazorpayInstance(): any {
  try {
    // Dynamic import to prevent loading during build
    const Razorpay = require('razorpay');
    return new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    });
  } catch (error) {
    console.error('Failed to initialize Razorpay:', error);
    throw new Error('Razorpay initialization failed');
  }
} 