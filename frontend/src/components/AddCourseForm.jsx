import React, { useState } from 'react';
import api from '../services/api';

export default function AddCourseForm() {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/courses', { code, title, description, locale: 'en' });
    setCode('');
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Course Code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="w-full border p-2"
        />
      </div>
      <div>
        <label className="block">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border p-2"
        />
      </div>
      <div>
        <label className="block">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border p-2"
        />
      </div>
      <button type="submit" className="btn">Add Course</button>
    </form>
  );
}