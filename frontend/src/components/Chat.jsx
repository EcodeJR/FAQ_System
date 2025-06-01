import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

export default function Chat({ initialMessage = '' }) {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState(
    initialMessage ? [{ sender: 'user', text: initialMessage }] : []
  );
  const [input, setInput] = useState(initialMessage);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    <div className="flex flex-col h-screen bg-gray-900 p-4 md:p-6">
      <h1 className="text-xl md:text-2xl mb-4 text-green-400 font-semibold">
        {t('chat.title')}
      </h1>
      
      <div className="flex-grow border border-gray-700 rounded-lg bg-gray-800 overflow-hidden flex flex-col">
        {/* Messages Container */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] md:max-w-[75%] p-3 rounded-2xl ${
                  m.sender === 'user' 
                    ? 'bg-green-500 text-white ml-4 rounded-tr-none' 
                    : 'bg-gray-700 text-gray-100 mr-4 rounded-tl-none'
                } shadow-lg`}
              >
                {formatMessage(m.text)}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-100 p-4 rounded-2xl rounded-tl-none shadow-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" 
                       style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" 
                       style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" 
                       style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form 
          onSubmit={sendMessage} 
          className="p-4 bg-gray-750 border-t border-gray-700 flex gap-2"
        >
          <input
            className="flex-grow px-4 py-2 bg-gray-700 text-white rounded-lg 
                     border border-gray-600 focus:outline-none focus:border-green-500
                     focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
                     placeholder-gray-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chat.askAboutCourse') || "Type your message..."}
            disabled={isLoading}
            required
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200
              ${isLoading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 active:scale-95'
              } text-white shadow-lg`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('chat.sending')}
              </span>
            ) : (
              t('chat.send')
            )}
          </button>
        </form>
      </div>
    </div>
  );
}