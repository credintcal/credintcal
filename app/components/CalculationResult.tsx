import React from 'react';
import { CurrencyRupeeIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

interface CalculationResultProps {
  result: {
    interest: number;
    lateFee: number;
    totalAmount: number;
    paymentStatus: string;
  };
  isPaid: boolean;
  onPayment: () => void;
}

export default function CalculationResult({
  result,
  isPaid,
  onPayment,
}: CalculationResultProps) {
  return (
    <div className="mt-6 bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Calculation Result</h3>
          {(isPaid || result.paymentStatus === 'COMPLETED') ? (
            <div className="flex items-center text-green-600">
              <LockOpenIcon className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Unlocked</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-500">
              <LockClosedIcon className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Locked</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-blue-600">Interest</p>
              <CurrencyRupeeIcon className="h-5 w-5 text-blue-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-blue-900">
              ₹{result.interest.toFixed(2)}
            </p>
          </div>

          <div className="bg-red-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-red-600">Late Fee</p>
              <CurrencyRupeeIcon className="h-5 w-5 text-red-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-red-900">
              ₹{result.lateFee.toFixed(2)}
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-green-600">Total Amount</p>
              <CurrencyRupeeIcon className="h-5 w-5 text-green-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-green-900">
              ₹{result.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {!isPaid && result.paymentStatus === 'PENDING' && (
          <div className="mt-8">
            <button
              onClick={onPayment}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium px-4 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Pay ₹10 to View Full Details
            </button>
          </div>
        )}

        {(isPaid || result.paymentStatus === 'COMPLETED') && (
          <div className="mt-8 bg-green-50 rounded-xl p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <LockOpenIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-green-900">
                  Payment Completed
                </h3>
                <p className="mt-2 text-sm text-green-600">
                  Full details have been unlocked. You can now view the complete breakdown of your charges.
                </p>
              </div>
            </div>
            {/* Add additional details here */}
          </div>
        )}
      </div>
    </div>
  );
} 