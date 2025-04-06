import React from 'react';
import Link from 'next/link';
import { CalculatorIcon } from '@heroicons/react/24/outline';
import FinancialTip from './FinancialTip';

export default function Header() {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center py-2">
        <Link href="/" className="flex items-center group">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg p-2 group-hover:from-blue-500 group-hover:to-indigo-500 transition-all duration-300 shadow-md">
              <CalculatorIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Credit Calculator
              </span>
              <span className="block text-xs text-slate-500 font-medium">
                Interest & Late Fees
              </span>
            </div>
          </div>
        </Link>
        
        {/* Financial Tip with improved styling - Desktop */}
        <div className="hidden md:block max-w-lg">
          <div className="rounded-full px-4 py-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100/80">
            <FinancialTip />
          </div>
        </div>
      </div>
      
      {/* Financial Tip - Mobile */}
      <div className="md:hidden">
        <div className="rounded-full px-4 py-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100/80">
          <FinancialTip />
        </div>
      </div>
    </div>
  );
} 