import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import { connectToDatabase } from '@/config/mongodb';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_KEY_ID = 'rzp_live_RylHwwDOoIHii1';

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
    await loadRazorpayScript();

    try {
      // Create order
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const { orderId } = await response.json();

      // Return a Promise that resolves when payment is complete
      return new Promise((resolve, reject) => {
        const options = {
          key: RAZORPAY_KEY_ID,
          amount: finalAmount * 100, // Razorpay expects amount in paise
          currency: 'INR',
          name: 'Credit Card Fee Calculator',
          description: 'Payment for credit card fee calculation',
          order_id: orderId,
          handler: async function (response: any) {
            try {
              // Verify payment
              const verificationResponse = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(response),
              });

              if (!verificationResponse.ok) {
                const errorData = await verificationResponse.json();
                throw new Error(errorData.error || 'Payment verification failed');
              }

              // Update user's payment history
              user.lastPaymentDate = new Date();
              user.paymentCount += 1;
              user.discountEligible = user.checkDiscountEligibility();
              await user.save();

              resolve(response);
            } catch (error) {
              reject(error);
            }
          },
          prefill: {
            name: user.name || '',
            email: user.email || '',
          },
          theme: {
            color: '#2563eb',
          },
          modal: {
            ondismiss: function() {
              reject(new Error('Payment cancelled by user'));
            }
          }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Payment setup error:', error);
    throw error;
  }
}

const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if Razorpay is already loaded
    if ((window as any).Razorpay) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });
}; 