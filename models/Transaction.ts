import mongoose, { Document, Model, Schema } from 'mongoose';

export type Bank = 'HDFC' | 'SBI' | 'ICICI' | 'Axis' | 'Kotak' | 'Yes' | 'PNB' | 'IDFC' | 'AmericanExpress' | 'Citibank';
export type PaymentStatus = 'PENDING' | 'COMPLETED';

export interface ITransaction {
  amount: number;
  transactionDate: Date;
  dueDate: Date;
  paymentDate: Date;
  bank: Bank;
  outstandingAmount: number;
  minimumDuePaid: boolean;
  minimumDueAmount: number;
  calculatedInterest: number;
  lateFee: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  razorpayPaymentId?: string;
  createdAt: Date;
}

export interface ITransactionDocument extends ITransaction, Document {}

const transactionSchema = new Schema<ITransactionDocument>({
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
});

const Transaction: Model<ITransactionDocument> = mongoose.models.Transaction || mongoose.model<ITransactionDocument>('Transaction', transactionSchema);

export default Transaction; 