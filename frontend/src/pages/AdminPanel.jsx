import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  return (
    <div className="min-h-screen w-full p-6 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-green-400 border-b border-gray-700 pb-4">
          Admin Panel
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            to="/faqs/new" 
            className="flex items-center justify-between p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2 text-green-400 group-hover:text-green-300">
                Add FAQ
              </h3>
              <p className="text-gray-400">
                Create new frequently asked questions and answers
              </p>
            </div>
            <svg 
              className="w-6 h-6 text-green-400 group-hover:translate-x-2 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </Link>
          <Link 
            to="/courses/new" 
            className="flex items-center justify-between p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2 text-green-400 group-hover:text-green-300">
                Add Course
              </h3>
              <p className="text-gray-400">
                Create new courses with detailed information
              </p>
            </div>
            <svg 
              className="w-6 h-6 text-green-400 group-hover:translate-x-2 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}