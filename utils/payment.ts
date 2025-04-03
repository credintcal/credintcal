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
          // Create order
          const response = await fetch('/api/payments/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: finalAmount }),
          });

          const { orderId } = await response.json();

          // Initialize Razorpay
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: finalAmount * 100, // Razorpay expects amount in paise
            currency: 'INR',
            name: 'Credit Card Fee Calculator',
            description: 'Payment for credit card fee calculation',
            order_id: orderId,
            handler: async (response: any) => {
              try {
                // Verify payment
                const verificationResponse = await fetch('/api/payments/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(response),
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
    console.error('Payment initialization error:', error);
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