# Credit Card Fee Calculator

A web application to calculate late fees and interest charges on credit card transactions.

## Features

- Calculate interest and late fees for multiple banks
- Manual transaction entry
- PDF statement upload and processing
- Secure payment integration with Razorpay
- Mobile and desktop responsive design

## Supported Banks

- HDFC Bank
- SBI Card
- ICICI Bank
- Axis Bank
- Kotak Mahindra Bank
- Yes Bank
- Punjab National Bank
- IDFC FIRST Bank
- American Express
- Citibank

## Prerequisites

- Node.js 18.x or higher
- MongoDB 4.x or higher
- Razorpay account

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/credintcal
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/credintcal.git
cd credintcal
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Start the production server:
```bash
npm start
```

## Deployment

The application is configured for deployment on Vercel. Connect your GitHub repository to Vercel for automatic deployments.

## License

MIT License 