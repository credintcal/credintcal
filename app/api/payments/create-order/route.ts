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
  
  try {
    return new Razorpay({
      key_id: key_id,
      key_secret: key_secret
    });
  } catch (error) {
    console.error("Failed to initialize Razorpay instance:", error);
    throw new Error("Failed to initialize Razorpay: " + (error as Error).message);
  }
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
    
    // Check for Razorpay credentials in environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay credentials missing in environment variables");
      return NextResponse.json(
        { error: "Payment processing configuration error" },
        { status: 500 }
      );
    }
    
    // Log environment variables (without exposing full secret)
    console.log("Environment check:", { 
      keyId: process.env.RAZORPAY_KEY_ID,
      keyIdLength: process.env.RAZORPAY_KEY_ID?.length,
      secretFirstChar: process.env.RAZORPAY_KEY_SECRET?.substring(0, 3) + "...",
      secretLength: process.env.RAZORPAY_KEY_SECRET?.length,
      nodeEnv: process.env.NODE_ENV
    });
    
    // Initialize Razorpay only when needed
    const razorpay = getRazorpayInstance();
    
    // Create an order
    const options = {
      amount: amount, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        source: "credintcal"
      }
    };
    
    console.log("Creating Razorpay order with options:", options);
    
    try {
      const order = await razorpay.orders.create(options);
      console.log("Razorpay order created successfully:", { 
        orderId: order.id, 
        amount: order.amount,
        status: order.status
      });
      
      return NextResponse.json(order);
    } catch (orderError: any) {
      // More detailed error handling for order creation
      console.error("Razorpay order creation failed:", {
        error: orderError,
        message: orderError.message,
        httpStatus: orderError.statusCode,
        description: orderError.description || "No description provided"
      });
      
      // Return a more informative error response
      return NextResponse.json(
        { 
          error: "Failed to create payment order with Razorpay", 
          message: orderError.error?.description || orderError.message || "Unknown error",
          code: orderError.code || "UNKNOWN_ERROR"
        },
        { status: orderError.statusCode || 500 }
      );
    }
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