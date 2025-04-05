import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = await request.json();

    console.log('Verifying payment:', {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      hasSignature: !!razorpay_signature,
    });

    // Check if we have all required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      console.error('Missing required Razorpay fields');
      return NextResponse.json(
        { error: 'Missing required Razorpay fields' },
        { status: 400 }
      );
    }

    // Check if we have the secret key
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay secret key is missing');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const secretKey = process.env.RAZORPAY_KEY_SECRET;
    console.log('Using secret key:', secretKey ? 'Key exists' : 'Key missing');

    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
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
      { error: 'Failed to verify payment', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 