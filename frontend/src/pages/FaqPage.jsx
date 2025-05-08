import React, { useState, useEffect } from 'react';
import FaqList from '../components/FaqList';
import api from '../services/api'

export default function FaqPage() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    api.get('/faqs?locale=en').then(res => setFaqs(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl mb-6 text-green-400">All FAQs</h2>
      <div className="space-y-4">
        {faqs.map(faq => (
          <div key={faq._id} className="bg-gray-800 p-4 rounded-lg">
            <button
              onClick={() => setOpenId(openId === faq._id ? null : faq._id)}
              className="w-full text-left text-lg font-medium text-white hover:text-green-300"
            >
              {faq.question}
            </button>
            {openId === faq._id && (
              <p className="mt-2 text-gray-200">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
    )};
