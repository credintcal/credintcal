import { NextResponse } from 'next/server';
import { calculateDays, calculateInterest, calculateMultipleInterest, getLateFee, calculateTotal } from '../../../utils/calculations';
import mongodbConnection from '../../../config/mongodb';
import Transaction from '../../../models/Transaction';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Ensure MongoDB is connected
    if (mongodbConnection.readyState !== 1) {
      await mongodbConnection.asPromise();
    }

    // Check if this is a request to fetch a transaction by ID
    if (data.transactionId && !data.outstandingAmount) {
      const transaction = await Transaction.findById(data.transactionId);
      
      if (!transaction) {
        return NextResponse.json(
          { error: 'Transaction not found' },
          { status: 404 }
        );
      }
      
      // Return complete transaction details
      return NextResponse.json({
        interest: transaction.calculatedInterest,
        lateFee: transaction.lateFee,
        totalAmount: transaction.totalAmount,
        outstandingAmount: transaction.outstandingAmount,
        minimumDueAmount: transaction.minimumDueAmount,
        minimumDuePaid: transaction.minimumDuePaid,
        paymentStatus: transaction.paymentStatus,
        transactionId: transaction._id,
        transactions: transaction.transactions
      });
    }

    // Regular calculation flow continues below
    const {
      bank,
      outstandingAmount,
      transactions, // Array of transactions
      dueDate,
      paymentDate,
      minimumDueAmount,
      minimumDuePaid,
    } = data;

    // Validate transactions
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return NextResponse.json(
        { error: 'At least one transaction is required' },
        { status: 400 }
      );
    }

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
      // Payment made after due date - calculate interest for each transaction
      interest = calculateMultipleInterest(
        transactions.map(t => ({
          amount: t.amount,
          transactionDate: new Date(t.transactionDate)
        })),
        paymentDateObj
      );
      
      // Apply late fee only if minimum due wasn't paid
      if (!minimumDuePaid) {
        lateFee = getLateFee(bank, outstandingAmount);
      }
    }

    // Calculate total amount
    const totalAmount = calculateTotal(
      interest,
      lateFee,
      outstandingAmount,
      minimumDueAmount,
      minimumDuePaid
    );

    // Create transaction record
    const transaction = new Transaction({
      transactions: transactions.map(t => ({
        amount: t.amount,
        transactionDate: new Date(t.transactionDate)
      })),
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
      outstandingAmount: data.outstandingAmount,
      minimumDueAmount: data.minimumDueAmount,
      minimumDuePaid: data.minimumDuePaid,
      paymentStatus: 'PENDING',
      transactionId: transaction._id,
      transactions: transactions
    });
  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate fees' },
      { status: 500 }
    );
  }
} 