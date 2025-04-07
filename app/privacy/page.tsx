export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="glass-card p-8">
          <div className="prose prose-lg dark:prose-invert">
            <h2>Introduction</h2>
            <p>
              At Credbill, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our credit card interest calculator.
            </p>

            <h2>Information We Collect</h2>
            <p>
              We collect minimal personal information to provide our services:
            </p>
            <ul>
              <li>Bank selection for calculation purposes</li>
              <li>Transaction details (amounts and dates)</li>
              <li>Payment dates and amounts</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>
              We use the collected information to:
            </p>
            <ul>
              <li>Calculate credit card interest and fees</li>
              <li>Provide accurate financial estimates</li>
              <li>Improve our calculator's accuracy</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your information:
            </p>
            <ul>
              <li>All calculations are performed locally in your browser</li>
              <li>We do not store personal or financial information</li>
              <li>Regular security updates and monitoring</li>
            </ul>

            <h2>Third-Party Services</h2>
            <p>
              We may use third-party services for:
            </p>
            <ul>
              <li>Analytics to improve our service</li>
              <li>Hosting and infrastructure</li>
              <li>Payment processing (if applicable)</li>
            </ul>

            <h2>Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Access your personal information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of data collection</li>
            </ul>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p>
              Beyondx Informatics Analytics Pvt Ltd<br />
              Email: privacy@credintcal.com
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 