import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminPanel from './pages/AdminPanel';
import NewFaqPage from './pages/faqs/NewFaqPage';
import NewCoursePage from './pages/courses/NewCoursePage';
import PrivateRoute from './components/PrivateRoute';
import FaqPage from './pages/FaqPage';
import CoursesPage from './pages/CoursesPage';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path='/faqs' element={<FaqPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute roles={['admin']}>
                <AdminPanel />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/faqs/new" 
            element={
              <PrivateRoute roles={['admin']}>
                <NewFaqPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/courses/new" 
            element={
              <PrivateRoute roles={['admin']}>
                <NewCoursePage />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  );
}