import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { CalculatorIcon } from '@heroicons/react/24/outline'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import FinancialTip from './components/FinancialTip'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Credbill - Credit Card Interest & Late Fee Calculator by BeyondX',
  description: 'Calculate credit card interest charges and late fees accurately. A product by BeyondX Informatics Analytics Pvt Ltd.',
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
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <div className="min-h-full flex flex-col">
          {/* Header */}
          <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <Link href="/" className="flex items-center group">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/10 rounded-lg p-2 group-hover:bg-white/20 transition-colors">
                      <CalculatorIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-white">
                        Credbill
                      </span>
                      <span className="block text-xs text-blue-200">
                        by BeyondX
                      </span>
                    </div>
                  </div>
                </Link>
                
                {/* Financial Tip in Header */}
                <div className="hidden md:block max-w-md">
                  <FinancialTip />
                </div>
              </div>
              
              {/* Mobile Financial Tip - Shows only on small screens */}
              <div className="md:hidden pb-4">
                <FinancialTip />
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-grow bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <CalculatorIcon className="h-6 w-6 text-blue-400" />
                    <span className="text-xl font-semibold text-white">Credbill</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    A product by BeyondX Informatics Analytics Pvt Ltd.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                  <ul className="space-y-2">
                    {footerLinks.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-400 hover:text-white text-sm transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Third column for balance in footer */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Did You Know?</h3>
                  <p className="text-gray-400 text-sm">
                    Always pay your full credit card bill before the due date to avoid interest charges and maintain a good credit score.
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-800">
                <p className="text-gray-500 text-sm text-center">
                  © {new Date().getFullYear()} All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
} 