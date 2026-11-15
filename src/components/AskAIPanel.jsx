import { useState } from 'react';
import { aiService } from '../services/aiService';

export default function AskAIPanel({ thread, onClose }) {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([
    {
      sender: 'ai',
      text: `Hello! I have indexed thread "${thread?.subject || 'this email'}". You can ask me to summarize contract terms, check deadlines, or extract action items.`,
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const quickQuestions = [
    'What is the client requesting?',
    'What are the key deadlines or figures mentioned?',
    'Is there any pricing or discount discussed?',
  ];

  const handleAsk = async (queryText) => {
    const q = queryText || question;
    if (!q.trim() || isThinking) return;

    setConversation((prev) => [...prev, { sender: 'user', text: q }]);
    setQuestion('');
    setIsThinking(true);

    try {
      const context = JSON.stringify(thread);
      const res = await aiService.askAI(q, context);
      setConversation((prev) => [
        ...prev,
        { sender: 'ai', text: res?.answer || 'I could not parse an answer from this thread.' },
      ]);
    } catch {
      setConversation((prev) => [
        ...prev,
        { sender: 'ai', text: 'Error contacting AI agent. Please try again.' },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 w-80 shrink-0">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-purple-50/50">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-purple-600 text-white flex items-center justify-center text-xs">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xs font-bold text-slate-800">Thread AI Copilot</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1 rounded-md"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {conversation.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col text-xs leading-relaxed ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <span className="text-[10px] text-slate-400 mb-1 font-medium">
              {msg.sender === 'user' ? 'You' : 'AI Copilot'}
            </span>
            <div
              className={`p-2.5 rounded-xl max-w-[90%] ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-xs'
                  : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-1.5 text-xs text-purple-600 p-2">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-ping"></span>
            Analyzing thread content...
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="mb-2 flex flex-wrap gap-1">
          {quickQuestions.map((qq, i) => (
            <button
              key={i}
              onClick={() => handleAsk(qq)}
              className="text-[11px] text-purple-700 bg-white border border-purple-200 rounded-md px-2 py-1 hover:bg-purple-50 transition cursor-pointer text-left"
            >
              {qq}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex items-center gap-1.5"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about this thread..."
            className="flex-1 text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={isThinking || !question.trim()}
            className="px-2.5 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 disabled:opacity-50 transition cursor-pointer"
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
}
