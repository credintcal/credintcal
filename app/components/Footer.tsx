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
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <CalculatorIcon className="h-5 w-5 text-slate-700" />
            <span className="font-semibold text-slate-900">Credit Card Calculator</span>
          </div>
          <p className="text-sm text-slate-600">
            Calculate your credit card interest and late fees accurately with our easy-to-use online tool.
          </p>
        </div>
        
        <div>
          <h3 className="font-medium text-slate-900 mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {footerLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href}
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium text-slate-900 mb-4">Credit Card Tips</h3>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100">
            <p className="text-sm text-slate-600">
              Always pay your credit card bill in full before the due date to avoid high interest charges and maintain a good credit score.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Credit Card Calculator. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 mt-2 md:mt-0">
            For educational purposes only. Contact your bank for accurate information.
          </p>
        </div>
      </div>
    </div>
  );
} 