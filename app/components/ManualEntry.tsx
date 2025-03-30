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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!transactionDate || !dueDate || !paymentDate) {
      alert('Please select all dates');
      return;
    }

    setIsLoading(true);
    try {
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
        }),
      });

      const result = await response.json();
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Bank</label>
          <select
            {...register('bank')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Outstanding Amount (₹)
          </label>
          <input
            type="number"
            {...register('outstandingAmount', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.outstandingAmount && (
            <p className="mt-1 text-sm text-red-600">
              {errors.outstandingAmount.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Transaction Amount (₹)
          </label>
          <input
            type="number"
            {...register('transactionAmount', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.transactionAmount && (
            <p className="mt-1 text-sm text-red-600">
              {errors.transactionAmount.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Transaction Date
          </label>
          <DatePicker
            selected={transactionDate}
            onChange={(date) => setTransactionDate(date)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Date
          </label>
          <DatePicker
            selected={paymentDate}
            onChange={(date) => setPaymentDate(date)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Minimum Due Amount (₹)
          </label>
          <input
            type="number"
            {...register('minimumDueAmount', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('minimumDuePaid')}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Minimum due amount paid by due date
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Calculating...
            </div>
          ) : (
            'Calculate'
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