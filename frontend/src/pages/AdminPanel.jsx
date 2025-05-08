import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  return (
    <div className="h-screen w-full p-6 bg-gray-900 text-white">
      <h2 className="text-2xl mb-4">Admin Panel</h2>
      <div className="flex flex-col space-y-2">
        <Link to="/faqs/new" className="btn">Add FAQ</Link>
        <Link to="/courses/new" className="btn">Add Course</Link>
      </div>
    </div>
  );
}