import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import { connectToDatabase } from '@/config/mongodb';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { bank, amount, interest, lateFee, total } = await request.json();

    // Validate input
    if (!bank || !amount || !interest || !lateFee || !total) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user and update calculation history
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Add calculation to history
    user.calculationHistory.push({
      date: new Date(),
      bank,
      amount,
      interest,
      lateFee,
      total,
    });

    // Keep only last 10 calculations
    if (user.calculationHistory.length > 10) {
      user.calculationHistory = user.calculationHistory.slice(-10);
    }

    await user.save();

    return NextResponse.json(
      { message: 'Calculation history updated successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error saving calculation history:', error);
    return NextResponse.json(
      { error: 'Failed to save calculation history' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user and get calculation history
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { history: user.calculationHistory },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching calculation history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calculation history' },
      { status: 500 }
    );
  }
} 