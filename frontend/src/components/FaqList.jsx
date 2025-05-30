import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function FaqList({ onSelect }) {
  const [faqs, setFaqs] = useState([]);
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
        console.error('Error loading FAQs:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="mb-6 bg-gray-900 text-white p-4 rounded">
      <h2 className="text-lg font-semibold mb-2 text-green-400">FAQs</h2>
      {isLoading ? (
        <div className="flex items-center justify-center py-4 w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-green-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-400 text-center py-2">{error}</div>
      ) : faqs.length === 0 ? (
        <div className="text-gray-400 text-center py-2">No FAQs available</div>
      ) : (
        <ul className="space-y-1">
          {faqs.map(faq => (
            <li key={faq._id}>
              <button
                onClick={() => onSelect(faq.question)}
                className="text-white hover:text-green-300 hover:underline"
              >
                {faq.question}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}