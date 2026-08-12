import React, { useState } from 'react';
import { StudentProfile } from '../types/curriculum';
import { X, Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';

interface AiCounselorModalProps {
  profile: StudentProfile;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiCounselorModal: React.FC<AiCounselorModalProps> = ({ profile, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello ${profile.name}! I am your Academic & Career Counselor. How can I help you choose electives, navigate prerequisites, or prepare for your target career role?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    const userText = inputQuery.trim();
    setInputQuery('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/counselor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery: userText, profile })
      });

      const data = await res.json();
      const aiResponseText = data.responseText || "I recommend consulting your academic catalog for prerequisite fulfillment.";

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "I encountered a network issue. Please verify your query and try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQueries = [
    "Should I pick Machine Learning or Cloud Computing first?",
    "How do I prepare for AWS Solutions Architect certification?",
    "What mini-project can I build for my Semester 6 capstone?"
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl h-[80vh] overflow-hidden flex flex-col shadow-2xl text-slate-900">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 border border-blue-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Academic & Career Counselor</h2>
              <p className="text-xs text-slate-500">Personalized degree & career planning advice</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1 text-xs bg-slate-50/40">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-3.5 rounded-2xl max-w-[80%] ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-line shadow-xs'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>
                <span className={`block text-[10px] mt-1 text-right font-medium ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-blue-600 p-2 font-medium">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Counselor is formulating response...</span>
            </div>
          )}
        </div>

        {/* Sample Suggestions */}
        <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50 overflow-x-auto flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-bold text-[10px] uppercase flex-shrink-0">Prompts:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setInputQuery(q)}
              className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600 whitespace-nowrap transition-all shadow-2xs font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Query Input */}
        <form onSubmit={handleSendMessage} className="p-3.5 border-t border-slate-200 bg-white flex items-center space-x-2">
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder="Ask a question about electives, prerequisites, or career tracks..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all disabled:opacity-50 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
