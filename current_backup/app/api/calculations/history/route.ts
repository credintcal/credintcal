import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/config/mongodb';
import mongoose from 'mongoose';

// Define a simple schema for storing calculations without user authentication
const calculationSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  bank: { type: String, required: true },
  amount: { type: Number, required: true },
  interest: { type: Number, required: true },
  lateFee: { type: Number, required: true },
  total: { type: Number, required: true },
  ip: { type: String },
  userAgent: { type: String },
});

// Create or get the model
const Calculation = mongoose.models.Calculation || 
  mongoose.model('Calculation', calculationSchema);

export async function POST(request: Request) {
  try {
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

    // Create a new calculation record
    const calculationData = {
      date: new Date(),
      bank,
      amount,
      interest,
      lateFee,
      total,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    await Calculation.create(calculationData);

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
    // Connect to database
    await connectToDatabase();

    // Get IP to identify calculations from same source
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Get the 10 most recent calculations for this IP
    const history = await Calculation.find({ ip: clientIp })
      .sort({ date: -1 })
      .limit(10)
      .lean();

    return NextResponse.json(
      { history },
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