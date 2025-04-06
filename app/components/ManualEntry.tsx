'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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

  // Add an empty transaction to the list
  const addTransaction = () => {
    setTransactions([
      ...transactions,
      { amount: 0, transactionDate: null }
    ]);
  };

  // Remove a transaction by index
  const removeTransaction = (index: number) => {
    const newTransactions = [...transactions];
    newTransactions.splice(index, 1);
    setTransactions(newTransactions);
  };

  // Update transaction amount
  const updateTransactionAmount = (index: number, amount: number) => {
    const newTransactions = [...transactions];
    newTransactions[index].amount = amount;
    setTransactions(newTransactions);
    validateTransactionAmounts();
  };

  // Update transaction date
  const updateTransactionDate = (index: number, date: Date | null) => {
    const newTransactions = [...transactions];
    newTransactions[index].transactionDate = date;
    setTransactions(newTransactions);
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
    setMinDuePaid(false);
    setTransactionError(null);
    setTransactions([{ amount: 0, transactionDate: null }]);
  };

  // Form submission handler
  const onSubmit = async (data: FormData) => {
    if (!dueDate) {
      alert('Please select a due date');
      return;
    }
    
    if (!paymentDate) {
      alert('Please select a payment date');
      return;
    }
    
    if (!validateTransactionAmounts()) {
      return;
    }
    
    if (!validateTransactionDates()) {
      alert('Please select dates for all transactions');
      return;
    }

    // Track calculation attempt
    event({
      action: 'calculate',
      category: 'credit_card',
      label: data.bank,
      value: data.outstandingAmount
    });
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bank: data.bank,
          outstandingAmount: data.outstandingAmount,
          minimumDueAmount: data.minimumDueAmount,
          minimumDuePaid: data.minimumDuePaid,
          dueDate: dueDate.toISOString(),
          paymentDate: paymentDate.toISOString(),
          transactions: transactions.map(t => ({
            amount: t.amount,
            transactionDate: t.transactionDate?.toISOString() || ''
          }))
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const result = await response.json();
      setCalculationResult({
        ...result,
        paymentStatus: 'PENDING'
      });
      
      // Track successful calculation
      event({
        action: 'result',
        category: 'credit_card',
        label: data.bank,
        value: result.totalAmount
      });
      
    } catch (error) {
      console.error('Calculation error:', error);
      alert('There was an error processing your request. Please try again later.');
      
      // Track calculation error
      event({
        action: 'error',
        category: 'credit_card',
        label: 'calculation_error',
      });
    } finally {
      setIsLoading(false);
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
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Card Details</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="bank" className="block text-sm font-medium text-gray-700">
                Bank / Card Provider
              </label>
              <select
                id="bank"
                {...register('bank')}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select bank</option>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <div className="mt-1">
                  <DatePicker
                    selected={dueDate}
                    onChange={(date) => setDueDate(date)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholderText="Select due date"
                    dateFormat="MMMM d, yyyy"
                    id="dueDate"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
                  Payment Date
                </label>
                <div className="mt-1">
                  <DatePicker
                    selected={paymentDate}
                    onChange={(date) => setPaymentDate(date)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholderText="Select payment date"
                    dateFormat="MMMM d, yyyy"
                    id="paymentDate"
                  />
                </div>
              </div>
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
                  />
                </div>
                {errors.minimumDueAmount && (
                  <p className="mt-1 text-sm text-red-600">{errors.minimumDueAmount.message}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-2">
            <div className="flex items-center">
              <input
                id="paid-yes"
                name="minimumDuePaid"
                type="radio"
                checked={minDuePaid}
                onChange={() => handleMinDuePaidChange(true)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor="paid-yes" className="ml-3 block text-sm font-medium text-gray-700">
                Yes, I paid minimum due amount by due date
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="paid-no"
                name="minimumDuePaid"
                type="radio"
                checked={!minDuePaid}
                onChange={() => handleMinDuePaidChange(false)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor="paid-no" className="ml-3 block text-sm font-medium text-gray-700">
                No, I did not pay minimum due amount by due date
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Transactions</h2>
          <p className="text-sm text-gray-600 mb-4">
            Add all your transactions that were made after the bill generation date:
          </p>
          
          {transactionError && (
            <div className="mb-4 text-sm p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {transactionError}
            </div>
          )}
          
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
        </div>

        <div className="flex flex-col space-y-4">
          {/* Add Transaction Button moved here */}
          <button
            type="button"
            onClick={addTransaction}
            className="flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Transaction
          </button>

          {/* Calculate Button */}
          <button
            type="submit"
            disabled={isLoading || Boolean(transactionError)}
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
          isPaid={false}
        />
      )}
    </div>
  );
} 