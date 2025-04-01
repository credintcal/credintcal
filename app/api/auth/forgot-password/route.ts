import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDatabase } from '@/config/mongodb';
import { sendPasswordResetEmail } from '@/utils/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email });
    
    // If no user found, still return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { message: 'If an account with that email exists, we have sent a password reset link' },
        { status: 200 }
      );
    }

    // Generate password reset token
    const { token } = user.generatePasswordResetToken();
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(email, user.name, token);

    return NextResponse.json(
      { message: 'If an account with that email exists, we have sent a password reset link' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 