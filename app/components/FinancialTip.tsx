'use client';

import React from 'react';

// Array of financial tips
const tips = [
  "Did you know? Even if you pay the minimum due, interest is charged on the remaining balance!",
  "Avoid hidden charges! Always pay your credit card bill in full to escape high-interest rates.",
  "Late payment? Your credit score takes a hit! Always pay on time to maintain a healthy score.",
  "Credit cards have an interest-free period only if you pay the full amount by the due date.",
  "Missed your payment deadline? Late fees and interest charges can add up fast!",
  "One late payment can stay on your credit report for years! Stay disciplined.",
  "Most banks charge 3-4% interest per month on unpaid credit card balances.",
  "Maximize your rewards! Use credit cards for planned expenses and pay on time.",
  "Paying just the minimum due can trap you in a debt cycle for years!",
  "Pay off your dues before the statement date to maximize your interest-free period!"
];

// Default tip to use if random selection fails
const DEFAULT_TIP = "Did you know? Even if you pay the minimum due, interest is charged on the remaining balance!";

export default function FinancialTip() {
  // Select a random tip
  const randomTip = tips[Math.floor(Math.random() * tips.length)] || DEFAULT_TIP;

  return (
    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-xs text-blue-100 font-medium">
          {randomTip}
        </p>
      </div>
    </div>
  );
} 