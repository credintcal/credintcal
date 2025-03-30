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
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden pt-10 pb-16">
        {/* Single, unified gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-indigo-50 to-white"></div>
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-blue-100 to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-purple-100 to-transparent"></div>
        </div>
        
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 blur-3xl"></div>
            
            {/* Content box with consistent styling */}
            <div className="backdrop-blur-sm bg-white/70 shadow-xl rounded-2xl p-8 sm:p-10 border border-gray-100">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-6">
                  Calculate Credit Card
                  <br />
                  Interest & Late Fees
                </h1>
                <p className="text-lg leading-8 text-gray-700 max-w-2xl mx-auto">
                  Get accurate calculations for your credit card charges. Upload your statement or enter details manually.
                </p>
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
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20"></div>
        <div className="relative bg-white rounded-2xl shadow-sm p-4">
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