'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const financialTips = [
  "Always pay your credit card bill on time to avoid late fees and interest charges.",
  "Keep your credit utilization below 30% to maintain a good credit score.",
  "Review your credit card statement regularly to catch any unauthorized charges.",
  "Consider setting up automatic payments to avoid missing due dates.",
  "Use credit cards for planned purchases, not impulse buys.",
  "Pay more than the minimum amount due to reduce interest charges.",
  "Take advantage of reward points and cashback offers.",
  "Monitor your credit score regularly to track your financial health.",
  "Keep track of all your credit card due dates in one place.",
  "Consider balance transfer options if you're paying high interest.",
  "Read the fine print of your credit card agreement carefully.",
  "Set up spending alerts to stay within your budget.",
  "Use credit cards for online purchases for better fraud protection.",
  "Keep your credit card information secure and never share it.",
  "Consider using different cards for different types of purchases."
];

export default function Header() {
  const [currentTip, setCurrentTip] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Get a random tip when component mounts
    const randomTip = financialTips[Math.floor(Math.random() * financialTips.length)];
    setCurrentTip(randomTip);

    // Set up interval to change tip every 10 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        const newRandomTip = financialTips[Math.floor(Math.random() * financialTips.length)];
        setCurrentTip(newRandomTip);
        setIsVisible(true);
      }, 500); // Half second delay for fade out/in effect
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center py-2">
        <Link href="/" className="flex items-center group">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg p-2 group-hover:from-blue-500 group-hover:to-indigo-500 transition-all duration-300 shadow-md">
              <CalculatorIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Credit Calculator
              </span>
              <span className="block text-xs text-slate-500 font-medium">
                Interest & Late Fees
              </span>
            </div>
          </div>
        </Link>
        
        {/* Financial Tip with improved styling - Desktop */}
        <div className="hidden md:block max-w-lg">
          <div className="rounded-full px-4 py-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100/80">
            <motion.div 
              className="py-2 text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -10 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm text-blue-600 dark:text-blue-400">
                💡 Financial Tip: {currentTip}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Financial Tip - Mobile */}
      <div className="md:hidden">
        <div className="rounded-full px-4 py-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100/80">
          <motion.div 
            className="py-2 text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -10 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm text-blue-600 dark:text-blue-400">
              💡 Financial Tip: {currentTip}
            </p>
          </motion.div>
        </div>
      </div>

      <nav className="hidden md:flex space-x-8">
        <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
          Calculator
        </Link>
        <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
          Privacy
        </Link>
      </nav>
    </div>
  );
} 