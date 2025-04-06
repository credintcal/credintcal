"use client";

import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-center" />
      <Analytics />
    </>
  );
} 