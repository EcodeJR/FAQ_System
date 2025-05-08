import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4 text-green-400">University Course & FAQ Chatbot</h1>
      <p className="max-w-xl text-center mb-6">
        Welcome to the localized chatbot system for university course information and frequently asked questions.
        Chat in real-time, browse all FAQs, or explore course details—all in English for now.
      </p>
      <div className="space-x-4">
        <Link to="/chat" className="bg-green-500 px-6 py-3 rounded hover:bg-green-600">
          Start Chat
        </Link>
        <Link to="/faqs" className="bg-gray-700 px-6 py-3 rounded hover:bg-gray-600">
          Browse FAQs
        </Link>
        <Link to="/courses" className="bg-gray-700 px-6 py-3 rounded hover:bg-gray-600">
          Browse Courses
        </Link>
      </div>
    </div>
  );
}