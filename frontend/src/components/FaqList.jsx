import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function FaqList({ onSelect }) {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    api.get('/faqs?locale=en').then(res => setFaqs(res.data));
  }, []);

  return (
    <div className="mb-6 bg-gray-900 text-white p-4 rounded">
      <h2 className="text-lg font-semibold mb-2 text-green-400">FAQs</h2>
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
    </div>
  );
}
// This component fetches FAQs from the API and displays them in a list. When an FAQ is clicked, it calls the onSelect function with the question as an argument. The component uses Tailwind CSS for styling, including a dark background and hover effects for the FAQ items.