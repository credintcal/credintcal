import { NextResponse } from 'next/server';

export async function GET() {
  // Only allow in development mode
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  // Return a JSON response with key information
  return NextResponse.json({
    RAZORPAY_KEY_ID: {
      hasKey: Boolean(process.env.RAZORPAY_KEY_ID),
      prefix: process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.substring(0, 6) + '...' : 'missing',
    },
    RAZORPAY_KEY_SECRET: {
      hasKey: Boolean(process.env.RAZORPAY_KEY_SECRET),
      prefix: process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.substring(0, 3) + '...' : 'missing',
    },
    NEXT_PUBLIC_APP_URL: {
      value: process.env.NEXT_PUBLIC_APP_URL || 'missing',
    },
    NEXT_PUBLIC_GA_MEASUREMENT_ID: {
      hasKey: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
      prefix: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'missing',
    },
  });
} 