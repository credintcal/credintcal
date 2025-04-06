'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

interface TransactionItemProps {
  index: number;
  transactionAmount: number;
  transactionDate: Date | null;
  onAmountChange: (amount: number) => void;
  onDateChange: (date: Date | null) => void;
  onRemove: () => void;
  isRemovable: boolean;
}

export default function TransactionItem({
  index,
  transactionAmount,
  transactionDate,
  onAmountChange,
  onDateChange,
  onRemove,
  isRemovable
}: TransactionItemProps) {
  // Handle input focus to clear default value
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === '0') {
      event.target.value = '';
    }
  };

  // Handle input blur to restore default value if empty
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      onAmountChange(0);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm mb-3 border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-medium text-gray-700">Transaction #{index + 1}</h4>
        {isRemovable && (
          <button 
            type="button"
            onClick={onRemove}
            className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
            aria-label="Remove transaction"
          >
            <MinusIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`transaction-amount-${index}`} className="block text-sm font-medium text-gray-700">
            Amount (₹)
          </label>
          <div className="mt-1 relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₹</span>
            </div>
            <input
              type="number"
              id={`transaction-amount-${index}`}
              value={transactionAmount}
              onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              step="0.01"
              className="block w-full pl-7 pr-12 py-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-sm transition-all duration-200 hover:bg-white"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor={`transaction-date-${index}`} className="block text-sm font-medium text-gray-700">
            Transaction Date
          </label>
          <div className="mt-1">
            <DatePicker
              selected={transactionDate}
              onChange={onDateChange}
              className="block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-sm transition-all duration-200 hover:bg-white"
              placeholderText="Select date"
              dateFormat="MMMM d, yyyy"
              id={`transaction-date-${index}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 