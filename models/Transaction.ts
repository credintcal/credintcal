import mongoose, { Document } from 'mongoose';

interface ITransaction extends Document {
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

const transactionSchema = new mongoose.Schema({
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

const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction; 