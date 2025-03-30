export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About Us</h1>
      
      <div className="prose prose-blue max-w-none space-y-12">
        {/* Company Overview Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
          <p className="text-lg text-gray-700 leading-relaxed">
            At Credbill, we simplify credit card fee calculations, helping you avoid hidden charges and optimize your payments. 
            Our goal is to empower users with financial awareness, ensuring smart credit card usage.
          </p>
        </section>

        {/* Founder Section */}
        <section className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">About the Founder</h2>
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Credbill is founded by <span className="font-semibold">Aditya Nandagiri</span>, an award-winning 
                innovator recognized by the State Innovation Cell, Government of Telangana for four years. With expertise 
                in First Principles Innovation, he has led multiple startups, secured investments, and developed patented products.
              </p>
              <div className="flex items-center space-x-4 pt-4">
                <a 
                  href="https://www.linkedin.com/in/aditya-nanda/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Connect on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="border-t border-gray-200 pt-12">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8">
            <p className="text-lg font-medium text-gray-900 italic">
              With Credbill, take control of your credit card payments, avoid unnecessary fees, and make informed financial decisions!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
} 