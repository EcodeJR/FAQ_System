import React from 'react';
import SignupForm from '../components/SignupForm';
import { Link } from 'react-router-dom';

export default function SignupPage() {
  return (
    <div className='h-screen w-full bg-gray-900 flex items-center justify-center'>
        <div className="max-w-md mx-auto p-6 text-gray-900 bg-white rounded-md shadow-2xl hover:shadow-gray-600">
      <h2 className="text-2xl mb-4 font-bold">Sign Up</h2>
      <SignupForm />
      <p className="mt-4 text-center">
        Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
      </p>
    </div>
    
    </div>
    
  );
}