'use client';

import React, { useState, useEffect } from 'react';
import ManualEntry from './components/ManualEntry';
import PdfUpload from './components/PdfUpload';
import { Tab } from '@headlessui/react';
import { DocumentTextIcon, CalculatorIcon, SparklesIcon, LightBulbIcon } from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const financialTips = [
  "Did you know? Even if you pay the minimum due, interest is charged on the remaining balance!",
  "Avoid hidden charges! Always pay your credit card bill in full to escape high-interest rates.",
  "Late payment? Your credit score takes a hit! Always pay on time to maintain a healthy score.",
  "Interest-free period? Only if you clear the full bill! Else, interest starts from Day 1.",
  "Missed your payment deadline? Late fees and interest charges can add up fast!",
  "One late payment can stay on your credit report for years! Stay disciplined.",
  "Credit limit ≠ Spending limit! Use only 30-40% of your limit to stay financially healthy.",
  "Maximize your rewards! Use credit cards for planned expenses and pay on time.",
  "Track your spending! Small purchases add up quickly when paid with a credit card.",
  "Pay off your dues before the statement date to maximize your interest-free period!"
];

// Function to break text into chunks preserving words
function splitTextIntoChunks(text: string, numChunks: number): string[] {
  const words = text.split(' ');
  const result: string[] = [];
  const chunkSize = Math.ceil(words.length / numChunks);
  
  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, words.length);
    if (start < words.length) {
      result.push(words.slice(start, end).join(' '));
    }
  }
  
  return result;
}

export default function Home() {
  const [tip, setTip] = useState<string>(financialTips[0]);
  const [tipLines, setTipLines] = useState<string[]>([]);
  
  // Set a random tip on page load or refresh
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * financialTips.length);
    const randomTip = financialTips[randomIndex];
    setTip(randomTip);
    setTipLines(splitTextIntoChunks(randomTip, 3));
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        
        <div className="mx-auto max-w-4xl py-12 sm:py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Calculate Credit Card
              <br />
              Interest & Late Fees
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Get accurate calculations for your credit card charges. Upload your statement or enter details manually.
            </p>
          </div>
        </div>

        {/* Financial Tip Section - Better positioning outside the main title area */}
        <div className="max-w-3xl mx-auto -mt-4 mb-12 px-4 sm:px-6 lg:px-0">
          <div className="relative group w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative p-5 bg-amber-50 rounded-lg shadow-sm border border-amber-100 leading-none flex items-start space-x-3">
              <div className="bg-amber-100 p-2 rounded-full flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                {tipLines.map((line, index) => (
                  <p key={index} className={`${index === 0 ? 'text-amber-900 font-medium text-md' : 'text-amber-800 font-normal text-md'} ${index > 0 ? 'mt-1' : ''}`}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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