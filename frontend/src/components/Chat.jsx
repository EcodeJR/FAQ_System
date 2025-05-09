import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

export default function Chat({ initialMessage = '' }) {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState(
    initialMessage ? [{ sender: 'user', text: initialMessage }] : []
  );
  const [input, setInput] = useState(initialMessage);
  const [isLoading, setIsLoading] = useState(false);

  const formatMessage = (text) => {
    const lines = text.split('\n');
    let inList = false;

    return lines.map((line, index) => {
      // Handle bold text
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Handle bullet points
      if (line.trim().startsWith('*')) {
        if (!inList) {
          inList = true;
          return (
            <div key={index}>
              <ul className="list-disc ml-6 my-2">
                <li className="mb-1" dangerouslySetInnerHTML={{ __html: line.trim().substring(1) }} />
              </ul>
            </div>
          );
        } else {
          return (
            <li key={index} className="mb-1 ml-6" dangerouslySetInnerHTML={{ __html: line.trim().substring(1) }} />
          );
        }
      }

      // Handle headers
      if (line.startsWith('#')) {
        const level = line.match(/^#+/)[0].length;
        const text = line.substring(level).trim();
        const className = `text-${['2xl', 'xl', 'lg', 'md'][level - 1] || 'base'} font-bold my-2`;
        return <div key={index} className={className}>{text}</div>;
      }

      // Reset list state if line is not a list item
      inList = false;
      
      // Handle regular paragraphs
      return line.trim() ? (
        <div key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: line }} />
      ) : <div key={index} className="h-2" />;  // Empty lines become spacing
    });
  };

  const sendMessage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const userMsg = input;
    if (!userMsg) return;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.post('/chat', { message: userMsg, locale: i18n.language });
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.answer }]);
    } catch (err) {
      console.error('Chat request error', err);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: t('chat.error') || 'Sorry, something went wrong.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialMessage) {
      sendMessage();
    }
  }, [initialMessage]);

  return (
    <div className="p-4 text-black">
      <h1 className="text-xl mb-4 text-white">{t('chat.title')}</h1>
      <div className="border rounded-lg p-4 h-[70vh] overflow-y-auto mb-4 bg-gray-50">
        {messages.map((m, idx) => (
          <div 
            key={idx} 
            className={`mb-4 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div 
              className={`inline-block max-w-[70%] p-3 rounded-lg ${
                m.sender === 'user' 
                  ? 'bg-blue-500 text-white rounded-br-none' 
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              {formatMessage(m.text)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left">
            <div className="inline-block bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-grow rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('Ask about a course') || "Type your message..."}
          disabled={isLoading}
          required
        />
        <button 
          type="submit" 
          className={`px-4 py-2 rounded-lg bg-blue-500 text-white font-medium
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          disabled={isLoading}
        >
          {isLoading ? t('chat.sending') || 'Sending...' : t('chat.send') || 'Send'}
        </button>
      </form>
    </div>
  );
}