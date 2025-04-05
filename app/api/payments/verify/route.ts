import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Define Razorpay API keys
const RAZORPAY_KEY_SECRET = 'BqQXVTKJUTho0wiUDMolXRsH';

export async function POST(request: Request) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = await request.json();

    console.log('Verifying payment:', {
      paymentId: razorpay_payment_id?.substring(0, 5) + '...',
      orderId: razorpay_order_id?.substring(0, 5) + '...',
      hasSignature: !!razorpay_signature,
    });

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;
    console.log('Signature verification result:', isAuthentic ? 'Success' : 'Failed');

    if (!isAuthentic) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    console.log('Payment verified successfully');
    return NextResponse.json(
      { message: 'Payment verified successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
} 