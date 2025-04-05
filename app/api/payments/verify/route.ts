import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    // Verify Razorpay key in headers
    const razorpayKey = request.headers.get('x-razorpay-key');
    const razorpaySignature = request.headers.get('x-razorpay-signature');

    if (!razorpayKey || razorpayKey !== 'rzp_live_RylHwwDOoIHii1') {
      return NextResponse.json(
        { error: 'Invalid Razorpay key' },
        { status: 401 }
      );
    }

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = await request.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const secretKey = 'BqQXVTKJUTho0wiUDMolXRsH';
    
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Payment verified successfully' },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
} 