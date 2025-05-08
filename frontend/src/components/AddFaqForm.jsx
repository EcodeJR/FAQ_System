import React, { useState } from 'react';
import api from '../services/api';

export default function AddFaqForm() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/faqs', { question, answer, locale: 'en' });
    setQuestion('');
    setAnswer('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Question</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          className="w-full border p-2"
        />
      </div>
      <div>
        <label className="block">Answer</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
          className="w-full border p-2"
        />
      </div>
      <button type="submit" className="btn">Add FAQ</button>
    </form>
  );
}