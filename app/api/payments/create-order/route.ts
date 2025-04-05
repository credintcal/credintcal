import { NextResponse } from 'next/server';
import { getRazorpayInstance } from '@/config/razorpay';

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Get a Razorpay instance only when handling a request
    const razorpay = getRazorpayInstance();
    
    console.log('Creating Razorpay order for amount:', amount);
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
    console.log('Razorpay order created:', order.id);

    return NextResponse.json(
      { orderId: order.id },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 