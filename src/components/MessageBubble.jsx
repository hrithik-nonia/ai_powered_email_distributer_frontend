export default function MessageBubble({ message }) {
  const { sender, senderEmail, senderType = 'client', timestamp, content } = message;
  const isAssistant = senderType === 'assistant';

  return (
    <div className={`flex gap-3 my-4 ${isAssistant ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="shrink-0">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
            isAssistant
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          {isAssistant ? 'AI' : sender?.charAt(0) || 'U'}
        </div>
      </div>

      <div className={`max-w-2xl flex flex-col ${isAssistant ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-xs font-semibold text-slate-800">{sender}</span>
          {senderEmail && <span className="text-[11px] text-slate-400">({senderEmail})</span>}
          <span className="text-[11px] text-slate-400">• {timestamp}</span>
        </div>

        <div
          className={`rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line shadow-xs border ${
            isAssistant
              ? 'bg-purple-50/70 border-purple-200 text-purple-950 rounded-tr-xs'
              : 'bg-white border-slate-200 text-slate-800 rounded-tl-xs'
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
