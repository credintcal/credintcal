'use client';

import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import ManualEntry from './components/ManualEntry';
import PdfUpload from './components/PdfUpload';

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
        Credit Card Fee Calculator
      </h1>
      
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                 ${
                   selected
                     ? 'bg-white shadow'
                     : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                 }`
              }
            >
              Manual Entry
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                 ${
                   selected
                     ? 'bg-white shadow'
                     : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                 }`
              }
            >
              Upload PDF
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-6">
            <Tab.Panel>
              <ManualEntry />
            </Tab.Panel>
            <Tab.Panel>
              <PdfUpload />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
} 