'use client';

import React from 'react';
import ManualEntry from './components/ManualEntry';
import PdfUpload from './components/PdfUpload';
import { Tab } from '@headlessui/react';
import { 
  DocumentTextIcon, 
  CalculatorIcon, 
  SparklesIcon, 
  ShieldCheckIcon,
  CreditCardIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section - Enhanced with glass morphism */}
      <div className="relative py-12 sm:py-16 md:py-20 rounded-3xl overflow-hidden glass-panel">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200/50 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 -right-24 w-64 h-64 bg-indigo-200/50 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 left-1/4 w-72 h-72 bg-purple-200/50 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="backdrop-blur-lg bg-white/80 shadow-2xl rounded-3xl p-8 sm:p-10 border border-white/30">
              <div className="text-center">
                <div className="inline-block mb-6">
                  <div className="p-2 bg-blue-100 rounded-2xl inline-flex items-center justify-center">
                    <div className="p-2 bg-blue-50 rounded-xl">
                      <CalculatorIcon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-6 text-balance">
                  Calculate Credit Card
                  <br />
                  Interest & Late Fees
                </h1>
                <p className="text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
                  Get accurate calculations for your credit card charges. Upload your statement or enter details manually.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Key Features
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
              Everything you need to calculate your credit card interest and fees
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Multiple Transactions
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Add multiple transactions and see how they affect your total interest charges.
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Bank-Specific Calculations
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get accurate calculations based on your bank's specific policies and rates.
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                PDF Reports
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Download detailed PDF reports of your calculations for future reference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Tabs - Enhanced with improved visuals */}
      <div className="relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-blue-50 to-transparent blur-2xl opacity-50"></div>
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-indigo-50 to-transparent blur-2xl opacity-50"></div>
        </div>
        
        <div className="relative glass-panel p-6 sm:p-8">
          <div className="max-w-xl mx-auto mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Calculate Your Credit Card Fees
            </h2>
            <p className="text-slate-600">
              Enter your transaction details or upload your credit card statement to get started.
            </p>
          </div>
          
          <Tab.Group>
            <Tab.List className="flex space-x-2 rounded-xl bg-slate-100/70 backdrop-blur-sm p-1.5 max-w-md mx-auto mb-8">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-3.5 text-sm font-medium leading-5',
                    'focus:outline-none transition-all duration-200',
                    selected
                      ? 'bg-white text-blue-700 shadow-md'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-white/60'
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
                      : 'text-slate-600 hover:text-blue-600 hover:bg-white/60'
                  )
                }
              >
                <div className="flex items-center justify-center space-x-2">
                  <DocumentTextIcon className="h-5 w-5" />
                  <span>PDF Upload</span>
                </div>
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel
                className={classNames(
                  'rounded-xl bg-white p-6 shadow-sm border border-slate-100',
                  'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none'
                )}
              >
                <ManualEntry />
              </Tab.Panel>
              <Tab.Panel
                className={classNames(
                  'rounded-xl bg-white p-6 shadow-sm border border-slate-100',
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