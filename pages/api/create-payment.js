import Razorpay from 'razorpay';
import crypto from 'crypto';
import mongoose from 'mongoose';

// Initialize MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
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
  try {
    console.log(`Payment API called with method: ${req.method}`);
    // Connect to MongoDB
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
    
    if (req.method === 'POST') {
      const { transactionId } = req.body;
      
      if (!transactionId) {
        return res.status(400).json({ error: 'Transaction ID is required' });
      }
      
      console.log(`Creating Razorpay order for transaction: ${transactionId}`);
      
      try {
        // Create Razorpay order for ₹10
        const order = await razorpay.orders.create({
          amount: 1000, // Amount in paise (₹10)
          currency: 'INR',
          receipt: transactionId,
        });
        
        console.log(`Razorpay order created: ${order.id}`);
        
        return res.status(200).json({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
        });
      } catch (error) {
        console.error('Payment creation error:', error);
        return res.status(500).json({ 
          error: 'Failed to create payment',
          details: error.message
        });
      }
    } else if (req.method === 'PUT') {
      const {
        transactionId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      } = req.body;
      
      if (!transactionId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
        return res.status(400).json({ error: 'Missing payment verification parameters' });
      }
      
      console.log(`Verifying payment for transaction: ${transactionId}`);
      
      // Verify payment signature
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(body.toString())
        .digest('hex');
        
      console.log(`Signature verification: ${expectedSignature === razorpaySignature ? 'SUCCESS' : 'FAILED'}`);
      
      if (expectedSignature === razorpaySignature) {
        const result = await Transaction.updateOne(
          { _id: transactionId },
          {
            $set: {
              paymentStatus: 'COMPLETED',
              razorpayPaymentId
            }
          }
        );

        if (!result.matchedCount) {
          console.error(`Transaction not found: ${transactionId}`);
          return res.status(404).json({ error: 'Transaction not found' });
        }
        
        console.log(`Payment completed for transaction: ${transactionId}`);
        return res.status(200).json({ status: 'success' });
      }
      
      return res.status(400).json({ error: 'Invalid payment signature' });
    } else {
      // Method not allowed
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Payment API error:', error);
    return res.status(500).json({ 
      error: 'Payment processing error',
      message: error.message
    });
  }
} 