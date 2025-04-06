import React from 'react';
import Link from 'next/link';
import { CalculatorIcon } from '@heroicons/react/24/outline';

const footerLinks = [
  { name: 'About', href: '/about' },
  { name: 'Terms & Conditions', href: '/terms' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Refund Policy', href: '/refund' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">About</h3>
            <p className="mt-2 text-sm text-gray-300">
              A simple tool to calculate credit card charges, interest, and payment details.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="/" className="text-sm text-gray-300 hover:text-white">
                  Home
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Credit Card Tips</h3>
            <p className="mt-2 text-sm text-gray-300">
              Always pay your credit card bill in full to avoid high interest charges.
            </p>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-700 pt-4 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Credit Card Calculator. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-2 sm:mt-0">
            Disclaimer: For educational purposes only. Contact your bank for accurate information.
          </p>
        </div>
      </div>
    </footer>
  );
} 