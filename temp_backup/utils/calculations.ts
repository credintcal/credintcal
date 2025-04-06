export const calculateDays = (transactionDate: Date, paymentDate: Date): number => {
  const start = new Date(transactionDate);
  const end = new Date(paymentDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Including both start and end dates
};

export const calculateInterest = (
  transactionAmount: number,
  days: number,
): number => {
  if (days <= 0) return 0;
  return (transactionAmount * 3.75 * days * 12) / (100 * 365);
};

export const getLateFee = (bank: string, outstandingAmount: number): number => {
  const amount = Number(outstandingAmount);
  
  switch (bank) {
    case 'HDFC':
      if (amount < 100) return 0;
      if (amount <= 500) return 100;
      if (amount <= 5000) return 500;
      if (amount <= 10000) return 600;
      if (amount <= 25000) return 800;
      if (amount <= 50000) return 1100;
      return 1300;

    case 'SBI':
      if (amount <= 500) return 0;
      if (amount <= 1000) return 400;
      if (amount <= 10000) return 750;
      if (amount <= 25000) return 950;
      if (amount <= 50000) return 1100;
      return 1300;

    case 'ICICI':
      if (amount < 100) return 0;
      if (amount <= 500) return 100;
      if (amount <= 5000) return 500;
      if (amount <= 10000) return 750;
      if (amount <= 25000) return 900;
      if (amount <= 50000) return 1000;
      return 1200;

    case 'Axis':
      if (amount <= 500) return 0;
      if (amount <= 5000) return 500;
      if (amount <= 10000) return 750;
      return 1200;

    case 'Kotak':
      if (amount <= 100) return 0;
      if (amount <= 500) return 100;
      if (amount <= 1000) return 500;
      if (amount <= 5000) return 750;
      if (amount <= 10000) return 750;
      if (amount <= 25000) return 1200;
      if (amount <= 50000) return 1200;
      return 1300;

    case 'IDFC':
      const lateFee = amount * 0.15;
      return Math.max(100, Math.min(lateFee, 1250));

    case 'AmericanExpress':
      const amexLateFee = amount * 0.30;
      return Math.max(500, Math.min(amexLateFee, 1000));

    case 'Citibank':
      if (amount <= 500) return 100;
      if (amount <= 5000) return 500;
      if (amount <= 10000) return 750;
      return 950;

    default:
      return 0;
  }
};

export const validateTotalAmount = (
  transactions: Array<{ amount: number }>,
  outstandingAmount: number
): boolean => {
  const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  return total <= outstandingAmount;
}; 