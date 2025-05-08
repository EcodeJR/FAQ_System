import React from 'react';
import SignupForm from '../components/SignupForm';

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl mb-4">Sign Up</h2>
      <SignupForm />
    </div>
  );
}