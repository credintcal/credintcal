import { NextResponse } from 'next/server';
import razorpay from '../../../config/razorpay';
import Transaction from '../../../models/Transaction';
import crypto from 'crypto';
import mongodbConnection from '../../../config/mongodb';

export async function POST(request: Request) {
  try {
    const { transactionId } = await request.json();

    // Create Razorpay order for ₹10
    const order = await razorpay.orders.create({
      amount: 1000, // Amount in paise (₹10)
      currency: 'INR',
      receipt: transactionId,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Ensure MongoDB is connected
    if (mongodbConnection.readyState !== 1) {
      await mongodbConnection.asPromise();
    }
    
    const {
      transactionId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = await request.json();

    // Verify payment signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpaySignature) {
      const result = await Transaction.updateOne(
        { _id: transactionId },
        {
          $set: {
            paymentStatus: 'COMPLETED' as const,
            razorpayPaymentId
          }
        }
      );

      if (!result.matchedCount) {
        return NextResponse.json(
          { error: 'Transaction not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ status: 'success' });
    }

    return NextResponse.json(
      { error: 'Invalid payment signature' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
} 