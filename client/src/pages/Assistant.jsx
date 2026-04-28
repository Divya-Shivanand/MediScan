import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Bot, User } from 'lucide-react';
import api from '../api/axios';

export default function Assistant() {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('reportId');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: reportId
      ? "Hello! I've loaded your medical report. Ask me anything about your results, what they mean, or what steps to take next."
      : "Hello! I'm MediScan AI Assistant. I can answer questions about health conditions, symptoms, medications, and general medical guidance. How can I help you today?" }
  ]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/assistant/chat', {
        messages: [...messages, userMsg],
        reportId
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <Bot className="text-white" size={20} />
        </div>
        <div>
          <h1 className="font-semibold text-gray-900">MediScan AI Assistant</h1>
          <p className="text-xs text-green-600">● Online</p>
        </div>
        {reportId && <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Report Context Active</span>}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-gray-200' : 'bg-blue-100'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-blue-600" />}
            </div>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-sm'
                : 'bg-gray-100 text-gray-800 rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Bot size={16} className="text-blue-600" />
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="flex gap-2 flex-wrap mb-3">
          {(reportId
            ? ['What does my risk score mean?', 'Should I see a specialist?', 'What lifestyle changes help?']
            : ['What are symptoms of diabetes?', 'How to improve heart health?', 'When should I see a doctor?']
          ).map(s => (
            <button key={s} onClick={() => setInput(s)}
              className="text-xs border border-blue-200 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-50 transition">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3 items-end">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); send(); }}}
          rows={1}
          placeholder="Ask anything about your health..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        <button onClick={send} disabled={!input.trim() || loading}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition disabled:opacity-50">
          <Send size={18} />
        </button>
      </div>
      <p className="text-xs text-gray-400 text-center mt-2">
        AI assistant provides guidance only. Consult a doctor for medical decisions.
      </p>
    </div>
  );
}