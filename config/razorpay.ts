// Use type assertions to avoid TypeScript errors
// This avoids relying on the razorpay type definitions
export function getRazorpayInstance(): any {
  try {
    const Razorpay = require('razorpay');
    return new Razorpay({
      key_id: 'rzp_live_RylHwwDOoIHii1',
      key_secret: 'BqQXVTKJUTho0wiUDMolXRsH'
    });
  } catch (error) {
    throw new Error('Razorpay initialization failed');
  }
} 