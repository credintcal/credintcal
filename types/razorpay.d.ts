declare namespace Razorpay {
  interface IRazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    order_id: string;
    handler: (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) => void;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: {
      [key: string]: string;
    };
    theme?: {
      color?: string;
    };
    modal?: {
      ondismiss?: () => void;
    };
    config?: any;
  }

  interface IRazorpayInstance {
    on(event: string, callback: Function): void;
    open(): void;
    close(): void;
  }
}

declare class Razorpay {
  constructor(options: Razorpay.IRazorpayOptions);
  on(event: string, callback: Function): void;
  open(): void;
  close(): void;
} 