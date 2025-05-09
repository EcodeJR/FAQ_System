import React from 'react';
import SignupForm from '../components/SignupForm';

export default function SignupPage() {
  return (
    <div className='h-screen w-full bg-gray-900 flex items-center justify-center'>
        <div className="max-w-md mx-auto p-6 text-gray-900 bg-white rounded-md shadow-2xl hover:shadow-gray-600">
      <h2 className="text-2xl mb-4 font-bold">Sign Up</h2>
      <SignupForm />
    </div>
    </div>
    
  );
}