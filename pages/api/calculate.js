// Legacy API route for compatibility
import { calculateDays, calculateInterest, getLateFee } from '../../utils/calculations';
import mongoose from 'mongoose';
import Transaction from '../../models/Transaction';

// Initialize MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// Handle uncaught promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Connect to MongoDB with simplified approach
const connectToMongoDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log('Using existing MongoDB connection');
      return;
    }
    
    if (!MONGODB_URI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }
    
    // Validate MongoDB URI format
    if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
      console.error('Invalid MongoDB URI format:', 
                    MONGODB_URI.substring(0, 15) + '...');
      throw new Error('Invalid MongoDB URI format. URI must start with mongodb:// or mongodb+srv://');
    }
    
    console.log('Connecting to MongoDB...', 
                MONGODB_URI ? MONGODB_URI.split('@')[1] : 'URI missing');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
    
    console.log('MongoDB connected successfully');
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

// Safety check for MongoDB connection
const ensureTransaction = () => {
  // If model is not available yet
  if (!mongoose.models.Transaction) {
    console.log('Transaction model not found, creating schema');
    
    // Create transaction schema
    const transactionSchema = new mongoose.Schema({
      amount: { type: Number, required: true },
      transactionDate: { type: Date, required: true },
      dueDate: { type: Date, required: true },
      paymentDate: { type: Date, required: true },
      bank: { 
        type: String, 
        required: true,
        enum: ['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Yes', 'PNB', 'IDFC', 'AmericanExpress', 'Citibank'],
      },
      outstandingAmount: { type: Number, required: true },
      minimumDuePaid: { type: Boolean, required: true },
      minimumDueAmount: { type: Number, required: true },
      calculatedInterest: { type: Number, default: 0 },
      lateFee: { type: Number, default: 0 },
      totalAmount: { type: Number, default: 0 },
      paymentStatus: {
        type: String,
        enum: ['PENDING', 'COMPLETED'],
        default: 'PENDING',
      },
      razorpayPaymentId: { type: String },
      createdAt: { type: Date, default: Date.now },
    }, {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    });
    
    // Register the model directly
    mongoose.model('Transaction', transactionSchema);
  }
  
  return mongoose.models.Transaction;
};

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    console.log('== New calculation request received ==');
    
    // Ensure MongoDB is connected
    try {
      await connectToMongoDB();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return res.status(500).json({
        error: 'Database connection failed',
        details: dbError.message,
        mongoUri: MONGODB_URI ? `${MONGODB_URI.substring(0, 10)}...` : 'undefined'
      });
    }
    
    // Get transaction model
    const Transaction = ensureTransaction();
    
    // Parse request body
    let data;
    try {
      data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      console.log('Request data:', { ...data, body_type: typeof req.body });
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return res.status(400).json({
        error: 'Invalid request data',
        details: parseError.message
      });
    }

    // Handle case where only transactionId is provided (payment verification)
    if (data.transactionId && Object.keys(data).length === 1) {
      console.log(`Fetching transaction with ID: ${data.transactionId}`);
      
      try {
        const transaction = await Transaction.findById(data.transactionId);
        if (!transaction) {
          console.error(`Transaction not found: ${data.transactionId}`);
          return res.status(404).json({ 
            error: 'Transaction not found',
            transactionId: data.transactionId
          });
        }
        
        console.log(`Found transaction: ${transaction._id}`);
        
        return res.status(200).json({
          interest: transaction.calculatedInterest,
          lateFee: transaction.lateFee,
          totalAmount: transaction.totalAmount,
          outstandingAmount: transaction.outstandingAmount,
          minimumDueAmount: transaction.minimumDueAmount,
          minimumDuePaid: transaction.minimumDuePaid,
          paymentStatus: transaction.paymentStatus,
          transactionId: transaction._id.toString(),
        });
      } catch (error) {
        console.error('Error fetching transaction:', error);
        return res.status(500).json({ 
          error: 'Failed to fetch transaction details',
          details: error.message 
        });
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
      
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: {
          bank,
          outstandingAmount,
          transactionAmount,
          transactionDate,
          dueDate,
          paymentDate,
        }
      });
    }

    // Calculate days between transaction and payment dates
    console.log("Calculating days between dates...");
    
    try {
      // Parse dates
      const txnDate = new Date(transactionDate);
      const payDate = new Date(paymentDate);
      const dDate = new Date(dueDate);
      
      // Validate dates
      if (isNaN(txnDate.getTime()) || isNaN(payDate.getTime()) || isNaN(dDate.getTime())) {
        throw new Error('Invalid date format');
      }
      
      const days = calculateDays(txnDate, payDate);
      console.log(`Days calculated: ${days}`);

      let interest = 0;
      let lateFee = 0;

      // Calculate based on payment timing
      if (payDate <= dDate) {
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
      console.log("Creating transaction record...");
      
      try {
        const transaction = new Transaction({
          amount: transactionAmount,
          transactionDate: txnDate,
          dueDate: dDate,
          paymentDate: payDate,
          bank,
          outstandingAmount,
          minimumDuePaid: !!minimumDuePaid,
          minimumDueAmount: minimumDueAmount || 0,
          calculatedInterest: interest,
          lateFee,
          totalAmount,
          paymentStatus: 'PENDING',
        });

        await transaction.save();
        console.log(`Transaction saved with ID: ${transaction._id}`);

        return res.status(200).json({
          interest,
          lateFee,
          totalAmount,
          outstandingAmount: data.outstandingAmount,
          minimumDueAmount: data.minimumDueAmount || 0,
          minimumDuePaid: data.minimumDuePaid,
          paymentStatus: 'PENDING',
          transactionId: transaction._id.toString(),
        });
      } catch (saveError) {
        console.error("Error saving transaction:", saveError);
        return res.status(500).json({ 
          error: 'Failed to save transaction',
          details: saveError.message
        });
      }
    } catch (calcError) {
      console.error("Error in calculation process:", calcError);
      return res.status(500).json({ 
        error: 'Calculation error',
        details: calcError.message
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    
    // Create a more descriptive error message for debugging
    let errorMessage = 'Failed to calculate fees';
    let errorDetails = {};
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 3).join('\n') || 'No stack trace',
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