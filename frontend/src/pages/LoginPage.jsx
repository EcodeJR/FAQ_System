import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.post('/auth/login', { email, password });
    login(res.data.token);
    navigate('/chat');
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl mb-4">{t('login.submit')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>{t('login.email')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border p-2"
          />
        </div>
        <div>
          <label>{t('login.password')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border p-2"
          />
        </div>
        <button type="submit" className="btn w-full">{t('login.submit')}</button>
      </form>
    </div>
  );
}