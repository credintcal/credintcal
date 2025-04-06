'use client';

import React, { useState, useEffect } from 'react';
import { LightBulbIcon } from '@heroicons/react/24/outline';

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

// Default tip to show on first visit
const DEFAULT_TIP = "Did you know? Even if you pay the minimum due, interest is charged on the remaining balance!";

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

export default function FinancialTip() {
  const [tipLines, setTipLines] = useState<string[]>([]);
  
  // Set tip based on whether this is first visit or refresh
  useEffect(() => {
    // Check if browser environment is available (for localStorage)
    if (typeof window !== 'undefined') {
      const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
      
      let tipToShow = DEFAULT_TIP;
      
      // If user has visited before, show random tip
      if (hasVisitedBefore) {
        const otherTips = financialTips.filter(tip => tip !== DEFAULT_TIP);
        const randomIndex = Math.floor(Math.random() * otherTips.length);
        tipToShow = otherTips[randomIndex];
      } else {
        // Set flag for future visits
        localStorage.setItem('hasVisitedBefore', 'true');
      }
      
      setTipLines(splitTextIntoChunks(tipToShow, 2));
    }
  }, []);

  if (tipLines.length === 0) return null;

  return (
    <div className="relative group w-full">
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-blue-400 rounded-lg blur opacity-15 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg leading-none flex items-center space-x-3">
        <div className="bg-white/20 p-1.5 rounded-full flex-shrink-0">
          <LightBulbIcon className="h-4 w-4 text-yellow-100" />
        </div>
        <div className="flex-1">
          {tipLines.map((line, index) => (
            <p key={index} className="text-xs text-white font-normal">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
} 