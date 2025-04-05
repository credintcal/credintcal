// Use type assertions to avoid TypeScript errors
// This avoids relying on the razorpay type definitions
export function getRazorpayInstance(): any {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('Razorpay API keys not found in environment variables.');
  }

  // Only import and initialize Razorpay when function is called at runtime
  // This prevents build-time errors
  try {
    // Dynamic import to prevent loading during build
    const Razorpay = require('razorpay');
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });
  } catch (error) {
    console.error('Failed to initialize Razorpay:', error);
    // Return a mock implementation that will throw clear errors if used
    return {
      orders: {
        create: () => {
          throw new Error('Razorpay initialization failed. Please check server logs.');
        }
      }
    };
  }
} 