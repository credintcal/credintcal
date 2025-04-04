import mongoose, { Document, Model, Schema } from 'mongoose';
import crypto from 'crypto';

export interface IUser {
  email: string;
  password: string;
  name: string;
  isVerified: boolean;
  registrationDate: Date;
  lastLogin: Date;
  transactions: mongoose.Types.ObjectId[];
  discountEligible: boolean;
  verificationToken: string;
  verificationTokenExpiry: Date;
  resetPasswordToken: string;
  resetPasswordTokenExpiry: Date;
  calculationHistory: {
    date: Date;
    bank: string;
    amount: number;
    interest: number;
    lateFee: number;
    total: number;
  }[];
  lastPaymentDate: Date;
  paymentCount: number;
}

export interface IUserDocument extends IUser, Document {
  generateVerificationToken(): { token: string; expiresAt: Date };
  generatePasswordResetToken(): { token: string; expiresAt: Date };
  checkDiscountEligibility(): boolean;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    transactions: [{
      type: Schema.Types.ObjectId,
      ref: 'Transaction'
    }],
    discountEligible: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    calculationHistory: [{
      date: {
        type: Date,
        default: Date.now,
      },
      bank: String,
      amount: Number,
      interest: Number,
      lateFee: Number,
      total: Number,
    }],
    lastPaymentDate: Date,
    paymentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Email validation
userSchema.path('email').validate(async function(email: string) {
  const emailCount = await (this as any).constructor.countDocuments({ email });
  return !emailCount;
}, 'Email already exists');

// Method to generate verification token
userSchema.methods.generateVerificationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours
  
  this.verificationToken = token;
  this.verificationTokenExpiry = expiresAt;
  
  return { token, expiresAt };
};

// Method to generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour
  
  this.resetPasswordToken = token;
  this.resetPasswordTokenExpiry = expiresAt;
  
  return { token, expiresAt };
};

// Method to check discount eligibility
userSchema.methods.checkDiscountEligibility = function() {
  if (!this.lastPaymentDate) return false;
  
  const now = new Date();
  const monthsSinceLastPayment = (now.getFullYear() - this.lastPaymentDate.getFullYear()) * 12 +
    (now.getMonth() - this.lastPaymentDate.getMonth());
  
  // Eligible for discount if:
  // 1. Made at least 3 payments
  // 2. Last payment was within last 6 months
  return this.paymentCount >= 3 && monthsSinceLastPayment <= 6;
};

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ registrationDate: 1 });
userSchema.index({ verificationToken: 1 });
userSchema.index({ resetPasswordToken: 1 });

const User = (mongoose.models.User as Model<IUserDocument>) || 
            mongoose.model<IUserDocument>('User', userSchema);

export default User; 