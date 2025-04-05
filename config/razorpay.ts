// Use type assertions to avoid TypeScript errors
// This avoids relying on the razorpay type definitions
export function getRazorpayInstance(): any {
  // Check for both sets of keys to help with debugging
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error('Razorpay API keys not found. Please check your environment variables:', {
      hasKeyId: !!keyId,
      hasKeySecret: !!keySecret,
      nodeEnv: process.env.NODE_ENV,
      keyIdPrefix: keyId?.substring(0, 10), // Log first 10 chars to verify correct key
      keyType: keyId?.startsWith('rzp_test') ? 'test' : 'live'
    });
    throw new Error('Razorpay API keys not configured correctly');
  }

  // Verify key format
  if (!keyId.startsWith('rzp_') || !keySecret) {
    throw new Error('Invalid Razorpay key format');
  }

  // Only import and initialize Razorpay when function is called at runtime
  try {
    // Dynamic import to prevent loading during build
    const Razorpay = require('razorpay');
    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Log successful initialization
    console.log('Razorpay initialized successfully:', {
      keyType: keyId.startsWith('rzp_test') ? 'test' : 'live',
      environment: process.env.NODE_ENV
    });

    return instance;
  } catch (error) {
    console.error('Failed to initialize Razorpay:', error);
    throw new Error('Razorpay initialization failed. Please check server logs.');
  }
} 