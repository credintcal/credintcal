import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import { connectToDatabase } from '@/config/mongodb';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export async function initializeRazorpayPayment(amount: number) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    // Connect to database
    await connectToDatabase();

    // Get user and check discount eligibility
    const user = await User.findById(session.user.id);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user is eligible for discount
    const isEligibleForDiscount = user.checkDiscountEligibility();
    const finalAmount = isEligibleForDiscount ? amount * 0.9 : amount; // 10% discount for eligible users

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return new Promise((resolve, reject) => {
      script.onload = async () => {
        try {
          // Create order with authentication
          const response = await fetch('/api/payments/create-order', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'X-Razorpay-Key': 'rzp_live_RylHwwDOoIHii1',
              'X-Razorpay-Signature': Buffer.from(`${finalAmount}:INR`).toString('base64')
            },
            body: JSON.stringify({ amount: finalAmount }),
          });

          if (!response.ok) {
            throw new Error('Failed to create order');
          }

          const { orderId } = await response.json();

          // Initialize Razorpay with proper authentication
          const options = {
            key: 'rzp_live_RylHwwDOoIHii1',
            amount: finalAmount * 100,
            currency: 'INR',
            name: 'Credit Card Fee Calculator',
            description: 'Payment for credit card fee calculation',
            order_id: orderId,
            handler: async (response: any) => {
              try {
                // Verify payment with authentication
                const verificationResponse = await fetch('/api/payments/verify', {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    'X-Razorpay-Key': 'rzp_live_RylHwwDOoIHii1',
                    'X-Razorpay-Signature': response.razorpay_signature
                  },
                  body: JSON.stringify({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature
                  }),
                });

                if (verificationResponse.ok) {
                  // Update user's payment history
                  user.lastPaymentDate = new Date();
                  user.paymentCount += 1;
                  user.discountEligible = user.checkDiscountEligibility();
                  await user.save();
                  resolve(response);
                } else {
                  reject(new Error('Payment verification failed'));
                }
              } catch (error) {
                reject(error);
              }
            },
            prefill: {
              name: user.name,
              email: user.email,
            },
            theme: {
              color: '#2563eb',
            },
            notes: {
              session_id: session.user.id
            }
          };

          const razorpay = new (window as any).Razorpay(options);
          razorpay.open();
        } catch (error) {
          reject(error);
        }
      };

      script.onerror = () => {
        reject(new Error('Failed to load Razorpay script'));
      };
    });
  } catch (error) {
    throw error;
  }
}

const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}; 