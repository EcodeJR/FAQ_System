import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openId, setOpenId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    api.get('/courses?locale=en')
      .then(res => {
        setCourses(res.data);
        setFilteredCourses(res.data);
      })
      .catch(err => {
        setError('Failed to load courses');
        console.error("Error fetching courses:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-3xl text-green-400 font-bold">
            All Courses
          </h2>
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => {
                const term = e.target.value.toLowerCase();
                setSearchTerm(term);
                const filtered = courses.filter(course => 
                  course.title.toLowerCase().includes(term) || 
                  course.code.toLowerCase().includes(term) ||
                  course.description.toLowerCase().includes(term)
                );
                setFilteredCourses(filtered);
              }}
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilteredCourses(courses);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-400 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-red-400 text-center py-8 bg-gray-800 rounded-lg">
            {error}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-gray-400 text-center py-8 bg-gray-800 rounded-lg">
            {searchTerm ? 'No courses match your search' : 'No courses available'}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCourses.map(course => (
              <div 
                key={course._id} 
                className="bg-gray-800 p-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-900/20"
              >
                <button
                  onClick={() => setOpenId(openId === course._id ? null : course._id)}
                  className="w-full text-left"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white group-hover:text-green-300">
                      <span className="text-green-400">{course.code}</span> - {course.title}
                    </h3>
                    <svg 
                      className={`w-5 h-5 text-green-400 transition-transform duration-200 ${
                        openId === course._id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </button>
                {openId === course._id && (
                  <p className="mt-4 text-gray-300 border-t border-gray-700 pt-4">
                    {course.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}