import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token);
      localStorage.setItem("username", res.data.username);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.message || 
        'An error occurred during login'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='h-screen w-full bg-gray-900 text-white flex items-center justify-center'>
      <div className="max-w-md mx-auto p-6 text-gray-900 bg-white rounded-xl shadow-2xl hover:shadow-gray-600">
        <h2 className="text-2xl mb-4 font-bold">{t('login.title')}</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>{t('login.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label>{t('login.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full rounded py-2 text-white transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-400 hover:bg-green-500 delay-100'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t('login.loading')}
              </span>
            ) : (
              t('login.submit')
            )}
          </button>
        </form>
        <p className="mt-4 text-center">
          {t('login.noAccount')} <Link to="/signup" className="text-blue-500 hover:underline">{t('login.signupLink')}</Link>
        </p>
      </div>
    </div>
  );
}