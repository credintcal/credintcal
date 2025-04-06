import React from 'react';
import Link from 'next/link';
import { CalculatorIcon } from '@heroicons/react/24/outline';

const footerLinks = [
  { name: 'About', href: '/about' },
  { name: 'Terms & Conditions', href: '/terms' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Refund Policy', href: '/refund' },
];

interface FooterProps {
  tip: string;
}

export default function Footer({ tip }: FooterProps) {
  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CalculatorIcon className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-semibold text-white">Credbill</span>
            </div>
            <p className="text-gray-400 text-sm">
              Credit Card Calculator
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Did You Know section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Credit Card Tips</h3>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-blue-900/50 rounded-full flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {tip}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 