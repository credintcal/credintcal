"use server";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get payment details
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = body;
    
    // Validate payment - verify signature
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment information" },
        { status: 400 }
      );
    }
    
    // Create a signature to compare with the one from Razorpay
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    
    // Verify the payment
    const isSignatureValid = generated_signature === razorpay_signature;
    
    if (isSignatureValid) {
      // Save payment information to database here if needed
      
      return NextResponse.json({
        verified: true,
        payment_id: razorpay_payment_id
      });
    } else {
      return NextResponse.json(
        { verified: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { verified: false, error: "Payment verification failed" },
      { status: 500 }
    );
  }
} 