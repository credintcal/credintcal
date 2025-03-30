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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center text-blue-600">
                <DocumentTextIcon className="h-8 w-8" />
              </div>
              <p className="text-sm font-medium text-gray-900">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                Click or drag to replace
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-center text-gray-400">
                <DocumentTextIcon className="h-8 w-8" />
              </div>
              <p className="text-sm font-medium text-gray-900">
                Drag & drop your PDF statement here
              </p>
              <p className="text-xs text-gray-500">
                or click to select a file (max 10MB)
              </p>
            </div>
          )}
        </div>

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
            PDF Password (if applicable)
          </label>
          <input
            type="password"
            {...register('pdfPassword')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
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
            Statement Period
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                dateFormat="dd/MM/yyyy"
                placeholderText="Start Date"
              />
            </div>
            <div>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                dateFormat="dd/MM/yyyy"
                placeholderText="End Date"
              />
            </div>
          </div>
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
          disabled={isLoading || !file}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            'Process & Calculate'
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