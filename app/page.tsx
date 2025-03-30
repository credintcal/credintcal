'use client';

import React from 'react';
import ManualEntry from './components/ManualEntry';
import PdfUpload from './components/PdfUpload';
import { Tab } from '@headlessui/react';
import { DocumentTextIcon, CalculatorIcon } from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Calculate Credit Card</span>
          <span className="block text-blue-600">Fees & Interest</span>
        </h1>
        <p className="max-w-2xl mx-auto text-base text-gray-500 sm:text-lg md:text-xl">
          Get accurate calculations for late fees and interest charges for all major banks.
          Upload your statement or enter details manually.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Instant Calculations',
            description: 'Get immediate results for your credit card fees and interest charges.',
            icon: '⚡',
          },
          {
            title: 'Multiple Banks',
            description: 'Support for all major Indian banks including HDFC, SBI, ICICI, and more.',
            icon: '🏦',
          },
          {
            title: 'Secure & Private',
            description: 'Your data is encrypted and never stored on our servers.',
            icon: '🔒',
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-4">{feature.icon}</div>
            <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
            <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Calculator Tabs */}
      <div className="bg-white rounded-2xl shadow-sm p-2">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/10 p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-3 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none',
                  selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
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
                  'w-full rounded-lg py-3 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none',
                  selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
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
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none'
              )}
            >
              <ManualEntry />
            </Tab.Panel>
            <Tab.Panel
              className={classNames(
                'rounded-xl bg-white p-6',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none'
              )}
            >
              <PdfUpload />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Trust Indicators */}
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-500">
          Trusted by thousands of users across India
        </p>
        <div className="flex justify-center space-x-8">
          {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak'].map((bank) => (
            <span
              key={bank}
              className="text-gray-400 font-medium text-sm"
            >
              {bank} Bank
            </span>
          ))}
        </div>
      </div>
    </div>
  );
} 