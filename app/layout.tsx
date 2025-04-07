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
      <body className={`${inter.className} ${poppins.variable} min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`}>
        <div className="relative min-h-screen">
          {/* Animated background */}
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,rgba(0,0,0,0.1)_0deg,transparent_60deg,transparent_300deg,rgba(0,0,0,0.1)_360deg)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,rgba(255,255,255,0.1)_0deg,transparent_60deg,transparent_300deg,rgba(255,255,255,0.1)_360deg)]" />
          </div>

          {/* Header */}
          <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">C</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Credbill
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:block">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                      <div className="relative px-4 py-2 bg-white dark:bg-gray-900 rounded-lg ring-1 ring-gray-900/5 dark:ring-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">Tip:</span> Pay your credit card bill on time to avoid late fees and maintain a good credit score.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 mt-auto">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">C</span>
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Credbill
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    A modern credit card interest calculator by Beyondx Informatics Analytics Pvt Ltd
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        Home
                      </a>
                    </li>
                    <li>
                      <a href="/faq" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Credit Card Tips</h3>
                  <ul className="space-y-2">
                    <li className="text-sm text-gray-600 dark:text-gray-400">
                      Pay your bills on time
                    </li>
                    <li className="text-sm text-gray-600 dark:text-gray-400">
                      Keep credit utilization low
                    </li>
                    <li className="text-sm text-gray-600 dark:text-gray-400">
                      Monitor your credit score
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  © {new Date().getFullYear()} Beyondx Informatics Analytics Pvt Ltd. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>

        <Toaster position="bottom-center" />
        <Analytics />
      </body>
    </html>
  )
} 