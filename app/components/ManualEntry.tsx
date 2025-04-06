'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { initializeRazorpayPayment } from '../../utils/payment';
import CalculationResult from './CalculationResult';
import { 
  BanknotesIcon, 
  CalendarIcon, 
  CreditCardIcon,
  ArrowLongRightIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

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
      toast.error('Please select all dates');
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
    <div className="space-y-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
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

            {/* Transaction Date */}
            <div className="space-y-2">
              <label className="form-label-enhanced flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
                Transaction Date
              </label>
              <div className="relative">
                <DatePicker
                  selected={transactionDate}
                  onChange={(date) => setTransactionDate(date)}
                  className="form-input-enhanced w-full"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select transaction date"
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
                  onChange={(date) => setDueDate(date)}
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
                  onChange={(date) => setPaymentDate(date)}
                  className="form-input-enhanced w-full"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select payment date"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
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

            {/* Transaction Amount */}
            <div className="space-y-2">
              <label htmlFor="transactionAmount" className="form-label-enhanced flex items-center gap-2">
                <BanknotesIcon className="h-4 w-4 text-indigo-600" />
                Transaction Amount (₹)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  id="transactionAmount"
                  step="0.01"
                  {...register('transactionAmount', { valueAsNumber: true })}
                  className="form-input-enhanced pl-8"
                  placeholder="0.00"
                />
              </div>
              {errors.transactionAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.transactionAmount.message}</p>
              )}
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
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
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