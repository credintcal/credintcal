import { NextResponse } from 'next/server';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/config/mongodb';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    // Validate input
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { message: 'Password has been reset successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
} 