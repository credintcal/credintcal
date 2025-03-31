'use client';

import React from 'react';
import ManualEntry from './components/ManualEntry';
import PdfUpload from './components/PdfUpload';
import { Tab } from '@headlessui/react';
import { DocumentTextIcon, CalculatorIcon, SparklesIcon } from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section - Redesigned to look more professional and less like an ad */}
      <div className="relative isolate overflow-hidden pt-14 pb-20 bg-white rounded-xl shadow-md">
        
        {/* Background with softer gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-xl"></div>
          
          {/* More subtle blob elements */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute top-1/4 -right-24 w-64 h-64 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-24 left-1/4 w-72 h-72 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-4xl px-6 sm:px-8 lg:px-10">
          {/* Content container with improved spacing and layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Text content - aligned left for more professional appearance */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 mb-2">
                <SparklesIcon className="h-4 w-4 mr-1.5" />
                <span>Credit Card Calculator</span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Calculate Credit Card Interest & Late Fees
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                Get accurate calculations for your credit card charges. Upload your statement or enter details manually to see exactly what you owe.
              </p>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Safe & secure</span>
                
                <span className="mx-2">•</span>
                
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>100% accurate</span>
                
                <span className="mx-2">•</span>
                
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Free to use</span>
              </div>
            </div>
            
            {/* Visual element - aligned right */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative h-64 w-64">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl opacity-10 blur-md"></div>
                <div className="relative h-full w-full flex items-center justify-center">
                  <CalculatorIcon className="h-32 w-32 text-indigo-600/70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative p-6 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
            <SparklesIcon className="h-8 w-8 text-purple-600" />
            <div className="space-y-2">
              <p className="text-slate-800 font-medium">Instant Results</p>
              <p className="text-slate-600 text-sm">Get immediate calculations for your credit card charges</p>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative p-6 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            <div className="space-y-2">
              <p className="text-slate-800 font-medium">PDF Upload</p>
              <p className="text-slate-600 text-sm">Upload your statement for automatic processing</p>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative p-6 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
            <CalculatorIcon className="h-8 w-8 text-green-600" />
            <div className="space-y-2">
              <p className="text-slate-800 font-medium">Accurate Calculations</p>
              <p className="text-slate-600 text-sm">Precise interest and late fee computations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Tabs */}
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <Tab.Group>
            <Tab.List className="flex space-x-2 rounded-xl bg-gray-100 p-1.5">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-3.5 text-sm font-medium leading-5',
                    'focus:outline-none transition-all duration-200',
                    selected
                      ? 'bg-white text-blue-700 shadow-md'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-white/60'
                  )
                }
              >
                <div className="flex items-center justify-center space-x-2">
                  <CalculatorIcon className="h-5 w-5" />
                  <span>Manual Entry</span>
                </div>
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-3.5 text-sm font-medium leading-5',
                    'focus:outline-none transition-all duration-200',
                    selected
                      ? 'bg-white text-blue-700 shadow-md'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-white/60'
                  )
                }
              >
                <div className="flex items-center justify-center space-x-2">
                  <DocumentTextIcon className="h-5 w-5" />
                  <span>PDF Upload</span>
                </div>
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-4">
              <Tab.Panel
                className={classNames(
                  'rounded-xl bg-white p-6',
                  'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none'
                )}
              >
                <ManualEntry />
              </Tab.Panel>
              <Tab.Panel
                className={classNames(
                  'rounded-xl bg-white p-6',
                  'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none'
                )}
              >
                <PdfUpload />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
} 