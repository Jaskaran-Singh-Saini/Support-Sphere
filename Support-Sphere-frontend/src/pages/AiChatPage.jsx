import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
  );
}

function AiChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I am Willow, your personal Wellness Assistant. How can I help you today?', sender: 'ai', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage = { 
      id: Date.now(), 
      text: input, 
      sender: 'user', 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    axios.post('http://127.0.0.1:8000/api/chat/', { message: userMessage.text })
      .then(response => {
        const aiResponse = { 
          id: Date.now() + 1, 
          text: response.data.reply, 
          sender: 'ai',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
      })
      .catch(error => {
        console.error("Error fetching chatbot response:", error);
        const errorResponse = {
            id: Date.now() + 1, 
            text: 'I seem to be having trouble connecting. Please try again later.', 
            sender: 'ai',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorResponse]);
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center relative">
          <Link to="/" className="text-blue-600 hover:underline z-10">
            &larr; Back to Dashboard
          </Link>
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <h1 className="text-xl font-bold text-gray-800">Willow</h1>
          </div>
          <div className="w-32"></div>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map(message => (
            <div key={message.id} className={`flex items-end gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex-shrink-0 ${message.sender === 'user' ? 'bg-blue-500' : 'bg-slate-700'} flex items-center justify-center text-white font-bold`}>
                {message.sender === 'user' ? 'You' : 'W'}
              </div>
              <div className={`max-w-lg p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                <p>{message.text}</p>
                <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>{message.time}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-end gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">W</div>
              <div className="max-w-lg p-3 rounded-lg bg-white border border-gray-200 rounded-bl-none">
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="bg-white p-4 border-t border-gray-200 sticky bottom-0">
        <div className="max-w-4xl mx-auto flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <button onClick={handleSend} className="bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300" disabled={!input.trim()}>
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </div>
      </footer>
    </div>
  );
}

export default AiChatPage;