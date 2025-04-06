"use client";

import { useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentButtonProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onFailure: (error: any) => void;
}

export default function PaymentButton({ amount, onSuccess, onFailure }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const initializePayment = async () => {
    setIsLoading(true);
    try {
      // Create an order on the server
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to smallest currency unit (paise)
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }
      
      const orderData = await response.json();
      
      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Credbill",
        description: "Credit Card Calculator Payment",
        order_id: orderData.id,
        handler: function (response: any) {
          // Verify payment with server
          verifyPayment(response);
        },
        prefill: {
          name: "",
          email: "",
          contact: ""
        },
        notes: {
          address: "Credbill Headquarters"
        },
        theme: {
          color: "#4F46E5"
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Payment initialization error:', error);
      onFailure(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyPayment = async (paymentResponse: any) => {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentResponse),
      });
      
      if (!response.ok) {
        throw new Error('Payment verification failed');
      }
      
      const data = await response.json();
      
      if (data.verified) {
        onSuccess(paymentResponse.razorpay_payment_id);
      } else {
        onFailure(new Error('Payment could not be verified'));
      }
      
    } catch (error) {
      console.error('Payment verification error:', error);
      onFailure(error);
    }
  };

  return (
    <>
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        strategy="lazyOnload"
      />
      <button
        onClick={initializePayment}
        disabled={isLoading}
        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span>Pay ₹{amount.toFixed(2)}</span>
        )}
      </button>
    </>
  );
} 