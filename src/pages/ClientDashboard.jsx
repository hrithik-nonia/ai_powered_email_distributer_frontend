import { useState, useEffect } from 'react';
import ClientLayout from '../layouts/ClientLayout';
import StatCard from '../components/StatCard';
import ClientEmailCard from '../components/ClientEmailCard';
import AISummaryCard from '../components/AISummaryCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { useAuthStore } from '../stores/authStore';
import { mockClientUpdates, mockStats } from '../mock/emails';

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const [updates, setUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeAlert, setActiveAlert] = useState(null);

  useEffect(() => {
    // Simulate loading client feed
    const timer = setTimeout(() => {
      setUpdates(mockClientUpdates);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleCardAction = (updateItem, actionType) => {
    if (actionType === 'approve') {
      setUpdates((prev) =>
        prev.map((u) =>
          u.id === updateItem.id ? { ...u, status: 'Approved & Dispatched', badge: 'Resolved' } : u
        )
      );
      setActiveAlert(`Approved "${updateItem.title}". Assistant dispatched reply.`);
      setTimeout(() => setActiveAlert(null), 4000);
    } else {
      setActiveAlert(`Reviewing context for "${updateItem.title}".`);
      setTimeout(() => setActiveAlert(null), 3000);
    }
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Client Welcome Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Executive Overview, {user?.name || 'Client'}
              </h1>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                Client Portal
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Your dedicated executive assistant and AI copilot are managing inbound communications.
              Review high-stakes drafts and approvals below.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-slate-400">Assigned Lead Assistant</span>
            <div className="text-xs font-semibold text-slate-900">Alex Johnson</div>
            <div className="text-[11px] text-emerald-600 font-medium">● Online & Monitoring</div>
          </div>
        </div>

        {/* Action Confirmation Banner */}
        {activeAlert && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center justify-between animate-fade-in">
            <span>✓ {activeAlert}</span>
            <button onClick={() => setActiveAlert(null)} className="text-emerald-700 font-bold ml-2">
              ✕
            </button>
          </div>
        )}

        {/* Overview Stats for Executive Client */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Emails Triaged This Week"
            value="482"
            change="100% SLA Met"
            trend="up"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Drafts Awaiting Your Approval"
            value={updates.filter((u) => u.status === 'Awaiting Your Approval').length}
            change="Action recommended"
            trend="down"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
          <StatCard
            title="Average Response Time"
            value={mockStats.averageResponseTime}
            change="Under 15m guarantee"
            trend="up"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
        </div>

        {/* AI Executive Summary Card */}
        <AISummaryCard
          summary="Weekly Executive Synthesis: Apex Enterprises is requesting approval for a 12% discount on Tier 2 & Tier 3 expansion. CloudScale webhook latency was diagnosed and confirmed resolved. 14 other general customer tickets were auto-triaged and resolved without requiring executive time."
          sentiment="High Priority (1 pending contract)"
          actionRequired="Approve Sarah Jenkins' contract renewal draft below to close expansion deal before Friday."
        />

        {/* Email Updates & Approval Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Key Inbound Threads & Approvals
              </h3>
              <p className="text-xs text-slate-500">
                Items requiring executive awareness or one-click approval
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400">
              Showing {updates.length} items
            </span>
          </div>

          {isLoading ? (
            <LoadingSkeleton count={3} />
          ) : updates.length === 0 ? (
            <EmptyState
              title="All Caught Up"
              description="No emails currently require your attention. Your assistant is handling incoming messages."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {updates.map((item) => (
                <ClientEmailCard
                  key={item.id}
                  update={item}
                  onAction={handleCardAction}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
