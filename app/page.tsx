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

      {/* Features with improved visuals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <div className="glass-card p-6 card-hover-effect">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 rounded-lg p-3 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100/80">
              <SparklesIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">Instant Results</h3>
              <p className="mt-2 text-slate-600 text-sm">
                Get immediate calculations for your credit card charges and know exactly what you'll pay.
              </p>
            </div>
          </div>
        </div>
        
        {/* Feature 2 */}
        <div className="glass-card p-6 card-hover-effect">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 rounded-lg p-3 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100/80">
              <CreditCardIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">Supports All Banks</h3>
              <p className="mt-2 text-slate-600 text-sm">
                Works with all major Indian banks including HDFC, SBI, ICICI, Axis, and more.
              </p>
            </div>
          </div>
        </div>
        
        {/* Feature 3 */}
        <div className="glass-card p-6 card-hover-effect">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 rounded-lg p-3 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100/80">
              <ShieldCheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">100% Accurate</h3>
              <p className="mt-2 text-slate-600 text-sm">
                Our calculations follow the exact same formula used by banks to determine your charges.
              </p>
            </div>
          </div>
        </div>
      </div>

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
      
      {/* FAQ Section */}
      <div className="glass-panel p-8 sm:p-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
                <BanknotesIcon className="h-5 w-5 mr-2 text-blue-600" />
                How is credit card interest calculated?
              </h3>
              <p className="text-slate-600">
                Credit card interest is typically calculated daily, based on your average daily balance. 
                The formula used is: (Outstanding Balance × Daily Interest Rate × Number of Days). 
                Our calculator takes into account the exact number of days between your transaction and payment dates.
              </p>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2 text-blue-600" />
                Are my credit card details safe?
              </h3>
              <p className="text-slate-600">
                Yes, absolutely. We don't store your full credit card information. When you upload PDF statements, 
                we only extract the necessary transaction details to perform the calculations. All calculations 
                are done securely on our servers.
              </p>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
                <CreditCardIcon className="h-5 w-5 mr-2 text-blue-600" />
                Which banks are supported?
              </h3>
              <p className="text-slate-600">
                Our calculator supports all major Indian banks including HDFC, SBI, ICICI, Axis, Kotak, Yes Bank, 
                PNB, IDFC, American Express, and Citibank. Each bank has its own specific rules for calculating 
                late fees, which our system accurately incorporates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 