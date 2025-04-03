import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDatabase } from '@/config/mongodb';
import { sendPasswordResetEmail } from '@/utils/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return NextResponse.json(
        { message: 'If an account exists with this email, a password reset link will be sent.' },
        { status: 200 }
      );
    }

    // Generate password reset token
    const { token } = user.generatePasswordResetToken();
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(email, user.name, token);

    return NextResponse.json(
      { message: 'If an account exists with this email, a password reset link will be sent.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
} 