import { NextResponse } from 'next/server';

export async function GET() {
  // Only allow in development and preview environments
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'preview') {
    return NextResponse.json(
      { error: 'This endpoint is not available in production' },
      { status: 403 }
    );
  }

  // Safely get key information without exposing full keys
  const keyInfo = {
    frontend: {
      hasKey: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      keyPrefix: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.substring(0, 12),
      environment: process.env.NODE_ENV
    },
    backend: {
      hasKey: !!process.env.RAZORPAY_KEY_ID,
      keyPrefix: process.env.RAZORPAY_KEY_ID?.substring(0, 12),
      hasSecret: !!process.env.RAZORPAY_KEY_SECRET,
      environment: process.env.NODE_ENV
    },
    build: {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      vercelEnv: process.env.VERCEL_ENV
    }
  };

  return NextResponse.json(keyInfo);
} 