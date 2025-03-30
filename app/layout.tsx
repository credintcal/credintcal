import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Credit Card Fee Calculator - Calculate Late Fees & Interest Charges',
  description: 'Calculate credit card late fees and interest charges for major banks including HDFC, SBI, ICICI, Axis, and more. Upload statements or enter transactions manually.',
  keywords: 'credit card calculator, late fee calculator, credit card interest, bank charges, HDFC, SBI, ICICI, Axis bank',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Hidden Google AdSense code placeholder */}
        <div id="adsense-placeholder" style={{ display: 'none' }}></div>
      </head>
      <body className={inter.className}>
        {/* Hidden top banner ad space */}
        <div id="top-banner-ad" className="w-full h-[90px] invisible"></div>
        
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        
        {/* Hidden sidebar ad space */}
        <div id="sidebar-ad" className="fixed right-0 top-1/4 w-[160px] h-[600px] invisible"></div>
        
        {/* Hidden bottom banner ad space */}
        <div id="bottom-banner-ad" className="w-full h-[90px] invisible"></div>
      </body>
    </html>
  )
} 