import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';



export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/auth/signup', { email, password, role });
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2"
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-2"
        />
      </div>
      <div>
        <label>Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" className="btn w-full">Sign Up</button>
    </form>
  );
}