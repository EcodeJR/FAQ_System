import React from 'react';
import AddCourseForm from '../../components/AddCourseForm';

export default function NewCoursePage() {
  return (
    <div className="h-screen w-fullp-6 bg-gray-900 text-white">
      <h1 className="text-2xl mb-4">Add New Course</h1>
      <AddCourseForm />
    </div>
  );
}