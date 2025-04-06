import { NextResponse } from 'next/server';
import { calculateDays, calculateInterest, getLateFee } from '../../../utils/calculations';
import mongoose from 'mongoose';
import { connectToDatabase } from '../../../config/mongodb';
import Transaction from '../../../models/Transaction';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Received calculation request:", data);

    // Handle case where only transactionId is provided (payment verification)
    if (data.transactionId && Object.keys(data).length === 1) {
      console.log(`Fetching transaction with ID: ${data.transactionId}`);
      
      try {
        // Ensure connection is established
        await connectToDatabase();
        
        const transaction = await Transaction.findById(data.transactionId);
        if (!transaction) {
          console.error(`Transaction not found: ${data.transactionId}`);
          return NextResponse.json(
            { error: 'Transaction not found' },
            { status: 404 }
          );
        }
        
        console.log(`Found transaction: ${transaction._id}, status: ${transaction.paymentStatus}`);
        
        return NextResponse.json({
          interest: transaction.calculatedInterest,
          lateFee: transaction.lateFee,
          totalAmount: transaction.totalAmount,
          outstandingAmount: transaction.outstandingAmount,
          minimumDueAmount: transaction.minimumDueAmount,
          minimumDuePaid: transaction.minimumDuePaid,
          paymentStatus: transaction.paymentStatus,
          transactionId: transaction._id,
        });
      } catch (error) {
        console.error('Error fetching transaction:', error);
        return NextResponse.json(
          { error: 'Failed to fetch transaction details' },
          { status: 500 }
        );
      }
    }

    // Normal calculation flow
    const {
      bank,
      outstandingAmount,
      transactionAmount,
      transactionDate,
      dueDate,
      paymentDate,
      minimumDueAmount,
      minimumDuePaid,
    } = data;

    // Validate required fields
    if (!bank || !outstandingAmount || !transactionAmount || !transactionDate || !dueDate || !paymentDate) {
      console.error("Missing required fields:", {
        hasBank: !!bank,
        hasOutstandingAmount: !!outstandingAmount,
        hasTransactionAmount: !!transactionAmount,
        hasTransactionDate: !!transactionDate,
        hasDueDate: !!dueDate,
        hasPaymentDate: !!paymentDate
      });
      
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure MongoDB is connected
    console.log("Connecting to MongoDB...");
    try {
      await connectToDatabase();
      console.log("MongoDB connection established");
    } catch (dbError) {
      console.error("MongoDB connection error:", dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Calculate days between transaction and payment dates
    console.log("Calculating days between dates...");
    const days = calculateDays(new Date(transactionDate), new Date(paymentDate));
    console.log(`Days calculated: ${days}`);

    let interest = 0;
    let lateFee = 0;

    // Calculate based on payment timing
    const paymentDateObj = new Date(paymentDate);
    const dueDateObj = new Date(dueDate);

    if (paymentDateObj <= dueDateObj) {
      // Payment made before or on due date - no interest or late fee
      interest = 0;
      lateFee = 0;
      console.log("Payment made before due date - no charges applied");
    } else {
      // Payment made after due date
      interest = calculateInterest(transactionAmount, days);
      console.log(`Interest calculated: ${interest}`);
      
      // Apply late fee only if minimum due wasn't paid
      if (!minimumDuePaid) {
        lateFee = getLateFee(bank, outstandingAmount);
        console.log(`Late fee calculated: ${lateFee} (minimum due not paid)`);
      } else {
        console.log("Minimum due was paid - no late fee applied");
      }
    }

    const totalAmount = interest + lateFee;
    console.log(`Total charges: ${totalAmount}`);

    // Create transaction record
    try {
      console.log("Creating transaction record...");
      const transaction = new Transaction({
        amount: transactionAmount,
        transactionDate: new Date(transactionDate),
        dueDate: new Date(dueDate),
        paymentDate: new Date(paymentDate),
        bank,
        outstandingAmount,
        minimumDuePaid,
        minimumDueAmount: minimumDueAmount || 0,
        calculatedInterest: interest,
        lateFee,
        totalAmount,
        paymentStatus: 'PENDING',
      });

      await transaction.save();
      console.log(`Transaction saved with ID: ${transaction._id}`);

      return NextResponse.json({
        interest,
        lateFee,
        totalAmount,
        outstandingAmount: data.outstandingAmount,
        minimumDueAmount: data.minimumDueAmount || 0,
        minimumDuePaid: data.minimumDuePaid,
        paymentStatus: 'PENDING',
        transactionId: transaction._id,
      });
    } catch (saveError) {
      console.error("Error saving transaction:", saveError);
      return NextResponse.json(
        { error: 'Failed to save transaction' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Calculation error:', error);
    
    // Create a more descriptive error message for debugging
    let errorMessage = 'Failed to calculate fees';
    let errorDetails = {};
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        stack: error.stack,
      };
    } else if (error instanceof mongoose.Error) {
      errorMessage = 'MongoDB error: ' + error.message;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    );
  }
} 