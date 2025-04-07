'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: 'What is Credbill?',
    answer: 'Credbill is a modern credit card interest calculator that helps you understand and calculate your credit card interest charges and late fees. It provides accurate calculations based on your bank\'s policies and helps you make informed financial decisions.'
  },
  {
    question: 'How accurate are the calculations?',
    answer: 'Our calculations are based on the latest policies and rates from major Indian banks. We continuously update our database to ensure accuracy. However, for the most precise results, we recommend checking with your bank directly.'
  },
  {
    question: 'Which banks are supported?',
    answer: 'We support all major Indian banks including HDFC, SBI, ICICI, Axis, and more. Our database is regularly updated to include new banks and policy changes.'
  },
  {
    question: 'How do I use the calculator?',
    answer: 'Simply select your bank, enter your transaction details, and the calculator will provide you with an estimate of your interest charges and late fees. The more accurate your input, the more precise the results will be.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take data security very seriously. All calculations are performed locally in your browser, and we do not store any personal or financial information.'
  },
  {
    question: 'Why should I pay my credit card bill on time?',
    answer: 'Paying your credit card bill on time helps you avoid late fees and interest charges. It also helps maintain a good credit score, which is important for future loans and credit applications.'
  },
  {
    question: 'What happens if I miss a payment?',
    answer: 'Missing a payment can result in late fees and interest charges. It may also negatively impact your credit score. We recommend setting up automatic payments or reminders to avoid missing due dates.'
  },
  {
    question: 'How can I reduce my credit card interest?',
    answer: 'The best way to reduce credit card interest is to pay your bill in full and on time. You can also consider transferring your balance to a card with a lower interest rate or negotiating with your bank for better terms.'
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Find answers to common questions about Credbill and credit card management
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="glass-card overflow-hidden"
              initial={false}
              animate={{ height: 'auto' }}
            >
              <button
                className="w-full px-6 py-4 text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 pb-4"
                  >
                    <div className="prose prose-lg dark:prose-invert">
                      <p>{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 