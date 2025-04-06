import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import Footer from './components/Footer';
import Header from './components/Header';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Credbill - Credit Card Calculator',
  description: 'Calculate credit card interest and late payment fees with precision and ease.',
  applicationName: 'Credbill',
  authors: [
    {
      name: 'Credbill Team',
      url: 'https://credintcal.co.in',
    },
  ],
  generator: 'Next.js',
  keywords: [
    'credit card',
    'calculator',
    'finance',
    'interest',
    'late fees',
    'banking',
    'personal finance',
    'credit card calculator',
    'payment calculator',
    'interest calculator',
  ],
  creator: 'Credbill',
  publisher: 'Credbill',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://credintcal.co.in',
    title: 'Credbill - Credit Card Calculator',
    description: 'Calculate credit card interest and late payment fees with precision and ease.',
    siteName: 'Credbill',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Credbill - Credit Card Calculator',
    description: 'Calculate credit card interest and late payment fees with precision and ease.',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const financialTips = [
    "Always pay your full credit card bill before the due date to avoid interest charges and maintain a good credit score."
  ];

  const randomTip = financialTips[Math.floor(Math.random() * financialTips.length)];

  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
            `,
          }}
        />
      </head>

      <body className={`${inter.className} min-h-screen bg-gray-50 flex flex-col`}>
        <Header />
        <main className="flex-grow overflow-x-hidden">
          <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <Footer tip={randomTip} />
        <Toaster position="bottom-center" />
        <Analytics />
      </body>
    </html>
  );
} 