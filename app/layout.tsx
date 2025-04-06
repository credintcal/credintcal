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

// Load fonts
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

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
      <body className={`${inter.className} ${poppins.variable} h-full bg-slate-50`}>
        <div className="min-h-full flex flex-col">
          {/* Animated Header with Glass Effect */}
          <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <Link href="/" className="flex items-center group">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg p-2 group-hover:from-blue-500 group-hover:to-indigo-500 transition-all duration-300 shadow-md">
                      <CalculatorIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Credbill
                      </span>
                      <span className="block text-xs text-slate-500 font-medium">
                        by BeyondX
                      </span>
                    </div>
                  </div>
                </Link>
                
                {/* Financial Tip with improved styling */}
                <div className="hidden md:block max-w-md">
                  <div className="rounded-full px-4 py-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100/80">
                    <FinancialTip />
                  </div>
                </div>
              </div>
              
              {/* Mobile Financial Tip */}
              <div className="md:hidden pb-4">
                <div className="rounded-full px-4 py-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100/80">
                  <FinancialTip />
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-grow">
            {/* Flowing gradient background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute -top-[30%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 animate-blob mix-blend-multiply blur-3xl opacity-70"></div>
              <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 animate-blob animation-delay-2000 mix-blend-multiply blur-3xl opacity-70"></div>
              <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-purple-100/50 animate-blob animation-delay-4000 mix-blend-multiply blur-3xl opacity-70"></div>
            </div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
              {children}
            </div>
          </main>

          {/* Enhanced Footer */}
          <footer className="bg-slate-900 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 -z-0">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
              <div className="absolute -top-[80%] -left-[10%] w-[50%] h-[100%] rounded-full bg-blue-900/20 blur-3xl opacity-30"></div>
              <div className="absolute -bottom-[50%] -right-[10%] w-[50%] h-[100%] rounded-full bg-indigo-900/20 blur-3xl opacity-30"></div>
            </div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg p-2 shadow-md">
                      <CalculatorIcon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-semibold text-white">Credbill</span>
                  </div>
                  <p className="text-slate-400 text-sm">
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
                          className="text-slate-400 hover:text-white text-sm transition-colors flex items-center group"
                        >
                          <span className="w-0 opacity-0 group-hover:w-2 group-hover:opacity-100 group-hover:mr-1 transition-all duration-300 h-px bg-blue-400"></span>
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improved Credit Card Tips section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Credit Card Tips</h3>
                  <div className="bg-slate-800/70 rounded-xl p-4 border border-slate-700/80 backdrop-blur-sm">
                    <div className="flex items-start space-x-3">
                      <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex-shrink-0 mt-0.5 shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Always pay your full credit card bill before the due date to avoid interest charges and maintain a good credit score.
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-700/80">
                      <button className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center">
                        <span>More tips coming soon</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-800/80">
                <p className="text-slate-500 text-sm text-center">
                  © {new Date().getFullYear()} All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
        
        {/* Toast notifications */}
        <Toaster position="bottom-center" />
        
        {/* Analytics */}
        <Analytics />
      </body>
    </html>
  )
} 