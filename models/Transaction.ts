import mongoose, { Document, Model, Schema } from 'mongoose';

// Mongoose might not be initialized in Next.js when models are imported
// This is a workaround for "MongooseError: The `uri` parameter to `openUri()` must be a string"
const MONGODB_URI = process.env.MONGODB_URI || '';
let conn: typeof mongoose | null = null;

// Interface for individual transactions
export interface ITransactionDetail {
  amount: number;
  transactionDate: Date;
}

export interface ITransaction {
  transactions: ITransactionDetail[];  // Array of transactions
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
  createdAt: Date;
}

export interface ITransactionDocument extends ITransaction, Document {}

// Schema for individual transaction
const transactionDetailSchema = new Schema<ITransactionDetail>({
  amount: {
    type: Number,
    required: true,
  },
  transactionDate: {
    type: Date,
    required: true,
  },
});

const transactionSchema = new Schema<ITransactionDocument>(
  {
    transactions: {
      type: [transactionDetailSchema],
      required: true,
      validate: {
        validator: function(transactions: ITransactionDetail[]) {
          return transactions.length > 0;
        },
        message: "At least one transaction is required"
      }
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
      default: 'COMPLETED', // Default to COMPLETED to show full results
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