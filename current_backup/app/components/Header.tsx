import React from 'react';
import Link from 'next/link';
import { CalculatorIcon } from '@heroicons/react/24/outline';
import FinancialTip from './FinancialTip';

export default function Header() {
  return (
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
                  Credit Card Calculator
                </span>
              </div>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Financial Tip in Header */}
            <div className="hidden md:block max-w-md">
              <FinancialTip />
            </div>
          </div>
        </div>
        
        {/* Mobile Financial Tip - Shows only on small screens */}
        <div className="md:hidden pb-4">
          <FinancialTip />
        </div>
      </div>
    </header>
  );
} 