import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Credintcal - Credit Card Fee Calculator by BeyondX',
  description: 'Calculate credit card late fees and interest charges for major banks including HDFC, SBI, ICICI, Axis, and more. Upload statements or enter transactions manually.',
  keywords: 'credit card calculator, late fee calculator, credit card interest, bank charges, HDFC, SBI, ICICI, Axis bank',
}

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'Terms & Conditions', href: '/terms' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Refund Policy', href: '/refund' },
  { name: 'Shipping Policy', href: '/shipping' },
  { name: 'Contact', href: '/contact' },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Credintcal
                    </span>
                  </Link>
                </div>
                <nav className="hidden md:flex space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                {/* Mobile menu button */}
                <div className="md:hidden">
                  <button
                    type="button"
                    className="text-gray-600 hover:text-gray-900 focus:outline-none"
                    aria-label="Toggle menu"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-grow bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <h3 className="text-white text-lg font-semibold">About Us</h3>
                  <p className="text-gray-400 text-sm">
                    A product by BeyondX Informatics Analytics Pvt Ltd.
                    Revolutionizing credit card fee calculations.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-white text-lg font-semibold">Quick Links</h3>
                  <ul className="space-y-2">
                    {navigation.slice(0, 3).map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-gray-400 hover:text-white text-sm"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-white text-lg font-semibold">Policies</h3>
                  <ul className="space-y-2">
                    {navigation.slice(3).map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-gray-400 hover:text-white text-sm"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-white text-lg font-semibold">Contact</h3>
                  <p className="text-gray-400 text-sm">
                    Have questions? Reach out to us.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-gray-800">
                <p className="text-gray-400 text-sm text-center">
                  © {new Date().getFullYear()} BeyondX Informatics Analytics Pvt Ltd. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
} 