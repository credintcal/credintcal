'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { initializeRazorpayPayment } from '../../utils/payment';
import CalculationResult from './CalculationResult';
import { event } from './GoogleAnalytics';
import TransactionItem from './TransactionItem';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// Transaction interface
interface Transaction {
  amount: number;
  transactionDate: Date | null;
}

const schema = z.object({
  bank: z.string().min(1, 'Bank is required'),
  outstandingAmount: z.number().min(0, 'Outstanding amount must be positive'),
  minimumDueAmount: z.number().min(0, 'Minimum due amount must be positive'),
  minimumDuePaid: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function ManualEntry() {
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [minDuePaid, setMinDuePaid] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  
  // State for multiple transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    { amount: 0, transactionDate: null }
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      outstandingAmount: 0,
      minimumDueAmount: 0, 
      minimumDuePaid: false
    }
  });

  // Watch the outstanding amount to validate transaction totals
  const outstandingAmount = watch('outstandingAmount');

  // Effect to validate transaction amounts whenever they change
  useEffect(() => {
    validateTransactionAmounts();
  }, [transactions, outstandingAmount]);

  // Handle input focus to clear default value
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === '0') {
      event.target.value = '';
    }
  };

  // Handle input blur to restore default value if empty
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>, fieldName: keyof FormData) => {
    if (event.target.value === '') {
      setValue(fieldName, 0);
    }
  };

  // Update form value when radio changes
  const handleMinDuePaidChange = (value: boolean) => {
    setMinDuePaid(value);
    setValue('minimumDuePaid', value);
  };

  // Add a new transaction
  const addTransaction = () => {
    if (isPaid || calculationResult?.paymentStatus === 'COMPLETED') {
      alert('Cannot add transactions after payment. Please reset the form to start a new calculation.');
      return;
    }
    setTransactions([...transactions, { amount: 0, transactionDate: null }]);
  };

  // Remove a transaction
  const removeTransaction = (index: number) => {
    if (isPaid || calculationResult?.paymentStatus === 'COMPLETED') {
      alert('Cannot remove transactions after payment. Please reset the form to start a new calculation.');
      return;
    }
    if (transactions.length > 1) {
      const updatedTransactions = [...transactions];
      updatedTransactions.splice(index, 1);
      setTransactions(updatedTransactions);
    }
  };

  // Update transaction amount
  const updateTransactionAmount = (index: number, amount: number) => {
    if (isPaid || calculationResult?.paymentStatus === 'COMPLETED') {
      alert('Cannot modify transactions after payment. Please reset the form to start a new calculation.');
      return;
    }
    const updatedTransactions = [...transactions];
    updatedTransactions[index].amount = amount;
    setTransactions(updatedTransactions);
    validateTransactionAmounts();
  };

  // Update transaction date
  const updateTransactionDate = (index: number, date: Date | null) => {
    if (isPaid || calculationResult?.paymentStatus === 'COMPLETED') {
      alert('Cannot modify transactions after payment. Please reset the form to start a new calculation.');
      return;
    }
    const updatedTransactions = [...transactions];
    updatedTransactions[index].transactionDate = date;
    setTransactions(updatedTransactions);
  };

  // Validate transaction amounts don't exceed outstanding amount
  const validateTransactionAmounts = (): boolean => {
    const totalTransactionAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const currentOutstandingAmount = getValues('outstandingAmount');
    
    if (totalTransactionAmount > currentOutstandingAmount) {
      setTransactionError(`Total transaction amount (₹${totalTransactionAmount.toFixed(2)}) exceeds outstanding amount (₹${currentOutstandingAmount.toFixed(2)})`);
      return false;
    } else {
      setTransactionError(null);
      return true;
    }
  };

  // Validate all transaction dates are selected
  const validateTransactionDates = (): boolean => {
    return transactions.every(transaction => transaction.transactionDate !== null);
  };

  // Reset the form to start a new calculation
  const handleReset = () => {
    reset({
      bank: '',
      outstandingAmount: 0,
      minimumDueAmount: 0,
      minimumDuePaid: false
    });
    setDueDate(null);
    setPaymentDate(null);
    setCalculationResult(null);
    setIsLoading(false);
    setIsPaid(false);
    setMinDuePaid(false);
    setTransactionError(null);
    setTransactions([{ amount: 0, transactionDate: null }]);
  };

  const onSubmit = async (data: FormData) => {
    // Validate all required dates
    if (!dueDate || !paymentDate) {
      alert('Please select statement due date and payment date');
      return;
    }

    // Validate transaction dates
    if (!validateTransactionDates()) {
      alert('Please select all transaction dates');
      return;
    }

    // Validate transaction amounts
    if (!validateTransactionAmounts()) {
      alert('Total transaction amount cannot exceed outstanding amount');
      return;
    }

    // Check if already paid
    if (isPaid || calculationResult?.paymentStatus === 'COMPLETED') {
      alert('Payment already completed. Please reset the form to start a new calculation.');
      return;
    }

    // Track form submission event
    event({
      action: 'submit',
      category: 'form',
      label: 'calculator_form',
      value: data.outstandingAmount
    });

    setIsLoading(true);
    try {
      const formData = {
        ...data,
        transactions: transactions.map(t => ({
          amount: t.amount,
          transactionDate: t.transactionDate
        })),
        dueDate,
        paymentDate,
        minimumDuePaid: minDuePaid
      };
      
      console.log("Submitting data:", formData);
      
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Calculation result:", result);
      setCalculationResult(result);
      
      // Track successful calculation
      event({
        action: 'calculate',
        category: 'success',
        label: data.bank,
        value: result.totalAmount
      });
    } catch (error) {
      console.error('Calculation failed:', error);
      alert('Failed to calculate fees. Please try again.');
      
      // Track calculation error
      event({
        action: 'calculate',
        category: 'error',
        label: 'calculation_error',
        value: 0
      });
    }
    setIsLoading(false);
  };

  const handlePayment = async () => {
    if (calculationResult?.transactionId) {
      // Track payment initiation
      event({
        action: 'initiate',
        category: 'payment',
        label: 'razorpay',
        value: calculationResult.totalAmount
      });
      
      try {
        const success = await initializeRazorpayPayment(calculationResult.transactionId);
        if (success) {
          setIsPaid(true);
          // Fetch updated transaction details
          try {
            const response = await fetch('/api/calculate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                transactionId: calculationResult.transactionId,
              }),
            });
            
            if (!response.ok) {
              throw new Error(`Server responded with ${response.status}`);
            }
            
            const result = await response.json();
            
            // Ensure we have the full result structure with all required fields
            const updatedResult = {
              ...calculationResult,  // Keep original data as fallback
              ...result,             // Update with new data
              // Ensure critical fields are present
              paymentStatus: result.paymentStatus || calculationResult.paymentStatus,
              interest: result.interest || calculationResult.interest,
              lateFee: result.lateFee || calculationResult.lateFee,
              outstandingAmount: result.outstandingAmount || calculationResult.outstandingAmount,
              minimumDueAmount: result.minimumDueAmount || calculationResult.minimumDueAmount,
              minimumDuePaid: typeof result.minimumDuePaid !== 'undefined' ? result.minimumDuePaid : calculationResult.minimumDuePaid,
              totalAmount: result.totalAmount || calculationResult.totalAmount,
            };
            
            setCalculationResult(updatedResult);
          } catch (error) {
            console.error('Failed to fetch updated details:', error);
            // Update status locally if server fetch fails
            setCalculationResult({
              ...calculationResult,
              paymentStatus: 'COMPLETED'
            });
          }
        }
      } catch (error) {
        console.error('Payment error:', error);
        alert('There was an error processing your payment. Please try again.');
      }
    }
  };

  const banks = [
    'HDFC',
    'SBI',
    'ICICI',
    'Axis',
    'Kotak',
    'Yes',
    'PNB',
    'IDFC',
    'AmericanExpress',
    'Citibank',
  ];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bank</label>
            <select
              {...register('bank')}
              className="mt-1 block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-sm transition-all duration-200 hover:bg-white"
              disabled={isPaid || calculationResult?.paymentStatus === 'COMPLETED'}
            >
              <option value="">Select a bank</option>
              {banks.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
            {errors.bank && (
              <p className="mt-1 text-sm text-red-600">{errors.bank.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="outstandingAmount" className="block text-sm font-medium text-gray-700">
                Outstanding Amount (₹)
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  id="outstandingAmount"
                  step="0.01"
                  onFocus={handleFocus}
                  onBlur={(e) => handleBlur(e, 'outstandingAmount')}
                  {...register('outstandingAmount', { valueAsNumber: true })}
                  className="block w-full pl-7 pr-12 py-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-sm transition-all duration-200 hover:bg-white"
                  disabled={isPaid || calculationResult?.paymentStatus === 'COMPLETED'}
                />
              </div>
              {errors.outstandingAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.outstandingAmount.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="minimumDueAmount" className="block text-sm font-medium text-gray-700">
                Minimum Due Amount (₹)
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  id="minimumDueAmount"
                  step="0.01"
                  onFocus={handleFocus}
                  onBlur={(e) => handleBlur(e, 'minimumDueAmount')}
                  {...register('minimumDueAmount', { valueAsNumber: true })}
                  className="block w-full pl-7 pr-12 py-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-sm transition-all duration-200 hover:bg-white"
                  disabled={isPaid || calculationResult?.paymentStatus === 'COMPLETED'}
                />
              </div>
              {errors.minimumDueAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.minimumDueAmount.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Statement Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Statement Due Date
              </label>
              <div className="mt-1">
                <DatePicker
                  selected={dueDate}
                  onChange={setDueDate}
                  className="block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-sm transition-all duration-200 hover:bg-white"
                  placeholderText="Select due date"
                  dateFormat="MMMM d, yyyy"
                  disabled={isPaid || calculationResult?.paymentStatus === 'COMPLETED'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Date
              </label>
              <div className="mt-1">
                <DatePicker
                  selected={paymentDate}
                  onChange={setPaymentDate}
                  className="block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-sm transition-all duration-200 hover:bg-white"
                  placeholderText="Select payment date"
                  dateFormat="MMMM d, yyyy"
                  disabled={isPaid || calculationResult?.paymentStatus === 'COMPLETED'}
                />
              </div>
            </div>
          </div>

          {/* Enhanced Minimum Due Payment Status */}
          <fieldset className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <legend className="px-2 text-sm font-medium text-blue-700 bg-white rounded-md shadow-sm border border-blue-200">Minimum Due Payment Status</legend>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  id="minimum-due-yes"
                  name="minimum-due-paid"
                  type="radio"
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                  checked={minDuePaid === true}
                  onChange={() => handleMinDuePaidChange(true)}
                  disabled={isPaid || calculationResult?.paymentStatus === 'COMPLETED'}
                />
                <label htmlFor="minimum-due-yes" className="ml-3 block text-sm font-medium text-gray-700">
                  Minimum Due Paid
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="minimum-due-no"
                  name="minimum-due-paid"
                  type="radio"
                  className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300"
                  checked={minDuePaid === false}
                  onChange={() => handleMinDuePaidChange(false)}
                  disabled={isPaid || calculationResult?.paymentStatus === 'COMPLETED'}
                />
                <label htmlFor="minimum-due-no" className="ml-3 block text-sm font-medium text-gray-700">
                  Minimum Due Not Paid
                </label>
              </div>
            </div>
          </fieldset>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Transactions</h3>
          </div>
          
          <div className="space-y-2">
            {transactions.map((transaction, index) => (
              <TransactionItem
                key={index}
                index={index}
                transactionAmount={transaction.amount}
                transactionDate={transaction.transactionDate}
                onAmountChange={(amount) => updateTransactionAmount(index, amount)}
                onDateChange={(date) => updateTransactionDate(index, date)}
                onRemove={() => removeTransaction(index)}
                isRemovable={transactions.length > 1}
              />
            ))}
          </div>

          {transactionError && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              <p className="text-sm font-medium">{transactionError}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-4">
          {/* Add Transaction Button moved here */}
          <button
            type="button"
            onClick={addTransaction}
            className="flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={isPaid || calculationResult?.paymentStatus === 'COMPLETED'}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Transaction
          </button>

          {/* Calculate Button */}
          <button
            type="submit"
            disabled={isLoading || isPaid || calculationResult?.paymentStatus === 'COMPLETED' || Boolean(transactionError)}
            className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-xl shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                Calculate
              </>
            )}
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            className="flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Reset Form
          </button>
        </div>
      </form>

      {calculationResult && (
        <CalculationResult
          result={calculationResult}
          isPaid={isPaid}
          onPayment={handlePayment}
        />
      )}
    </div>
  );
} 