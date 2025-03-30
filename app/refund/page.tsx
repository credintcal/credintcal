export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund Policy</h1>
      
      <div className="prose prose-blue max-w-none">
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
    title: "Returns",
    content: [
      "Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately we can't offer you a refund or exchange.",
      "To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.",
      "Several types of goods are exempt from being returned. Perishable goods such as food, flowers, newspapers or magazines cannot be returned. We also do not accept products that are intimate or sanitary goods, hazardous materials, or flammable liquids or gases.",
      "Additional non-returnable items:",
      "• Gift cards",
      "• Downloadable software products",
      "• Some health and personal care items",
      "To complete your return, we require a receipt or proof of purchase.",
      "Please do not send your purchase back to the manufacturer.",
      "There are certain situations where only partial refunds are granted: (if applicable)",
      "• Book with obvious signs of use",
      "• CD, DVD, VHS tape, software, video game, cassette tape, or vinyl record that has been opened",
      "• Any item not in its original condition, is damaged or missing parts for reasons not due to our error",
      "• Any item that is returned more than 30 days after delivery",
    ],
  },
  {
    title: "Refunds",
    content: [
      "Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.",
      "If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.",
    ],
  },
  {
    title: "Late or Missing Refunds",
    content: [
      "If you haven't received a refund yet, first check your bank account again.",
      "Then contact your credit card company, it may take some time before your refund is officially posted.",
      "Next contact your bank. There is often some processing time before a refund is posted.",
      "If you've done all of this and you still have not received your refund yet, please contact us at team@switch-phone.in.",
    ],
  },
  {
    title: "Sale Items",
    content: [
      "Only regular priced items may be refunded, unfortunately sale items cannot be refunded.",
    ],
  },
  {
    title: "Exchanges",
    content: [
      "We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at team@switch-phone.in and send your item to: 622 Manglam Electronic Market Jaipur Rajasthan India 302001.",
    ],
  },
  {
    title: "Gifts",
    content: [
      "If the item was marked as a gift when purchased and shipped directly to you, you'll receive a gift credit for the value of your return. Once the returned item is received, a gift certificate will be mailed to you.",
      "If the item wasn't marked as a gift when purchased, or the gift giver had the order shipped to themselves to give to you later, we will send a refund to the gift giver and he will find out about your return.",
    ],
  },
  {
    title: "Shipping",
    content: [
      "To return your product, you should mail your product to: 622 Manglam Electronic Market Jaipur Rajasthan India 302001.",
      "You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.",
      "Depending on where you live, the time it may take for your exchanged product to reach you, may vary.",
      "If you are shipping an item over $75, you should consider using a trackable shipping service or purchasing shipping insurance. We don't guarantee that we will receive your returned item.",
    ],
  },
]; 