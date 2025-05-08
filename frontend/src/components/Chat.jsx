import React, { useState, useEffect } from 'react'; // added useEffect import
import { useTranslation } from 'react-i18next';
import api from '../services/api';

export default function Chat({ initialMessage = '' }) {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState(
    initialMessage ? [{ sender: 'user', text: initialMessage }] : []
  );
  const [input, setInput] = useState(initialMessage);

  const sendMessage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const userMsg = input;
    if (!userMsg) return; // guard against empty messages
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    try {
      const res = await api.post('/chat', { message: userMsg, locale: i18n.language });
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.answer }]);
    } catch (err) {
      console.error('Chat request error', err);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
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
      <div className="border p-2 h-64 overflow-y-auto mb-4">
        {messages.map((m, idx) => (
          <div key={idx} className={m.sender === 'user' ? 'text-right' : 'text-left'}>
            <span className={`inline-block p-2 rounded ${m.sender === 'user' ? 'bg-blue-200' : 'bg-gray-200'}`}>{m.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          className="flex-grow border p-2 mr-2 text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <button type="submit" className="btn">Send</button>
      </form>
    </div>
  );
}
