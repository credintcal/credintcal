'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { initializeRazorpayPayment } from '../../utils/payment';
import CalculationResult from './CalculationResult';
import { BankOption } from './BankLogos';
import { 
  BanknotesIcon, 
  CalendarIcon, 
  CreditCardIcon,
  ArrowLongRightIcon,
  CheckIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const schema = z.object({
  bank: z.string().min(1, 'Bank is required'),
  outstandingAmount: z.number().min(0, 'Outstanding amount must be positive'),
  minimumDueAmount: z.number().min(0, 'Minimum due amount must be positive'),
  minimumDuePaid: z.boolean(),
  transactions: z.array(
    z.object({
      amount: z.number().min(0, 'Transaction amount must be positive'),
      date: z.date()
    })
  ).optional()
});

type FormData = z.infer<typeof schema>;

type Transaction = {
  amount: number;
  date: Date | null;
  error?: string | null;
};

export default function ManualEntry() {
  const [statementDate, setStatementDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [minDuePaid, setMinDuePaid] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([{ amount: 0, date: null }]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bank: '',
      outstandingAmount: undefined,
      minimumDueAmount: undefined,
      minimumDuePaid: false
    }
  });

  // Update form value when radio changes
  const handleMinDuePaidChange = (value: boolean) => {
    setMinDuePaid(value);
    setValue('minimumDuePaid', value);
  };

  // Validate transaction date is within billing cycle
  const validateTransactionDate = (transactionDate: Date | null, statementDate: Date | null) => {
    if (!transactionDate || !statementDate) return null;
    
    // Calculate the start date (31 days before statement date)
    const startDate = new Date(statementDate);
    startDate.setDate(startDate.getDate() - 31);
    
    // Check if transaction date is between start date and statement date
    if (transactionDate < startDate) {
      return "This transaction falls outside the current billing cycle. It's more than 31 days before statement date.";
    }
    
    if (transactionDate > statementDate) {
      return "This transaction will be considered in the next statement's billing cycle.";
    }
    
    return null;
  };

  // Handle transaction date change
  const handleTransactionDateChange = (index: number, date: Date | null) => {
    const newTransactions = [...transactions];
    newTransactions[index].date = date;
    
    if (date && statementDate) {
      const error = validateTransactionDate(date, statementDate);
      newTransactions[index].error = error;
    } else {
      newTransactions[index].error = null;
    }
    
    setTransactions(newTransactions);
  };

  // Handle transaction amount change
  const handleTransactionAmountChange = (index: number, amount: string) => {
    const newTransactions = [...transactions];
    newTransactions[index].amount = parseFloat(amount) || 0;
    setTransactions(newTransactions);
  };

  // Add new transaction
  const addTransaction = () => {
    setTransactions([...transactions, { amount: 0, date: null }]);
    toast.success('New transaction added');
  };

  // Remove transaction
  const removeTransaction = (index: number) => {
    if (transactions.length > 1) {
      const newTransactions = [...transactions];
      newTransactions.splice(index, 1);
      setTransactions(newTransactions);
      toast.success('Transaction removed');
    }
  };

  // Handle statement date change
  const handleStatementDateChange = (date: Date | null) => {
    setStatementDate(date);
    
    // Update validation for all transactions
    if (date) {
      const newTransactions = [...transactions];
      newTransactions.forEach((transaction, index) => {
        if (transaction.date) {
          const error = validateTransactionDate(transaction.date, date);
          newTransactions[index].error = error;
        }
      });
      setTransactions(newTransactions);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!statementDate || !dueDate || !paymentDate) {
      toast.error('Please select all dates');
      return;
    }

    // Check if all transactions have dates
    const incompleteTx = transactions.find(tx => !tx.date);
    if (incompleteTx) {
      toast.error('Please select dates for all transactions');
      return;
    }
    
    // Check if any transaction has an error
    const invalidTx = transactions.find(tx => tx.error);
    if (invalidTx) {
      toast.error('One or more transactions have date validation errors');
      return;
    }

    setIsLoading(true);
    try {
      const formattedTransactions = transactions.map(tx => ({
        amount: tx.amount,
        date: tx.date
      }));
      
      console.log("Submitting data:", {
        ...data,
        statementDate,
        transactions: formattedTransactions,
        dueDate,
        paymentDate,
        minimumDuePaid: minDuePaid
      });
      
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          statementDate,
          transactions: formattedTransactions,
          dueDate,
          paymentDate,
          minimumDuePaid: minDuePaid
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Server error (${response.status}):`, errorData);
        throw new Error(`Server responded with ${response.status}: ${response.statusText}. Details: ${errorData}`);
      }

      const result = await response.json();
      console.log("Calculation result:", result);
      setCalculationResult(result);
      toast.success('Calculation completed successfully');
    } catch (error) {
      console.error('Calculation failed:', error);
      toast.error('Failed to calculate fees. ' + (error instanceof Error ? error.message : String(error)));
    }
    setIsLoading(false);
  };

  const handlePayment = async () => {
    if (calculationResult?.transactionId) {
      toast.loading('Initializing payment...');
      const success = await initializeRazorpayPayment(calculationResult.transactionId);
      
      if (success) {
        setIsPaid(true);
        toast.success('Payment successful!');
        
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
            const errorData = await response.text();
            console.error(`Server error (${response.status}):`, errorData);
            throw new Error(`Failed to fetch updated transaction details`);
          }
          
          const result = await response.json();
          setCalculationResult(result);
        } catch (error) {
          console.error('Failed to fetch updated details:', error);
          toast.error('Payment was successful but failed to update details: ' + (error instanceof Error ? error.message : String(error)));
        }
      } else {
        toast.error('Payment was not completed');
      }
    }
  };
  
  // Reset the form completely
  const handleReset = () => {
    reset({
      bank: '',
      outstandingAmount: undefined,
      minimumDueAmount: undefined,
      minimumDuePaid: false
    });
    setStatementDate(null);
    setDueDate(null);
    setPaymentDate(null);
    setCalculationResult(null);
    setIsPaid(false);
    setMinDuePaid(false);
    setTransactions([{ amount: 0, date: null }]);
    toast.success('Form has been reset');
  };

  // Download calculation results as PDF
  const handleDownloadPDF = () => {
    if (!calculationResult || !isPaid) {
      toast.error('Please unlock the calculation results first');
      return;
    }
    
    toast.loading('Preparing PDF for download...');
    // Placeholder for PDF generation functionality
    setTimeout(() => {
      toast.success('PDF download ready');
      toast.error('PDF download feature is coming soon');
    }, 1500);
  };

  const banks = [
    'HDFC Bank',
    'State Bank of India',
    'ICICI Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Yes Bank',
    'Punjab National Bank',
    'IDFC First Bank',
    'Citibank',
    'Standard Chartered Bank',
  ];

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Bank and Basic Information */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bank Selection */}
            <div className="space-y-2">
              <label className="form-label-enhanced flex items-center gap-2">
                <CreditCardIcon className="h-4 w-4 text-blue-600" />
                Select Your Bank
              </label>
              <select
                {...register('bank')}
                className="form-select-enhanced"
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

            {/* Outstanding Amount */}
            <div className="space-y-2">
              <label htmlFor="outstandingAmount" className="form-label-enhanced flex items-center gap-2">
                <BanknotesIcon className="h-4 w-4 text-blue-600" />
                Outstanding Amount (₹)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  id="outstandingAmount"
                  step="0.01"
                  {...register('outstandingAmount', { valueAsNumber: true })}
                  className="form-input-enhanced pl-8"
                  placeholder="0.00"
                />
              </div>
              {errors.outstandingAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.outstandingAmount.message}</p>
              )}
            </div>

            {/* Statement Date */}
            <div className="space-y-2">
              <label className="form-label-enhanced flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
                Statement Date
              </label>
              <div className="relative">
                <DatePicker
                  selected={statementDate}
                  onChange={(date: Date | null) => handleStatementDateChange(date)}
                  className="form-input-enhanced w-full"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select statement date"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="form-label-enhanced flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-indigo-600" />
                Due Date
              </label>
              <div className="relative">
                <DatePicker
                  selected={dueDate}
                  onChange={(date: Date | null) => setDueDate(date)}
                  className="form-input-enhanced w-full"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select due date"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Payment Date */}
            <div className="space-y-2">
              <label className="form-label-enhanced flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-green-600" />
                Payment Date
              </label>
              <div className="relative">
                <DatePicker
                  selected={paymentDate}
                  onChange={(date: Date | null) => setPaymentDate(date)}
                  className="form-input-enhanced w-full"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select payment date"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Minimum Due Amount */}
            <div className="space-y-2">
              <label htmlFor="minimumDueAmount" className="form-label-enhanced flex items-center gap-2">
                <BanknotesIcon className="h-4 w-4 text-green-600" />
                Minimum Due Amount (₹)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  id="minimumDueAmount"
                  step="0.01"
                  {...register('minimumDueAmount', { valueAsNumber: true })}
                  className="form-input-enhanced pl-8"
                  placeholder="0.00"
                />
              </div>
              {errors.minimumDueAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.minimumDueAmount.message}</p>
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <div className="space-y-2">
              <label className="form-label-enhanced">Minimum Due Payment Status</label>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className={`rounded-lg border ${minDuePaid ? 'border-green-200 bg-green-50 shadow-sm' : 'border-slate-200 bg-white'} p-4 flex items-center gap-2 cursor-pointer transition-all hover:shadow-sm`}
                     onClick={() => handleMinDuePaidChange(true)}>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${minDuePaid ? 'bg-green-600 border-green-600' : 'border-slate-300 bg-white'}`}>
                    {minDuePaid && <CheckIcon className="h-3.5 w-3.5 text-white" />}
                  </div>
                  <label htmlFor="minimumDuePaid-yes" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                    Minimum due amount paid
                  </label>
                </div>
                
                <div className={`rounded-lg border ${!minDuePaid ? 'border-red-200 bg-red-50 shadow-sm' : 'border-slate-200 bg-white'} p-4 flex items-center gap-2 cursor-pointer transition-all hover:shadow-sm`}
                     onClick={() => handleMinDuePaidChange(false)}>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${!minDuePaid ? 'bg-red-600 border-red-600' : 'border-slate-300 bg-white'}`}>
                    {!minDuePaid && <CheckIcon className="h-3.5 w-3.5 text-white" />}
                  </div>
                  <label htmlFor="minimumDuePaid-no" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                    Minimum due amount not paid
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Transactions</h3>
            <button 
              type="button" 
              onClick={addTransaction}
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              <PlusCircleIcon className="h-5 w-5" />
              Add Transaction
            </button>
          </div>
          
          <div className="space-y-8">
            {transactions.map((transaction, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-xl bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-medium text-slate-800">Transaction #{index + 1}</h4>
                  {transactions.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => removeTransaction(index)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Transaction Date */}
                  <div className="space-y-2">
                    <label className="form-label-enhanced flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-blue-600" />
                      Transaction Date
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={transaction.date}
                        onChange={(date: Date | null) => handleTransactionDateChange(index, date)}
                        className="form-input-enhanced w-full"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select transaction date"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-slate-400" />
                      </div>
                    </div>
                    {transaction.error && (
                      <p className="mt-1 text-sm text-amber-600">{transaction.error}</p>
                    )}
                  </div>

                  {/* Transaction Amount */}
                  <div className="space-y-2">
                    <label className="form-label-enhanced flex items-center gap-2">
                      <BanknotesIcon className="h-4 w-4 text-indigo-600" />
                      Amount (₹)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 sm:text-sm">₹</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        value={transaction.amount || ''}
                        onChange={(e) => handleTransactionAmountChange(index, e.target.value)}
                        className="form-input-enhanced pl-8"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex-1"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              <span className="inline-flex items-center">
                <span>Calculate Now</span>
                <ArrowLongRightIcon className="h-5 w-5 ml-2" />
              </span>
            )}
          </button>
          
          <button 
            type="button"
            onClick={handleReset}
            className="px-4 py-3 rounded-xl border border-slate-200 shadow-sm 
              text-slate-700 bg-white hover:bg-slate-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500
              transition-all duration-200 flex items-center justify-center"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Reset
          </button>
        </div>
      </form>

      {calculationResult && (
        <div className="space-y-6">
          <CalculationResult
            result={calculationResult}
            isPaid={isPaid}
            onPayment={handlePayment}
          />
          
          {isPaid && (
            <div className="flex justify-center">
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors shadow-sm"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                Download PDF Report
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 