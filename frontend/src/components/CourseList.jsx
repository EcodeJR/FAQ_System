import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function CourseList({ onSelect }) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    api.get('/courses?locale=en')
      .then(res => {
        setCourses(res.data);
      })
      .catch(err => {
        setError('Failed to load courses');
        console.error('Error loading courses:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="mb-6 bg-gray-900 text-white p-4 rounded">
      <h2 className="text-lg font-semibold mb-2 text-green-400">Courses</h2>
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-green-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-400 text-center py-2">{error}</div>
      ) : courses.length === 0 ? (
        <div className="text-gray-400 text-center py-2">No courses available</div>
      ) : (
        <ul className="space-y-1">
          {courses.map(course => (
            <li key={course._id}>
              <button
                onClick={() => onSelect(course.code)}
                className="text-white hover:text-green-300 hover:underline"
              >
                {course.code} - {course.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}