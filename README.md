# Credit Card Fee Calculator

A web application to calculate late fees and interest charges on credit card transactions. This tool helps users understand the financial implications of late credit card payments across multiple banks in India.

## Live Demo

Visit [www.creditcardfeecalculator.com](https://www.creditcardfeecalculator.com) to see the application in action.

## Features

- Calculate interest and late fees based on payment date and due date
- Support for multiple Indian banks with accurate fee structures
- Manual transaction entry with detailed calculations
- PDF statement upload and automated processing
- Secure payment integration with Razorpay
- Responsive design for mobile and desktop
- Transaction history and reporting

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

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Payment Gateway**: Razorpay
- **PDF Processing**: pdf-parse
- **Deployment**: Vercel

## Prerequisites

- Node.js 18.x or higher
- MongoDB 4.x or higher
- Razorpay account for payment processing

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/credintcal/credintcal.git
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

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Deploy automatically from your main branch

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Contact

For any inquiries, please contact [nad.nandagiri@gmail.com](mailto:nad.nandagiri@gmail.com). 