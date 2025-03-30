declare global {
  interface Window {
    Razorpay: any;
  }
}

export const initializeRazorpayPayment = async (transactionId: string) => {
  try {
    // Load Razorpay script
    await loadRazorpayScript();

    // Create order
    const response = await fetch('/api/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transactionId }),
    });

    const { orderId, amount, currency } = await response.json();

    // Initialize Razorpay options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount,
      currency,
      name: 'Credit Card Fee Calculator',
      description: 'Unlock Full Amount',
      order_id: orderId,
      handler: async function (response: any) {
        try {
          const verificationResponse = await fetch('/api/create-payment', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              transactionId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          const data = await verificationResponse.json();
          if (data.status === 'success') {
            window.location.reload();
          } else {
            alert('Payment verification failed. Please try again.');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          alert('Payment verification failed. Please try again.');
        }
      },
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      theme: {
        color: '#2563EB',
      },
    };

    // Create Razorpay instance
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error('Payment initialization error:', error);
    alert('Failed to initialize payment. Please try again.');
  }
};

const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}; 