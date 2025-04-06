import React from 'react'
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { CalculatorIcon } from '@heroicons/react/24/outline'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import FinancialTip from './components/FinancialTip'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Footer from './components/Footer'

// Load fonts
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true
})
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  preload: true
})

export const metadata: Metadata = {
  title: 'Credit Card Interest Calculator - Calculate Late Fees & Interest',
  description: 'Calculate your credit card interest and late fees easily with our online tool. Upload your statement or enter details manually for accurate results.',
}

const footerLinks = [
  { name: 'About', href: '/about' },
  { name: 'Terms & Conditions', href: '/terms' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Refund Policy', href: '/refund' },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} h-full`}>
      <body className="min-h-screen flex flex-col">
        {/* Fixed Blobs */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-20 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
          
        <header className="sticky top-0 z-50 w-full shadow-sm bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
            <Header />
          </div>
        </header>
        
        <main className="flex-grow pt-6 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        
        <footer className="bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Footer />
          </div>
        </footer>

        <Toaster position="bottom-center" />
        <Analytics />
      </body>
    </html>
  )
} 