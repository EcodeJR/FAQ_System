import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="p-4 bg-gray-100 flex justify-between">
      <div className="flex space-x-4">
        <Link to="/">Home</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/faqs">FAQs</Link>
        {user?.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
      </div>
      <div className="flex space-x-4">
        {!user && (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </>
        )}
        {user && <button onClick={logout}>Logout</button>}
      </div>
    </nav>
  );
}