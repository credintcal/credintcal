import { NextResponse } from 'next/server';

export async function GET() {
  // Only allow in development mode
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  const authKeys = {
    NEXTAUTH_SECRET: {
      hasKey: Boolean(process.env.NEXTAUTH_SECRET),
      prefix: process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET.substring(0, 6) + '...' : 'missing',
    },
    NEXTAUTH_URL: {
      value: process.env.NEXTAUTH_URL || 'missing',
    },
    NEXT_PUBLIC_APP_URL: {
      value: process.env.NEXT_PUBLIC_APP_URL || 'missing',
    },
  };

  const databaseKeys = {
    DATABASE_URL: {
      hasKey: Boolean(process.env.DATABASE_URL),
      prefix: process.env.DATABASE_URL 
        ? process.env.DATABASE_URL.split('://')[0] + '://' + '...' 
        : 'missing',
    },
  };

  return NextResponse.json({
    auth: authKeys,
    database: databaseKeys,
    timestamp: new Date().toISOString(),
  });
} 