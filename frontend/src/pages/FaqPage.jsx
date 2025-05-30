import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function FaqPage() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    api.get('/faqs?locale=en')
      .then(res => {
        setFaqs(res.data);
      })
      .catch(err => {
        setError('Failed to load FAQs');
        console.error("Error fetching FAQs:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl mb-6 text-green-400 font-bold border-b border-gray-700 pb-4">
          All FAQs
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-400 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-red-400 text-center py-8 bg-gray-800 rounded-lg">
            {error}
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-gray-400 text-center py-8 bg-gray-800 rounded-lg">
            No FAQs available
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map(faq => (
              <div 
                key={faq._id} 
                className="bg-gray-800 p-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-900/20"
              >
                <button
                  onClick={() => setOpenId(openId === faq._id ? null : faq._id)}
                  className="w-full text-left"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white group-hover:text-green-300">
                      {faq.question}
                    </h3>
                    <svg 
                      className={`w-5 h-5 text-green-400 transition-transform duration-200 ${
                        openId === faq._id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </button>
                {openId === faq._id && (
                  <p className="mt-4 text-gray-300 border-t border-gray-700 pt-4">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}