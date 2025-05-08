import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function CourseList({ onSelect }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get('/courses?locale=en').then(res => setCourses(res.data));
  }, []);

  return (
    <div className="mb-6 bg-gray-900 text-white p-4 rounded">
      <h2 className="text-lg font-semibold mb-2 text-green-400">Courses</h2>
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
    </div>
  );
}
