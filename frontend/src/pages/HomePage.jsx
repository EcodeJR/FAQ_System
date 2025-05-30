import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          University Course & FAQ Chatbot
        </h1>
        
        <p className="max-w-xl text-center mb-8 text-gray-300 text-sm md:text-base leading-relaxed">
          Welcome to the localized chatbot system for university course information and frequently asked questions.
          Chat in real-time, browse all FAQs, or explore course details-all in English for now.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4 w-full sm:w-auto">
          <Link 
            to="/chat" 
            className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-3 rounded-lg 
                     hover:from-green-600 hover:to-green-700 transition-all duration-200 
                     shadow-lg hover:shadow-green-500/25 text-center font-medium"
          >
            Start Chat
          </Link>
          
          <Link 
            to="/faqs" 
            className="bg-gray-800 px-8 py-3 rounded-lg hover:bg-gray-700 
                     transition-all duration-200 shadow-lg hover:shadow-gray-700/25 
                     text-center border border-gray-700 hover:border-gray-600"
          >
            Browse FAQs
          </Link>
          
          <Link 
            to="/courses" 
            className="bg-gray-800 px-8 py-3 rounded-lg hover:bg-gray-700 
                     transition-all duration-200 shadow-lg hover:shadow-gray-700/25 
                     text-center border border-gray-700 hover:border-gray-600"
          >
            Browse Courses
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-2 text-green-400">Real-time Chat</h2>
            <p className="text-gray-400 text-sm">Get instant answers to your questions about courses and university information.</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-2 text-green-400">Course Info</h2>
            <p className="text-gray-400 text-sm">Browse detailed information about available courses and their requirements.</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-2 text-green-400">FAQs</h2>
            <p className="text-gray-400 text-sm">Find answers to commonly asked questions about university services.</p>
          </div>
        </div>
      </div>
    </div>
  );
}