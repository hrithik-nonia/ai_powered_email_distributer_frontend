import { useState } from 'react';
import { aiService } from '../services/aiService';

export default function DraftArea({
  initialDraft = '',
  onSend,
  onSaveDraft,
  threadId,
  isSending = false,
}) {
  const [draftText, setDraftText] = useState(initialDraft);
  const [prevTracking, setPrevTracking] = useState({ threadId, initialDraft });
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptInstruction, setPromptInstruction] = useState('');
  const [showPromptInput, setShowPromptInput] = useState(false);

  // Sync draftText if threadId or initialDraft changes without using an effect
  if (prevTracking.threadId !== threadId || prevTracking.initialDraft !== initialDraft) {
    setPrevTracking({ threadId, initialDraft });
    setDraftText(initialDraft || '');
  }

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const res = await aiService.generateReply(threadId, promptInstruction);
      if (res?.draft) {
        setDraftText(res.draft);
        if (onSaveDraft) onSaveDraft(res.draft);
      }
      setShowPromptInput(false);
      setPromptInstruction('');
    } catch {
      // ignore
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = () => {
    if (!draftText.trim()) return;
    if (onSend) onSend(draftText);
  };

  const handleSave = () => {
    if (onSaveDraft) onSaveDraft(draftText);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-800 uppercase tracking-wide">Reply & Draft</span>
          <span className="text-[11px] text-slate-400">Assistant Response Composer</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPromptInput(!showPromptInput)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {isGenerating ? 'Drafting...' : 'AI Assistant Draft'}
          </button>
        </div>
      </div>

      {showPromptInput && (
        <div className="mb-3 p-3 bg-purple-50/50 rounded-lg border border-purple-100 flex items-center gap-2">
          <input
            type="text"
            value={promptInstruction}
            onChange={(e) => setPromptInstruction(e.target.value)}
            placeholder="E.g., Politely agree to terms and request Friday morning meeting..."
            className="flex-1 text-xs px-3 py-1.5 rounded-md border border-purple-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-purple-500"
          />
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerateAI}
            className="px-3 py-1.5 bg-purple-600 text-white rounded-md text-xs font-medium hover:bg-purple-700 transition cursor-pointer disabled:opacity-50"
          >
            Generate
          </button>
        </div>
      )}

      <textarea
        rows={6}
        value={draftText}
        onChange={(e) => setDraftText(e.target.value)}
        placeholder="Type response or use 'AI Assistant Draft' to generate..."
        className="w-full text-xs text-slate-800 p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed resize-y"
      />

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => setDraftText('')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            Clear
          </button>
        </div>

        <button
          type="button"
          disabled={isSending || !draftText.trim()}
          onClick={handleSend}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <>
              <svg className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Sending...
            </>
          ) : (
            <>
              Send Reply
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
