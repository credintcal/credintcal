"use server";

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// Create Razorpay instance with hardcoded credentials for reliability
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    console.error("Razorpay credentials missing", { 
      hasKeyId: !!key_id, 
      hasKeySecret: !!key_secret 
    });
    throw new Error("Razorpay credentials are not configured properly");
  }

  console.log("Initializing Razorpay with key ID:", key_id.substring(0, 10) + "...");
  
  return new Razorpay({
    key_id: key_id,
    key_secret: key_secret
  });
};

export async function POST(request: NextRequest) {
  try {
    // Get amount from request body
    const body = await request.json();
    const { amount } = body;
    
    console.log("Order creation request received:", { amount });
    
    if (!amount || amount <= 0) {
      console.error("Invalid amount provided:", amount);
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
    
    console.log("Creating Razorpay order with options:", options);
    const order = await razorpay.orders.create(options);
    console.log("Razorpay order created successfully:", { 
      orderId: order.id, 
      amount: order.amount,
      status: order.status
    });
    
    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Error creating payment order:", error);
    // Include more detailed error information
    return NextResponse.json(
      { 
        error: "Failed to create payment order", 
        message: error.message || "Unknown error",
        details: error.stack || ""
      },
      { status: 500 }
    );
  }
} 