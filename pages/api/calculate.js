// Legacy API route for compatibility
import { calculateDays, calculateInterest, getLateFee } from '../../utils/calculations';
import mongoose from 'mongoose';
import Transaction from '../../models/Transaction';

// Initialize MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
const options = {
  bufferCommands: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
};

// Connect to MongoDB
async function connectToMongoDB() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }
  
  console.log('Connecting to MongoDB on demand (legacy route)');
  return mongoose.connect(MONGODB_URI, options);
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const data = req.body;
    console.log("Legacy route: Received calculation request:", data);

    // Handle case where only transactionId is provided (payment verification)
    if (data.transactionId && Object.keys(data).length === 1) {
      console.log(`Legacy route: Fetching transaction with ID: ${data.transactionId}`);
      
      try {
        // Ensure connection is established
        await connectToMongoDB();
        
        const transaction = await Transaction.findById(data.transactionId);
        if (!transaction) {
          console.error(`Legacy route: Transaction not found: ${data.transactionId}`);
          return res.status(404).json({ error: 'Transaction not found' });
        }
        
        console.log(`Legacy route: Found transaction: ${transaction._id}, status: ${transaction.paymentStatus}`);
        
        return res.status(200).json({
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
        console.error('Legacy route: Error fetching transaction:', error);
        return res.status(500).json({ error: 'Failed to fetch transaction details' });
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
      console.error("Legacy route: Missing required fields:", {
        hasBank: !!bank,
        hasOutstandingAmount: !!outstandingAmount,
        hasTransactionAmount: !!transactionAmount,
        hasTransactionDate: !!transactionDate,
        hasDueDate: !!dueDate,
        hasPaymentDate: !!paymentDate
      });
      
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Ensure MongoDB is connected
    console.log("Legacy route: Connecting to MongoDB...");
    try {
      await connectToMongoDB();
      console.log("Legacy route: MongoDB connection established");
    } catch (dbError) {
      console.error("Legacy route: MongoDB connection error:", dbError);
      return res.status(500).json({ error: 'Database connection failed' });
    }

    // Calculate days between transaction and payment dates
    console.log("Legacy route: Calculating days between dates...");
    const days = calculateDays(new Date(transactionDate), new Date(paymentDate));
    console.log(`Legacy route: Days calculated: ${days}`);

    let interest = 0;
    let lateFee = 0;

    // Calculate based on payment timing
    const paymentDateObj = new Date(paymentDate);
    const dueDateObj = new Date(dueDate);

    if (paymentDateObj <= dueDateObj) {
      // Payment made before or on due date - no interest or late fee
      interest = 0;
      lateFee = 0;
      console.log("Legacy route: Payment made before due date - no charges applied");
    } else {
      // Payment made after due date
      interest = calculateInterest(transactionAmount, days);
      console.log(`Legacy route: Interest calculated: ${interest}`);
      
      // Apply late fee only if minimum due wasn't paid
      if (!minimumDuePaid) {
        lateFee = getLateFee(bank, outstandingAmount);
        console.log(`Legacy route: Late fee calculated: ${lateFee} (minimum due not paid)`);
      } else {
        console.log("Legacy route: Minimum due was paid - no late fee applied");
      }
    }

    const totalAmount = interest + lateFee;
    console.log(`Legacy route: Total charges: ${totalAmount}`);

    // Create transaction record
    try {
      console.log("Legacy route: Creating transaction record...");
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
      console.log(`Legacy route: Transaction saved with ID: ${transaction._id}`);

      return res.status(200).json({
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
      console.error("Legacy route: Error saving transaction:", saveError);
      return res.status(500).json({ error: 'Failed to save transaction' });
    }
  } catch (error) {
    console.error('Legacy route: Calculation error:', error);
    
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
    
    return res.status(500).json({ 
      error: errorMessage,
      details: errorDetails
    });
  }
} 