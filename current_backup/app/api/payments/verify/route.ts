"use server";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("Payment verification request received:", {
      ...body,
      razorpay_signature: body.razorpay_signature ? "[HIDDEN]" : undefined
    });
    
    // Get payment details
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = body;
    
    // Validate payment - verify signature
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      console.error("Missing payment information", { 
        hasPaymentId: !!razorpay_payment_id,
        hasOrderId: !!razorpay_order_id,
        hasSignature: !!razorpay_signature 
      });
      
      return NextResponse.json(
        { error: "Missing payment information" },
        { status: 400 }
      );
    }
    
    // Get the secret key
    const secret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!secret) {
      console.error("Razorpay secret key missing");
      return NextResponse.json(
        { verified: false, error: "Payment verification configuration error" },
        { status: 500 }
      );
    }
    
    console.log("Generating signature for verification");
    
    // Create a signature to compare with the one from Razorpay
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    
    console.log("Signature verification:", { 
      signatureMatch: generated_signature === razorpay_signature,
      receivedSignatureLength: razorpay_signature.length,
      generatedSignatureLength: generated_signature.length
    });
    
    // Verify the payment
    const isSignatureValid = generated_signature === razorpay_signature;
    
    if (isSignatureValid) {
      // Save payment information to database here if needed
      console.log("Payment verified successfully:", { 
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id 
      });
      
      return NextResponse.json({
        verified: true,
        payment_id: razorpay_payment_id
      });
    } else {
      console.error("Invalid payment signature", {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });
      
      return NextResponse.json(
        { verified: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    
    return NextResponse.json(
      { 
        verified: false, 
        error: "Payment verification failed",
        message: error.message || "Unknown error",
        details: error.stack || ""
      },
      { status: 500 }
    );
  }
} 