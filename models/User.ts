import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  name: string;
  isVerified: boolean;
  registrationDate: Date;
  lastLogin: Date;
  transactions: mongoose.Types.ObjectId[];
  discountEligible: boolean;
}

export interface IUserDocument extends IUser, Document {}

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
    }
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

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ registrationDate: 1 });

const User = (mongoose.models.User as Model<IUserDocument>) || 
            mongoose.model<IUserDocument>('User', userSchema);

export default User; 