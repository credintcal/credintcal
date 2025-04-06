import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import Header from './components/Header';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Credit Card Fee Calculator',
  description: 'Calculate credit card interest, late fees and charges',
  keywords: 'credit card, fee calculator, interest calculator, finance calculator, minimum payment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <Providers>
          <div className="flex-grow bg-gradient-to-b from-indigo-900 to-black text-white min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
} 