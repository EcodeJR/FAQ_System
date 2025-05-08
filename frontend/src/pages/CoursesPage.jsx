import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    api.get('/courses?locale=en').then(res => {
        setCourses(res.data)
        console.log(res.data)
    }).catch(err => {
        console.error("Error fetching courses:", err);
    });
    // For debugging purposes, you can log the response data
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl mb-6 text-green-400">All Courses</h2>
      <div className="space-y-4">
        {courses.map(course => (
          <div key={course._id} className="bg-gray-800 p-4 rounded-lg">
            <button
              onClick={() => setOpenId(openId === course._id ? null : course._id)}
              className="w-full text-left text-lg font-medium text-white hover:text-green-300"
            >
              {course.code} - {course.title}
            </button>
            {openId === course._id && (
              <p className="mt-2 text-gray-200">{course.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>

  );
}