declare global {
  interface Window {
    Razorpay: any;
  }
}

export const initializeRazorpayPayment = async (transactionId: string): Promise<boolean> => {
  try {
    // Clear any previous Razorpay sessions
    localStorage.removeItem('razorpay_payment_id');
    localStorage.removeItem('razorpay_order_id');
    
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Order creation failed:', response.status, errorText);
      throw new Error(`Failed to create order: ${response.status} ${response.statusText}`);
    }

    const { orderId, amount, currency } = await response.json();
    console.log('Order created successfully:', { orderId, amount, currency });

    return new Promise((resolve) => {
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
            console.log('Payment successful, verifying...', response.razorpay_payment_id);
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

            if (!verificationResponse.ok) {
              const errorText = await verificationResponse.text();
              console.error('Verification failed:', verificationResponse.status, errorText);
              alert('Payment verification failed. Please try again.');
              resolve(false);
              return;
            }

            const data = await verificationResponse.json();
            if (data.status === 'success') {
              console.log('Payment verified successfully');
              resolve(true);
            } else {
              console.error('Payment verification returned error:', data);
              alert('Payment verification failed. Please try again.');
              resolve(false);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please try again.');
            resolve(false);
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            resolve(false);
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
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    alert('Failed to initialize payment. Please try again.');
    return false;
  }
};

const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      console.log('Razorpay script already loaded');
      resolve(true);
      return;
    }
    
    console.log('Loading Razorpay script...');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      resolve(true);
    };
    script.onerror = (error) => {
      console.error('Failed to load Razorpay script:', error);
      reject(new Error('Failed to load Razorpay script'));
    };
    document.body.appendChild(script);
  });
}; 