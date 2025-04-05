import { NextResponse } from 'next/server';

export async function GET() {
  // Check for default NextAuth environment variables
  const authStatus = {
    NEXTAUTH_SECRET: Boolean(process.env.NEXTAUTH_SECRET),
    NEXTAUTH_URL: Boolean(process.env.NEXTAUTH_URL),
    NEXT_PUBLIC_APP_URL: Boolean(process.env.NEXT_PUBLIC_APP_URL),
  };

  // Check for database URL
  const databaseStatus = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
  };

  // Check for analytics
  const analyticsStatus = {
    NEXT_PUBLIC_GA_MEASUREMENT_ID: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
  };

  // Check for email (Brevo) API key
  const emailStatus = {
    BREVO_API_KEY: Boolean(process.env.BREVO_API_KEY),
  };

  // Get Node.js and NPM versions
  const nodeVersion = process.version;
  const npmVersion = process.env.npm_config_user_agent
    ? process.env.npm_config_user_agent.split(' ')[0].split('/')[1]
    : 'unknown';

  return NextResponse.json({
    auth: authStatus,
    database: databaseStatus,
    analytics: analyticsStatus,
    email: emailStatus,
    versions: {
      node: nodeVersion,
      npm: npmVersion,
    },
    timestamp: new Date().toISOString(),
  });
} 