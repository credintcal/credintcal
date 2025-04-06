import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Force rebuild triggered',
    timestamp: new Date().toISOString(),
    buildId: Date.now().toString() 
  });
} 