import { NextResponse } from 'next/server';
import { calculateDays, calculateInterest, getLateFee } from '../../../utils/calculations';
import mongodbConnection from '../../../config/mongodb';
import Transaction from '../../../models/Transaction';

export async function POST(request: Request) {
  try {
    const data = await request.json();
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

    // Ensure MongoDB is connected
    if (mongodbConnection.readyState !== 1) {
      await mongodbConnection.asPromise();
    }

    // Calculate days between transaction and payment dates
    const days = calculateDays(new Date(transactionDate), new Date(paymentDate));

    let interest = 0;
    let lateFee = 0;

    // Calculate based on payment timing
    const paymentDateObj = new Date(paymentDate);
    const dueDateObj = new Date(dueDate);

    if (paymentDateObj <= dueDateObj) {
      // Payment made before or on due date - no interest or late fee
      interest = 0;
      lateFee = 0;
    } else {
      // Payment made after due date
      interest = calculateInterest(transactionAmount, days);
      
      // Apply late fee only if minimum due wasn't paid
      if (!minimumDuePaid) {
        lateFee = getLateFee(bank, outstandingAmount);
      }
    }

    const totalAmount = interest + lateFee;

    // Create transaction record
    const transaction = new Transaction({
      amount: transactionAmount,
      transactionDate: new Date(transactionDate),
      dueDate: new Date(dueDate),
      paymentDate: new Date(paymentDate),
      bank,
      outstandingAmount,
      minimumDuePaid,
      minimumDueAmount,
      calculatedInterest: interest,
      lateFee,
      totalAmount,
      paymentStatus: 'PENDING',
    });

    await transaction.save();

    return NextResponse.json({
      interest,
      lateFee,
      totalAmount,
      paymentStatus: 'PENDING',
      transactionId: transaction._id,
    });
  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate fees' },
      { status: 500 }
    );
  }
} 