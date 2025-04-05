'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      outstandingAmount: 0,
      minimumDueAmount: 0,
      minimumDuePaid: false,
      pdfPassword: '',
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const onSubmit = async (data: FormData) => {
    if (!file) {
      alert('Please upload a PDF file');
      return;
    }

    if (!dueDate || !paymentDate) {
      alert('Please select due date and payment date');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('bank', data.bank);
    formData.append('outstandingAmount', data.outstandingAmount.toString());
    formData.append('minimumDueAmount', data.minimumDueAmount.toString());
    formData.append('minimumDuePaid', data.minimumDuePaid.toString());
    formData.append('dueDate', dueDate.toISOString());
    formData.append('paymentDate', paymentDate.toISOString());
    
    if (data.pdfPassword) {
      formData.append('pdfPassword', data.pdfPassword);
    }

    try {
      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      const result = await response.json();
      setCalculationResult({
        ...result,
        // Always set payment as completed to show full results
        paymentStatus: 'COMPLETED'
      });
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Failed to process the PDF. Please try again.');
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
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Upload Your Credit Card Statement</h2>
            <div className="text-blue-600 bg-blue-50 p-2 rounded-full">
              <DocumentTextIcon className="h-6 w-6" />
            </div>
          </div>

          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-xl p-6 mb-4 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <input {...getInputProps()} />
            <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            
            {file ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Selected file:</p>
                <div className="bg-gray-100 rounded-lg p-2">
                  <p className="text-sm text-gray-800 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <p className="text-xs text-blue-600">Click or drag to replace</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {isDragActive ? 'Drop your PDF here' : 'Drag & drop your credit card statement PDF here'}
                </p>
                <p className="text-xs text-gray-500">or click to browse files</p>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">PDF Password (Optional)</label>
            <input
              type="password"
              {...register('pdfPassword')}
              className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              placeholder="Enter password if PDF is protected"
            />
            <p className="mt-1 text-xs text-gray-500">Leave empty if your PDF is not password protected</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <LightBulbIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  We'll try to automatically extract information from your statement. You can adjust the values manually if needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Statement Details</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank / Card Provider
              </label>
              <select
                {...register('bank')}
                className="mt-1 block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-opacity-80 backdrop-blur-sm transition-all duration-200 hover:bg-opacity-100"
              >
                <option value="">Select your bank</option>
                {banks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              {errors.bank && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.bank.message}
                </p>
              )}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <DatePicker
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  className="mt-1 block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-opacity-80 backdrop-blur-sm transition-all duration-200 hover:bg-opacity-100"
                  placeholderText="Select due date"
                  dateFormat="MMMM d, yyyy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Date
                </label>
                <DatePicker
                  selected={paymentDate}
                  onChange={(date) => setPaymentDate(date)}
                  className="mt-1 block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-opacity-80 backdrop-blur-sm transition-all duration-200 hover:bg-opacity-100"
                  placeholderText="Select payment date"
                  dateFormat="MMMM d, yyyy"
                />
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
          isPaid={true}
        />
      )}
    </div>
  );
} 