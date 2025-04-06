import React from 'react';

interface BankLogoProps {
  bank: string;
  className?: string;
}

// Define component to display bank logo based on bank name
export function BankLogo({ bank, className = "h-5 w-5" }: BankLogoProps) {
  const defaultClassName = `${className} inline-block mr-2`;
  
  // Match bank name and return appropriate logo
  switch (bank) {
    case 'HDFC Bank':
      return (
        <svg className={defaultClassName} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#004C8F" />
          <path d="M6 12.5L10.5 8H18L13.5 12.5L18 17H10.5L6 12.5Z" fill="white" />
        </svg>
      );
    case 'State Bank of India':
      return (
        <svg className={defaultClassName} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#2D5DA9" />
          <circle cx="12" cy="12" r="6" fill="white" />
          <path d="M10 9L14 12L10 15V9Z" fill="#2D5DA9" />
        </svg>
      );
    case 'ICICI Bank':
      return (
        <svg className={defaultClassName} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#F58220" />
          <path d="M6 12H18M12 6V18" stroke="white" strokeWidth="2" />
        </svg>
      );
    case 'Axis Bank':
      return (
        <svg className={defaultClassName} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#97144D" />
          <path d="M6 12L12 6L18 12L12 18L6 12Z" fill="white" stroke="white" />
        </svg>
      );
    case 'Kotak Mahindra Bank':
      return (
        <svg className={defaultClassName} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#FF0000" />
          <path d="M6 8H18V16H6V8Z" fill="white" />
          <path d="M9 11L15 11" stroke="#FF0000" strokeWidth="1.5" />
          <path d="M9 13L15 13" stroke="#FF0000" strokeWidth="1.5" />
        </svg>
      );
    case 'Yes Bank':
      return (
        <svg className={defaultClassName} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#0060AA" />
          <path d="M6 9H18V15H6V9Z" fill="white" />
          <path d="M9 12H15" stroke="#0060AA" strokeWidth="2" />
        </svg>
      );
    case 'Punjab National Bank':
      return (
        <svg className={defaultClassName} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#192F5D" />
          <circle cx="12" cy="12" r="5" fill="#FCBB30" />
        </svg>
      );
    case 'IDFC First Bank':
      return (
        <svg className={defaultClassName} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#00ABE7" />
          <path d="M6 9H18L12 15L6 9Z" fill="white" />
        </svg>
      );
    case 'Citibank':
      return (
        <svg className={defaultClassName} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#003B70" />
          <path d="M6 9H18V15H6V9Z" fill="white" />
          <path d="M12 9V15" stroke="#003B70" strokeWidth="1.5" />
        </svg>
      );
    case 'Standard Chartered Bank':
      return (
        <svg className={defaultClassName} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#0F5C94" />
          <path d="M7 12H17M12 7V17" stroke="white" strokeWidth="2" />
        </svg>
      );
    default:
      return (
        <svg className={defaultClassName} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#E5E7EB" />
          <path d="M12 6V18M6 12H18" stroke="#6B7280" strokeWidth="2" />
        </svg>
      );
  }
}

// Component for displaying bank logo and name in selector
export function BankOption({ bank }: { bank: string }) {
  return (
    <div className="flex items-center">
      <BankLogo bank={bank} />
      <span>{bank}</span>
    </div>
  );
} 