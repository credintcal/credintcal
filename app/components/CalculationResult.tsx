import React from 'react';
import { 
  CurrencyRupeeIcon, 
  LockClosedIcon, 
  LockOpenIcon,
  BanknotesIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

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
  onPayment: () => void;
}

function maskAmount(amount: number): string {
  const amountStr = amount.toFixed(2);
  const [wholePart, decimalPart] = amountStr.split('.');
  const lastDigit = wholePart.slice(-1);
  const maskedWholePart = 'X'.repeat(wholePart.length - 1) + lastDigit;
  return `₹${maskedWholePart}.${decimalPart}`;
}

function calculateTotal(result: CalculationResultProps['result']): number {
  if (!result.minimumDuePaid) {
    // If minimum due is not paid, add late fee
    return result.outstandingAmount + result.interest + result.lateFee;
  } else {
    // If minimum due is paid, subtract it from outstanding amount and add interest
    return (result.outstandingAmount - (result.minimumDueAmount || 0)) + result.interest;
  }
}

export default function CalculationResult({
  result,
  isPaid,
  onPayment,
}: CalculationResultProps) {
  const totalAmount = calculateTotal(result);
  const isUnlocked = isPaid || result.paymentStatus === 'COMPLETED';

  return (
    <div className="mt-8 glass-panel overflow-hidden animate-fadeIn">
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-slate-900">Calculation Result</h3>
          {isUnlocked ? (
            <div className="flex items-center text-green-600 animate-fadeIn">
              <LockOpenIcon className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Unlocked</span>
            </div>
          ) : (
            <div className="flex items-center text-slate-500">
              <LockClosedIcon className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Locked</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Interest Card */}
          <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100/30 p-5 group">
            <div className="absolute inset-0 bg-grid-slate-100 opacity-10"></div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-700">Interest</p>
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <CurrencyRupeeIcon className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-blue-900 group-hover:scale-105 transform transition-transform">
              {isUnlocked 
                ? <span className="animate-fadeIn">₹{result.interest.toFixed(2)}</span>
                : maskAmount(result.interest)
              }
            </p>
          </div>

          {/* Late Fee Card */}
          <div className="relative overflow-hidden rounded-xl border border-red-100 bg-gradient-to-br from-red-50 to-red-100/30 p-5 group">
            <div className="absolute inset-0 bg-grid-slate-100 opacity-10"></div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-red-700">Late Fee</p>
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <CurrencyRupeeIcon className="h-4 w-4 text-red-600" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-red-900 group-hover:scale-105 transform transition-transform">
              {isUnlocked
                ? <span className="animate-fadeIn">₹{result.lateFee.toFixed(2)}</span>
                : maskAmount(result.lateFee)
              }
            </p>
          </div>

          {/* Total Amount Card */}
          <div className="relative overflow-hidden rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-green-100/30 p-5 group">
            <div className="absolute inset-0 bg-grid-slate-100 opacity-10"></div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-green-700">Total Amount</p>
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <CurrencyRupeeIcon className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-green-900 group-hover:scale-105 transform transition-transform">
              {isUnlocked
                ? <span className="animate-fadeIn">₹{totalAmount.toFixed(2)}</span>
                : maskAmount(totalAmount)
              }
            </p>
          </div>
        </div>

        {!isUnlocked && (
          <div className="mt-8 animate-fadeIn">
            <button
              onClick={onPayment}
              className="btn-primary w-full gap-2"
            >
              <LockOpenIcon className="h-5 w-5" />
              Pay ₹10 to View Full Details
            </button>
            <p className="text-xs text-slate-500 text-center mt-3">
              Unlock all details with just a one-time payment of ₹10
            </p>
          </div>
        )}

        {isUnlocked && (
          <div className="mt-8 animate-fadeIn">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-green-900">
                    Payment Completed
                  </h3>
                  <p className="mt-1 text-sm text-green-700">
                    Full details have been unlocked. You can view the complete breakdown of your charges.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-green-100 flex items-start gap-3">
                  <div className="p-1.5 bg-slate-100 rounded-lg">
                    <BanknotesIcon className="h-5 w-5 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Outstanding Amount</p>
                    <p className="text-lg font-semibold text-slate-900">₹{result.outstandingAmount.toFixed(2)}</p>
                  </div>
                </div>
                
                {result.minimumDueAmount && (
                  <div className="p-4 bg-white rounded-lg border border-green-100 flex items-start gap-3">
                    <div className="p-1.5 bg-slate-100 rounded-lg">
                      <CurrencyRupeeIcon className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Minimum Due Amount</p>
                      <p className="text-lg font-semibold text-slate-900">₹{result.minimumDueAmount.toFixed(2)}</p>
                    </div>
                  </div>
                )}
                
                <div className="p-4 bg-white rounded-lg border border-green-100 flex items-start gap-3">
                  <div className="p-1.5 bg-slate-100 rounded-lg">
                    <CalendarIcon className="h-5 w-5 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Payment Status</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {result.minimumDuePaid ? 'Minimum Due Paid' : 'Minimum Due Not Paid'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 