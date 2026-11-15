import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AssistantLayout from '../layouts/AssistantLayout';
import ThreadCard from '../components/ThreadCard';
import MessageBubble from '../components/MessageBubble';
import DraftArea from '../components/DraftArea';
import AskAIPanel from '../components/AskAIPanel';
import AISummaryCard from '../components/AISummaryCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import LabelBadge from '../components/LabelBadge';
import { useThreadStore } from '../stores/threadStore';

export default function InboxPage() {
  const { threadId } = useParams();
  const navigate = useNavigate();

  const {
    threads,
    activeThread,
    selectThread,
    fetchThreads,
    sendReply,
    saveDraft,
    updateStatus,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    labelFilter,
    setLabelFilter,
  } = useThreadStore();

  const [showAIPanel, setShowAIPanel] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [mobileView, setMobileView] = useState(threadId ? 'detail' : 'list');

  // Fetch threads on initial load
  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  // Sync route param :threadId with store's active thread
  useEffect(() => {
    if (threadId) {
      selectThread(threadId);
    } else if (threads.length > 0 && !activeThread) {
      navigate(`/inbox/${threads[0].id}`, { replace: true });
    }
  }, [threadId, threads, selectThread, activeThread, navigate]);

  const handleSelectThread = (id) => {
    navigate(`/inbox/${id}`);
    setMobileView('detail');
  };

  const handleSendReply = async (content) => {
    if (!activeThread) return;
    setIsSending(true);
    try {
      await sendReply(activeThread.id, content);
    } catch {
      // ignore
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = async (draft) => {
    if (!activeThread) return;
    await saveDraft(activeThread.id, draft);
  };

  const handleStatusChange = async (status) => {
    if (!activeThread) return;
    await updateStatus(activeThread.id, status);
  };

  const availableLabels = ['all', 'Contract', 'AI Drafted', 'Billing', 'Technical', 'Partnership'];
  const availableStatuses = ['all', 'urgent', 'pending', 'completed'];

  return (
    <AssistantLayout>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[calc(100vh-140px)] min-h-[600px] overflow-hidden">
        {/* Top Control Bar: Search & Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/60">
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by sender, company, subject, or AI summary..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {/* Status Filter */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
              {availableStatuses.map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md capitalize font-medium transition cursor-pointer text-[11px] ${
                    statusFilter === st
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Label Filter Dropdown */}
            <select
              value={labelFilter}
              onChange={(e) => setLabelFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-hidden"
            >
              {availableLabels.map((lbl) => (
                <option key={lbl} value={lbl}>
                  {lbl === 'all' ? 'All Labels' : lbl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main 2-Pane Inbox: Left List + Right Thread Detail */}
        <div className="flex-1 flex overflow-hidden">
          {/* Thread List Pane */}
          <div
            className={`w-full md:w-96 lg:w-[420px] shrink-0 border-r border-slate-200 flex flex-col bg-slate-50/30 overflow-y-auto ${
              mobileView === 'detail' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {isLoading ? (
              <LoadingSkeleton count={4} type="thread" />
            ) : threads.length === 0 ? (
              <EmptyState
                title="No emails match your filter"
                description="Try clearing search queries or selecting 'All' statuses."
                actionLabel="Reset Filters"
                onAction={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setLabelFilter('all');
                }}
              />
            ) : (
              threads.map((t) => (
                <ThreadCard
                  key={t.id}
                  thread={t}
                  isSelected={activeThread?.id === t.id}
                  onClick={() => handleSelectThread(t.id)}
                />
              ))
            )}
          </div>

          {/* Conversation Detail Pane */}
          <div
            className={`flex-1 flex flex-col bg-slate-50/20 overflow-hidden ${
              mobileView === 'list' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {activeThread ? (
              <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 space-y-4">
                  {/* Thread Header */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        {/* Mobile Back Button */}
                        <button
                          onClick={() => setMobileView('list')}
                          className="md:hidden inline-flex items-center gap-1 text-xs text-indigo-600 font-semibold mb-2"
                        >
                          ← Back to list
                        </button>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                          {activeThread.subject}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                          <span>Sender: <strong className="text-slate-700">{activeThread.sender.name}</strong></span>
                          <span>•</span>
                          <span>Company: <strong className="text-slate-700">{activeThread.sender.company || 'External'}</strong></span>
                          <span>•</span>
                          <span>{activeThread.timestamp}</span>
                        </div>
                      </div>

                      {/* Action buttons: AI Copilot Toggle & Status Selector */}
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={activeThread.status}
                          onChange={(e) => handleStatusChange(e.target.value)}
                          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-hidden cursor-pointer capitalize"
                        >
                          <option value="urgent">Urgent</option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                        </select>

                        <button
                          onClick={() => setShowAIPanel(!showAIPanel)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                            showAIPanel
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                          }`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          AI Copilot
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                      {activeThread.labels?.map((lbl, i) => (
                        <LabelBadge key={i} label={lbl} />
                      ))}
                    </div>
                  </div>

                  {/* AI Summary Card */}
                  <AISummaryCard
                    summary={activeThread.aiSummary}
                    sentiment={activeThread.aiSentiment}
                    actionRequired={activeThread.suggestedAction}
                  />

                  {/* Conversation Messages */}
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Thread History
                    </div>
                    {activeThread.messages?.map((msg) => (
                      <MessageBubble key={msg.id} message={msg} />
                    ))}
                  </div>

                  {/* Reply Draft Area */}
                  <DraftArea
                    threadId={activeThread.id}
                    initialDraft={activeThread.draft}
                    onSend={handleSendReply}
                    onSaveDraft={handleSaveDraft}
                    isSending={isSending}
                  />
                </div>

                {/* Collapsible Ask AI Side Panel */}
                {showAIPanel && (
                  <AskAIPanel
                    thread={activeThread}
                    onClose={() => setShowAIPanel(false)}
                  />
                )}
              </div>
            ) : (
              <EmptyState
                title="Select a thread"
                description="Choose an email from the left pane to view conversation history and AI recommendations."
              />
            )}
          </div>
        </div>
      </div>
    </AssistantLayout>
  );
}
