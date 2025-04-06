import mongoose, { Document, Model, Schema } from 'mongoose';

// Mongoose might not be initialized in Next.js when models are imported
// This is a workaround for "MongooseError: The `uri` parameter to `openUri()` must be a string"
const MONGODB_URI = process.env.MONGODB_URI || '';
let conn: typeof mongoose | null = null;

export interface ITransaction {
  amount: number;
  transactionDate: Date;
  dueDate: Date;
  paymentDate: Date;
  bank: 'HDFC' | 'SBI' | 'ICICI' | 'Axis' | 'Kotak' | 'Yes' | 'PNB' | 'IDFC' | 'AmericanExpress' | 'Citibank';
  outstandingAmount: number;
  minimumDuePaid: boolean;
  minimumDueAmount: number;
  calculatedInterest: number;
  lateFee: number;
  totalAmount: number;
  paymentStatus: 'PENDING' | 'COMPLETED';
  razorpayPaymentId?: string;
  createdAt: Date;
}

export interface ITransactionDocument extends ITransaction, Document {}

const transactionSchema = new Schema<ITransactionDocument>(
  {
    amount: {
      type: Number,
      required: true,
    },
    transactionDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    bank: {
      type: String,
      required: true,
      enum: ['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Yes', 'PNB', 'IDFC', 'AmericanExpress', 'Citibank'],
    },
    outstandingAmount: {
      type: Number,
      required: true,
    },
    minimumDuePaid: {
      type: Boolean,
      required: true,
    },
    minimumDueAmount: {
      type: Number,
      required: true,
    },
    calculatedInterest: {
      type: Number,
      default: 0,
    },
    lateFee: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'COMPLETED'],
      default: 'PENDING',
    },
    razorpayPaymentId: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Enable virtuals
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Use this check to handle Next.js SSR - models can be loaded multiple times but should only be compiled once
const Transaction = (mongoose.models.Transaction as Model<ITransactionDocument>) || 
                   mongoose.model<ITransactionDocument>('Transaction', transactionSchema);

export default Transaction; 