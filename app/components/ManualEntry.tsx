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

interface FormData {
  bank: string;
  statementDate: Date;
  dueDate: Date;
  paymentDate: Date;
  transactions: Array<{
    amount: string;
    date: Date;
    error?: string;
  }>;
  totalAmount: string;
}

export default function ManualEntry() {
  const [formData, setFormData] = useState<FormData>({
    bank: '',
    statementDate: new Date(),
    dueDate: new Date(),
    paymentDate: new Date(),
    transactions: [{ amount: '', date: new Date() }],
    totalAmount: '',
  });
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [minDuePaid, setMinDuePaid] = useState(false);

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
    const newTransactions = [...formData.transactions];
    newTransactions[index].date = date;
    
    if (date && formData.statementDate) {
      const error = validateTransactionDate(date, formData.statementDate);
      newTransactions[index].error = error;
    } else {
      newTransactions[index].error = null;
    }
    
    setFormData({ ...formData, transactions: newTransactions });
  };

  // Handle transaction amount change
  const handleTransactionAmountChange = (index: number, amount: string) => {
    const newTransactions = [...formData.transactions];
    newTransactions[index].amount = parseFloat(amount) || 0;
    setFormData({ ...formData, transactions: newTransactions });
  };

  // Add new transaction
  const addTransaction = () => {
    setFormData({ ...formData, transactions: [...formData.transactions, { amount: 0, date: null }] });
    toast.success('New transaction added');
  };

  // Remove transaction
  const removeTransaction = (index: number) => {
    if (formData.transactions.length > 1) {
      const newTransactions = [...formData.transactions];
      newTransactions.splice(index, 1);
      setFormData({ ...formData, transactions: newTransactions });
      toast.success('Transaction removed');
    }
  };

  // Handle statement date change
  const handleStatementDateChange = (date: Date | null) => {
    setFormData({ ...formData, statementDate: date });
    
    // Update validation for all transactions
    if (date) {
      const newTransactions = [...formData.transactions];
      newTransactions.forEach((transaction, index) => {
        if (transaction.date) {
          const error = validateTransactionDate(transaction.date, date);
          newTransactions[index].error = error;
        }
      });
      setFormData({ ...formData, transactions: newTransactions });
    }
  };

  const handleTransactionChange = (index: number, field: 'amount' | 'date', value: string | Date) => {
    const newTransactions = [...formData.transactions];
    if (field === 'amount') {
      newTransactions[index] = {
        ...newTransactions[index],
        amount: value as string,
      };
    } else {
      newTransactions[index] = {
        ...newTransactions[index],
        date: value as Date,
      };
    }
    setFormData({ ...formData, transactions: newTransactions });
  };

  const handleDateChange = (field: 'statementDate' | 'dueDate' | 'paymentDate', date: Date) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (data: FormData) => {
    if (!formData.statementDate || !formData.dueDate || !formData.paymentDate) {
      toast.error('Please select all dates');
      return;
    }

    // Check if all transactions have dates
    const incompleteTx = formData.transactions.find(tx => !tx.date);
    if (incompleteTx) {
      toast.error('Please select dates for all transactions');
      return;
    }
    
    // Check if any transaction has an error
    const invalidTx = formData.transactions.find(tx => tx.error);
    if (invalidTx) {
      toast.error('One or more transactions have date validation errors');
      return;
    }

    setIsLoading(true);
    try {
      const formattedTransactions = formData.transactions.map(tx => ({
        amount: tx.amount,
        date: tx.date
      }));
      
      console.log("Submitting data:", {
        ...data,
        statementDate: formData.statementDate,
        transactions: formattedTransactions,
        dueDate: formData.dueDate,
        paymentDate: formData.paymentDate,
        minimumDuePaid: minDuePaid
      });
      
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          statementDate: formData.statementDate,
          transactions: formattedTransactions,
          dueDate: formData.dueDate,
          paymentDate: formData.paymentDate,
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
    setFormData({
      bank: '',
      statementDate: new Date(),
      dueDate: new Date(),
      paymentDate: new Date(),
      transactions: [{ amount: 0, date: null }],
      totalAmount: '',
    });
    setCalculationResult(null);
    setIsPaid(false);
    setMinDuePaid(false);
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Credit Card Interest Calculator
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Bank Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Bank
            </label>
            <select
              name="bank"
              value={formData.bank}
              onChange={(e) => setValue('bank', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select a bank</option>
              {banks.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>

          {/* Dates Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Statement Date
              </label>
              <DatePicker
                selected={formData.statementDate}
                onChange={(date: Date) => handleStatementDateChange(date)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                dateFormat="dd/MM/yyyy"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Due Date
              </label>
              <DatePicker
                selected={formData.dueDate}
                onChange={(date: Date) => setValue('dueDate', date)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                dateFormat="dd/MM/yyyy"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Payment Date
              </label>
              <DatePicker
                selected={formData.paymentDate}
                onChange={(date: Date) => setValue('paymentDate', date)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                dateFormat="dd/MM/yyyy"
                required
              />
            </div>
          </div>

          {/* Transactions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Transactions
              </h3>
              <button
                type="button"
                onClick={addTransaction}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Transaction
              </button>
            </div>

            {formData.transactions.map((transaction, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount
                  </label>
                  <input
                    type="number"
                    name={`transactions[${index}].amount`}
                    value={transaction.amount || ''}
                    onChange={(e) => handleTransactionAmountChange(index, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date
                  </label>
                  <DatePicker
                    selected={transaction.date}
                    onChange={(date: Date) => handleTransactionDateChange(index, date)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    dateFormat="dd/MM/yyyy"
                    required
                  />
                </div>
                {formData.transactions.length > 1 && (
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeTransaction(index)}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Total Amount */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Amount
            </label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={(e) => setValue('totalAmount', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter total amount"
              required
            />
          </div>

          {/* Minimum Due Payment Status */}
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Reset
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Calculate
            </button>
          </div>
        </form>
      </div>

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