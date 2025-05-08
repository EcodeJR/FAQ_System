import React from 'react';
import AddFaqForm from '../../components/AddFaqForm';

export default function NewFaqPage() {
  return (
    <div className="h-screen w-full p-6 bg-gray-900 text-white">
      <h1 className="text-2xl mb-4">Add New FAQ</h1>
      <AddFaqForm />
    </div>
  );
}