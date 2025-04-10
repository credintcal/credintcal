'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { initializeRazorpayPayment } from '../../utils/payment';
import CalculationResult from './CalculationResult';

const schema = z.object({
  bank: z.string().min(1, 'Bank is required'),
  outstandingAmount: z.number().min(0, 'Outstanding amount must be positive'),
  minimumDueAmount: z.number().min(0, 'Minimum due amount must be positive'),
  minimumDuePaid: z.boolean(),
  transactionAmount: z.number().min(0, 'Transaction amount must be positive'),
});

type FormData = z.infer<typeof schema>;

export default function ManualEntry() {
  const [transactionDate, setTransactionDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);
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
      outstandingAmount: 0,
      minimumDueAmount: 0, 
      transactionAmount: 0,
      minimumDuePaid: false
    }
  });

  // Update form value when radio changes
  const handleMinDuePaidChange = (value: boolean) => {
    setMinDuePaid(value);
    setValue('minimumDuePaid', value);
  };

  const onSubmit = async (data: FormData) => {
    if (!transactionDate || !dueDate || !paymentDate) {
      alert('Please select all dates');
      return;
    }

    setIsLoading(true);
    try {
      console.log("Submitting data:", {
        ...data,
        transactionDate,
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
          transactionDate,
          dueDate,
          paymentDate,
          minimumDuePaid: minDuePaid
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Calculation result:", result);
      setCalculationResult(result);
    } catch (error) {
      console.error('Calculation failed:', error);
      alert('Failed to calculate fees. Please try again.');
    }
    setIsLoading(false);
  };

  const handlePayment = async () => {
    if (calculationResult?.transactionId) {
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
          const result = await response.json();
          setCalculationResult(result);
        } catch (error) {
          console.error('Failed to fetch updated details:', error);
        }
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
                  {...register('outstandingAmount', { valueAsNumber: true })}
                  className="block w-full pl-8 pr-12 py-3 border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 shadow-sm hover:border-indigo-300"
                  placeholder="0.00"
                />
              </div>
              {errors.outstandingAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.outstandingAmount.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="transactionAmount" className="block text-sm font-medium text-gray-700">
                Transaction Amount (₹)
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  id="transactionAmount"
                  step="0.01"
                  {...register('transactionAmount', { valueAsNumber: true })}
                  className="block w-full pl-8 pr-12 py-3 border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 shadow-sm hover:border-indigo-300"
                  placeholder="0.00"
                />
              </div>
              {errors.transactionAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.transactionAmount.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {...register('minimumDueAmount', { valueAsNumber: true })}
                    className="block w-full pl-8 pr-12 py-3 border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 shadow-sm hover:border-indigo-300"
                    placeholder="0.00"
                  />
                </div>
                {errors.minimumDueAmount && (
                  <p className="mt-1 text-sm text-red-600">{errors.minimumDueAmount.message}</p>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-4 rounded-xl border border-indigo-100">
              <fieldset>
                <legend className="text-base font-medium text-indigo-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Payment Status
                </legend>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      id="minimumDuePaid-yes"
                      type="radio"
                      name="minimumDuePaid"
                      checked={minDuePaid === true}
                      onChange={() => handleMinDuePaidChange(true)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <label htmlFor="minimumDuePaid-yes" className="ml-3 block text-sm font-medium text-gray-700">
                      Minimum due amount paid
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="minimumDuePaid-no"
                      type="radio"
                      name="minimumDuePaid"
                      checked={minDuePaid === false}
                      onChange={() => handleMinDuePaidChange(false)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <label htmlFor="minimumDuePaid-no" className="ml-3 block text-sm font-medium text-gray-700">
                      Minimum due amount not paid
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Transaction Date
            </label>
            <div className="relative">
              <DatePicker
                selected={transactionDate}
                onChange={(date) => setTransactionDate(date)}
                className="mt-1 block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-sm transition-all duration-200 hover:bg-white"
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <div className="relative">
              <DatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                className="mt-1 block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-sm transition-all duration-200 hover:bg-white"
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Payment Date
            </label>
            <div className="relative">
              <DatePicker
                selected={paymentDate}
                onChange={(date) => setPaymentDate(date)}
                className="mt-1 block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-sm transition-all duration-200 hover:bg-white"
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate
            </span>
          )}
        </button>
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