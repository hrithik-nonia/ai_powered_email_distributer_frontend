import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AssistantLayout from '../layouts/AssistantLayout';
import StatCard from '../components/StatCard';
import ThreadCard from '../components/ThreadCard';
import AIBanner from '../components/AIBanner';
import AISummaryCard from '../components/AISummaryCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { useThreadStore } from '../stores/threadStore';
import { useAuthStore } from '../stores/authStore';
import { mockStats } from '../mock/emails';

export default function AssistantDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { threads, fetchThreads, isLoading } = useThreadStore();

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const recentThreads = threads.slice(0, 4);
  const urgentThread = threads.find((t) => t.status === 'urgent') || threads[0];

  return (
    <AssistantLayout>
      <div className="space-y-6">
        {/* Top Header / Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Welcome back, {user?.name || 'Assistant'}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Here is your executive inbox activity, priority contracts, and AI draft intelligence for today.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchThreads()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Sync Inbound
            </button>
            <button
              onClick={() => navigate('/inbox')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-xs transition cursor-pointer"
            >
              Open Full Inbox
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* AI Operational Intelligence Banner */}
        <AIBanner />

        {/* Overview Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Inbound Emails"
            value={mockStats.totalEmails}
            change="14% vs last week"
            trend="up"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatCard
            title="Pending Assistant Action"
            value={mockStats.pendingEmails}
            change="3 urgent"
            trend="down"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Tasks Completed Today"
            value={mockStats.completedTasks}
            change="28 drafts approved"
            trend="up"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Unread Priority Messages"
            value={mockStats.unreadMessages}
            trend="up"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            }
          />
        </div>

        {/* Dashboard 2-Column Split: Active AI Summary + Recent Threads */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Left: Priority AI Summary & Quick Triage */}
          <div className="lg:col-span-2 space-y-5">
            {urgentThread && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                      Priority Focus Thread
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {urgentThread.subject}
                    </h3>
                    <p className="text-xs text-slate-500">
                      From: {urgentThread.sender.name} ({urgentThread.sender.company || urgentThread.sender.email})
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/inbox/${urgentThread.id}`)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    Open Thread
                  </button>
                </div>

                <AISummaryCard
                  summary={urgentThread.aiSummary}
                  sentiment={urgentThread.aiSentiment}
                  actionRequired={urgentThread.suggestedAction}
                  onApplyAction={() => navigate(`/inbox/${urgentThread.id}`)}
                />
              </div>
            )}

            {/* Quick Actions Panel */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Assistant Quick Workflows
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => navigate('/inbox')}
                  className="p-3 text-left rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition cursor-pointer"
                >
                  <div className="font-semibold text-xs text-slate-900">Review AI Drafts (9)</div>
                  <div className="text-[11px] text-slate-500 mt-1">Check pre-generated replies ready for dispatch.</div>
                </button>
                <button
                  onClick={() => navigate('/inbox')}
                  className="p-3 text-left rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition cursor-pointer"
                >
                  <div className="font-semibold text-xs text-slate-900">Contract Renewals</div>
                  <div className="text-[11px] text-slate-500 mt-1">Apex Enterprises & CloudScale escalation.</div>
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="p-3 text-left rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition cursor-pointer"
                >
                  <div className="font-semibold text-xs text-slate-900">Routing & Rules</div>
                  <div className="text-[11px] text-slate-500 mt-1">Configure client VIP triggers & filters.</div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Recent Email Threads */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recent Email Threads
                </h3>
                <p className="text-[11px] text-slate-400">Live triage feed</p>
              </div>
              <button
                onClick={() => navigate('/inbox')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                View all ({threads.length})
              </button>
            </div>

            <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[500px]">
              {isLoading ? (
                <LoadingSkeleton count={3} type="thread" />
              ) : recentThreads.length === 0 ? (
                <EmptyState title="No threads" description="No active email threads found." />
              ) : (
                recentThreads.map((thread) => (
                  <ThreadCard
                    key={thread.id}
                    thread={thread}
                    onClick={() => navigate(`/inbox/${thread.id}`)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AssistantLayout>
  );
}
