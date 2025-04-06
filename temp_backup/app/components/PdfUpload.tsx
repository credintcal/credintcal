'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { initializeRazorpayPayment } from '../../utils/payment';
import CalculationResult from './CalculationResult';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { LightBulbIcon } from '@heroicons/react/24/outline';

const schema = z.object({
  bank: z.string().min(1, 'Bank is required'),
  outstandingAmount: z.number().min(0, 'Outstanding amount must be positive'),
  minimumDueAmount: z.number().min(0, 'Minimum due amount must be positive'),
  minimumDuePaid: z.boolean(),
  pdfPassword: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function PdfUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!file || !dueDate || !paymentDate || !startDate || !endDate) {
      alert('Please provide all required information');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', JSON.stringify({
      ...data,
      dueDate,
      paymentDate,
      startDate,
      endDate,
    }));

    setIsLoading(true);
    try {
      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setCalculationResult(result);
    } catch (error) {
      console.error('PDF processing failed:', error);
      alert('Failed to process PDF. Please try again.');
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
          const response = await fetch('/api/process-pdf', {
            method: 'POST',
            body: JSON.stringify({
              transactionId: calculationResult.transactionId,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
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
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
        <div className="relative flex items-start p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100">
          <div className="flex-shrink-0 mr-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-md font-bold text-blue-800 mb-1">Pro Tip</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              For the most reliable experience, we recommend using the <span className="font-semibold text-indigo-600">Manual Entry</span> option. PDF upload feature is currently in beta testing.
            </p>
          </div>
        </div>
      </div>

      {!isLoading && (
        <div className="mt-2">
          <div className="rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-4 border border-indigo-100">
            <div className="flex items-center">
              <span className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mr-3">
                <LightBulbIcon className="h-5 w-5 text-indigo-600" />
              </span>
              <h4 className="font-medium text-indigo-700">Pro tip</h4>
            </div>
            <p className="mt-1 text-sm text-gray-600 ml-12">
              For accurate results, ensure your PDF statement is from a recognized bank. 
              The clearer the data format, the better the results.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div
          {...getRootProps()}
          className={`overflow-hidden relative border-2 dashed rounded-2xl transition-all duration-300 group
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50 shadow-lg' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 hover:shadow-md'
            }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white/10 to-indigo-50/30 rounded-2xl"></div>
          <div className="p-10 text-center relative">
            <input {...getInputProps()} />
            {file ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center text-blue-600">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <DocumentTextIcon className="h-8 w-8" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900 mt-2">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Click or drag to replace
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center text-gray-400">
                  <div className="p-3 bg-gray-100 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors duration-300">
                    <DocumentTextIcon className="h-8 w-8" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900 mt-2">
                  Drag & drop your PDF statement here
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  or click to select a file (max 10MB)
                </p>
              </div>
            )}
          </div>
        </div>

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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              PDF Password (if applicable)
            </label>
            <input
              type="password"
              {...register('pdfPassword')}
              className="mt-1 block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-sm transition-all duration-200 hover:bg-white"
              placeholder="Leave blank if not password protected"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Outstanding Amount (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                {...register('outstandingAmount', { valueAsNumber: true })}
                className="mt-1 block w-full pl-10 pr-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-sm transition-all duration-200 hover:bg-white"
                placeholder="0.00"
              />
            </div>
            {errors.outstandingAmount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.outstandingAmount.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Statement Period
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="mt-1 block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-opacity-80 backdrop-blur-sm transition-all duration-200 hover:bg-opacity-100"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Start Date"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className="mt-1 block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-opacity-80 backdrop-blur-sm transition-all duration-200 hover:bg-opacity-100"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="End Date"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
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
                className="mt-1 block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-opacity-80 backdrop-blur-sm transition-all duration-200 hover:bg-opacity-100"
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
                className="mt-1 block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-opacity-80 backdrop-blur-sm transition-all duration-200 hover:bg-opacity-100"
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
              Minimum Due Amount (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                {...register('minimumDueAmount', { valueAsNumber: true })}
                className="mt-1 block w-full pl-10 pr-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-opacity-80 backdrop-blur-sm transition-all duration-200 hover:bg-opacity-100"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex items-center h-full pt-8">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('minimumDuePaid')}
                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 transition-colors"
              />
              <span className="ml-3 text-sm text-gray-700">
                Minimum due amount paid by due date
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !file}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Process & Calculate
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