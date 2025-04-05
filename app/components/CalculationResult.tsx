import React from 'react';
import { CurrencyRupeeIcon, LockOpenIcon } from '@heroicons/react/24/outline';

interface CalculationResultProps {
  result: {
    interest: number;
    lateFee: number;
    totalAmount: number;
    outstandingAmount: number;
    minimumDueAmount?: number;
    minimumDuePaid: boolean;
    paymentStatus: string;
  };
  isPaid: boolean;
}

// Function to mask amount for preview
function maskAmount(amount: number): string {
  if (amount <= 0) return '₹0.00';
  return '₹' + amount.toFixed(2);
}

export default function CalculationResult({
  result,
  isPaid
}: CalculationResultProps) {
  // Ensure result has valid data
  const {
    interest = 0,
    lateFee = 0,
    totalAmount = 0,
    outstandingAmount = 0,
    minimumDueAmount = 0,
    minimumDuePaid = false,
    paymentStatus = ''
  } = result || {};

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mt-8">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculation Result</h2>
        
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Interest Charges */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-sm border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-blue-800">Interest Charges</h3>
                <CurrencyRupeeIcon className="h-5 w-5 text-blue-700" />
              </div>
              <p className="text-3xl font-bold text-blue-900">
                ₹{interest.toFixed(2)}
              </p>
            </div>

            {/* Late Payment Fees */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 shadow-sm border border-red-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-red-800">Late Payment Fees</h3>
                <CurrencyRupeeIcon className="h-5 w-5 text-red-700" />
              </div>
              <p className="text-3xl font-bold text-red-900">
                ₹{lateFee.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl p-6 shadow-sm border border-indigo-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-indigo-800">Total Amount Due</h3>
              <CurrencyRupeeIcon className="h-5 w-5 text-indigo-700" />
            </div>
            <p className="text-4xl font-bold text-indigo-900">
              ₹{totalAmount.toFixed(2)}
            </p>
            <div className="mt-3 text-sm text-indigo-700">
              <p>Outstanding Amount: ₹{outstandingAmount.toFixed(2)}</p>
              {minimumDueAmount > 0 && (
                <p>Minimum Due: ₹{minimumDueAmount.toFixed(2)} ({minimumDuePaid ? 'Paid' : 'Not Paid'})</p>
              )}
            </div>
          </div>

          {/* Information and details */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">How is this calculated?</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Interest is calculated on your outstanding balance.</li>
              <li>• Late payment fees are added if you missed the minimum payment by the due date.</li>
              <li>• Partial payments after the due date still accrue interest on the remaining balance.</li>
              <li>• Different banks have different fee structures and interest calculation methods.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-green-50 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <LockOpenIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-green-900">
                Full Details Available
              </h3>
              <p className="mt-2 text-sm text-green-600">
                View the complete breakdown of your charges above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 