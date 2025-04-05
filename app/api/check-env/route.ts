import { NextResponse } from 'next/server';

export async function GET() {
  // Only allow this endpoint in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  // Check for Razorpay keys
  const razorpayKeyStatus = {
    RAZORPAY_KEY_ID: Boolean(process.env.RAZORPAY_KEY_ID),
    RAZORPAY_KEY_SECRET: Boolean(process.env.RAZORPAY_KEY_SECRET),
    NEXT_PUBLIC_RAZORPAY_KEY_ID: Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID),
  };

  // Check for next-auth keys
  const authKeyStatus = {
    NEXTAUTH_SECRET: Boolean(process.env.NEXTAUTH_SECRET),
    NEXTAUTH_URL: Boolean(process.env.NEXTAUTH_URL),
  };

  // Check for MongoDB
  const databaseKeyStatus = {
    MONGODB_URI: Boolean(process.env.MONGODB_URI),
  };

  // Check for Email service
  const emailKeyStatus = {
    BREVO_API_KEY: Boolean(process.env.BREVO_API_KEY),
  };

  // Global site settings
  const siteKeyStatus = {
    NEXT_PUBLIC_APP_URL: Boolean(process.env.NEXT_PUBLIC_APP_URL),
  };

  // Check if key IDs match public and server values
  const razorpayKeyMatch = process.env.RAZORPAY_KEY_ID === process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  return NextResponse.json({
    razorpay: razorpayKeyStatus,
    auth: authKeyStatus,
    database: databaseKeyStatus,
    email: emailKeyStatus,
    site: siteKeyStatus,
    checks: {
      razorpayKeyMatch,
    },
    message: 'Environment variable status check completed'
  });
} 