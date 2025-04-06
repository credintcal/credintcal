import { NextResponse } from 'next/server';

export async function GET() {
  // Check for environment variables
  const envVariables = {
    // Razorpay keys
    RAZORPAY_KEY_ID: Boolean(process.env.RAZORPAY_KEY_ID),
    RAZORPAY_KEY_SECRET: Boolean(process.env.RAZORPAY_KEY_SECRET),
    NEXT_PUBLIC_RAZORPAY_KEY_ID: Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID),
    
    // Analytics
    NEXT_PUBLIC_GA_MEASUREMENT_ID: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
    
    // Application URL
    NEXT_PUBLIC_APP_URL: Boolean(process.env.NEXT_PUBLIC_APP_URL),
  };

  // Check if all required variables are present
  const missingVariables = Object.entries(envVariables)
    .filter(([_, exists]) => !exists)
    .map(([name]) => name);

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    allVariablesPresent: missingVariables.length === 0,
    missingVariables,
    variables: envVariables
  });
} 