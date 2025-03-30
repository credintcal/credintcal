import { NextResponse } from 'next/server';
import { calculateDays, calculateInterest, getLateFee } from '../../../utils/calculations';
import connectDB from '../../../config/mongodb';
import Transaction from '../../../models/Transaction';
import { parse } from 'pdf-parse';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jsonData = formData.get('data') as string;
    const data = JSON.parse(jsonData);

    const {
      bank,
      outstandingAmount,
      dueDate,
      paymentDate,
      startDate,
      endDate,
      minimumDueAmount,
      minimumDuePaid,
      pdfPassword,
    } = data;

    if (!file) {
      return NextResponse.json(
        { error: 'No PDF file provided' },
        { status: 400 }
      );
    }

    // Read and parse PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await parse(buffer);

    // Extract transactions from PDF content
    // This is a placeholder - actual implementation would depend on bank's PDF format
    const transactions = extractTransactions(pdfData.text, startDate, endDate);

    // Connect to MongoDB
    await connectDB();

    let totalInterest = 0;
    let lateFee = 0;

    // Calculate interest for each transaction
    for (const transaction of transactions) {
      const days = calculateDays(
        new Date(transaction.date),
        new Date(paymentDate)
      );

      const paymentDateObj = new Date(paymentDate);
      const dueDateObj = new Date(dueDate);

      if (paymentDateObj > dueDateObj) {
        const transactionInterest = calculateInterest(transaction.amount, days);
        totalInterest += transactionInterest;

        if (!minimumDuePaid) {
          lateFee = getLateFee(bank, outstandingAmount);
        }
      }

      // Save transaction to database
      const transactionRecord = new Transaction({
        amount: transaction.amount,
        transactionDate: new Date(transaction.date),
        dueDate: new Date(dueDate),
        paymentDate: new Date(paymentDate),
        bank,
        outstandingAmount,
        minimumDuePaid,
        minimumDueAmount,
        calculatedInterest: totalInterest,
        lateFee,
        totalAmount: totalInterest + lateFee,
        paymentStatus: 'PENDING',
      });

      await transactionRecord.save();
    }

    const totalAmount = totalInterest + lateFee;

    return NextResponse.json({
      interest: totalInterest,
      lateFee,
      totalAmount,
      paymentStatus: 'PENDING',
      transactionCount: transactions.length,
    });
  } catch (error) {
    console.error('PDF processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 }
    );
  }
}

// Placeholder function for transaction extraction
function extractTransactions(
  pdfText: string,
  startDate: string,
  endDate: string
): Array<{ date: string; amount: number }> {
  // This is a placeholder implementation
  // Actual implementation would need to parse bank-specific PDF formats
  const transactions: Array<{ date: string; amount: number }> = [];

  // Example regex pattern - would need to be customized per bank
  const transactionPattern = /(\d{2}\/\d{2}\/\d{4})\s+([0-9,]+\.\d{2})/g;
  let match;

  const start = new Date(startDate);
  const end = new Date(endDate);

  while ((match = transactionPattern.exec(pdfText)) !== null) {
    const date = match[1];
    const amount = parseFloat(match[2].replace(/,/g, ''));
    const transactionDate = new Date(date);

    if (transactionDate >= start && transactionDate <= end) {
      transactions.push({ date, amount });
    }
  }

  return transactions;
} 