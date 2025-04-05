export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Policy on Privacy</h1>
      
      <div className="prose prose-blue max-w-none">
        <p className="text-lg mb-8">
          This privacy policy outlines how we handle your information and protect your privacy.
        </p>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <section key={index} className="border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h2>
              {section.content.map((paragraph, pIndex) => (
                <p key={pIndex} className="text-gray-600 mb-4">{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

const sections = [
  {
    title: "SECTION 1 - WHAT DO WE DO WITH YOUR INFORMATION?",
    content: [
      "When you use our calculator, we only collect the information you voluntarily provide, such as your name and email address for account creation, and any financial data you input for calculations.",
      "We may use this information to improve our service and personalize your experience.",
      "Your calculation data is stored securely in our database to provide you with a history of your calculations.",
      "We will never sell, trade, or transfer your personally identifiable information to third parties.",
    ],
  },
  {
    title: "SECTION 2 - CONSENT",
    content: [
      "By using our site, you consent to our privacy policy.",
      "If you provide us with personal information for account creation or any other purpose, we assume you consent to our collecting it and using it for that specific reason only.",
      "If we ask for your personal information for a secondary reason, like marketing, we will either ask you directly for your consent, or provide you with an opportunity to say no.",
    ],
  },
  {
    title: "SECTION 3 - DISCLOSURE",
    content: [
      "We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.",
      "We use industry-standard measures to protect your personal information, but no method of transmission over the Internet or electronic storage is 100% secure.",
    ],
  },
  {
    title: "SECTION 5 - THIRD-PARTY SERVICES",
    content: [
      "In general, the third-party providers used by us will only collect, use and disclose your information to the extent necessary to allow them to perform the services they provide to us.",
      "However, certain third-party service providers, such as payment gateways and other payment transaction processors, have their own privacy policies in respect to the information we are required to provide to them for your purchase-related transactions.",
      "For these providers, we recommend that you read their privacy policies so you can understand the manner in which your personal information will be handled by these providers.",
      "Once you leave our website or are redirected to a third-party website or application, you are no longer governed by this Privacy Policy or our website's Terms of Service."
    ],
  },
  {
    title: "SECTION 6 - SECURITY",
    content: [
      "To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.",
      "If you provide us with your credit card information, the information is encrypted using secure socket layer technology (SSL) and stored with AES-256 encryption. We follow all PCI-DSS requirements and implement additional generally accepted industry standards."
    ],
  },
  {
    title: "SECTION 7 - COOKIES",
    content: [
      "We use cookies to maintain session information and to enhance your experience of our site. You can control cookies through your browser settings.",
      "Our cookies help us understand how you use our site so we can improve it."
    ],
  },
  {
    title: "SECTION 8 - AGE OF CONSENT",
    content: [
      "By using this site, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site."
    ],
  },
  {
    title: "SECTION 9 - CHANGES TO THIS PRIVACY POLICY",
    content: [
      "We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will take effect immediately upon their posting on the website.",
      "If we make material changes to this policy, we will notify you here that it has been updated, so that you are aware of what information we collect, how we use it, and under what circumstances, if any, we use and/or disclose it."
    ],
  },
  {
    title: "SECTION 10 - CONTACT INFORMATION",
    content: [
      "If you would like to: access, correct, amend or delete any personal information we have about you, register a complaint, or simply want more information contact us at support@credintcal.co.in",
    ],
  },
]; 