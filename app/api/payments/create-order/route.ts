"use server";

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// Create Razorpay instance - create only when needed
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
  });
};

export async function POST(request: NextRequest) {
  try {
    // Get amount from request body
    const body = await request.json();
    const { amount } = body;
    
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }
    
    // Initialize Razorpay only when needed
    const razorpay = getRazorpayInstance();
    
    // Create an order
    const options = {
      amount: amount, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };
    
    const order = await razorpay.orders.create(options);
    
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating payment order:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
} 