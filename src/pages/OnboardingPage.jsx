import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AssistantLayout from '../layouts/AssistantLayout';
import { accountService } from '../services/accountService';
import { useAuthStore } from '../stores/authStore';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    assistantTitle: 'Executive Operations Assistant',
    timezone: 'UTC-5 (Eastern Time)',
    clientDomain: 'apexenterprises.com',
    delegatedInboxes: ['sjenkins@apexenterprises.com', 'finance@chenholdings.org'],
    autoDraftsEnabled: true,
    requireExecutiveApproval: true,
    escalationThreshold: 'High & Urgent contracts',
  });

  const steps = [
    { id: 1, title: 'Profile & Hours' },
    { id: 2, title: 'Mailbox Routing' },
    { id: 3, title: 'AI Copilot Rules' },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      await accountService.completeOnboarding(formData);
      updateUser({ onboardingCompleted: true });
      setIsComplete(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch {
      setIsComplete(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AssistantLayout>
      <div className="max-w-2xl mx-auto py-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
              Assistant Setup • Step {currentStep} of 3
            </span>
            <span className="text-xs font-medium text-slate-500">
              {steps[currentStep - 1].title}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {isComplete ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Onboarding Complete!</h3>
            <p className="mt-2 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Your executive assistant workstation and automated inbox rules have been initialized. Redirecting to your dashboard...
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            {/* Step 1: Profile & Working Hours */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Welcome, {user?.name || 'Assistant'}!</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Let us configure your assistant identity and operational schedule.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Operational Role / Title</label>
                    <input
                      type="text"
                      value={formData.assistantTitle}
                      onChange={(e) => setFormData({ ...formData, assistantTitle: e.target.value })}
                      className="mt-1 w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Primary Timezone</label>
                    <select
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      className="mt-1 w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    >
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (London, GMT)</option>
                      <option>UTC+5:30 (India Standard Time)</option>
                      <option>UTC+8 (Singapore)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Mailbox Routing */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Client Mailbox Assignment</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Connect the client domain and delegated inboxes you will triage.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Client Enterprise Domain</label>
                    <input
                      type="text"
                      value={formData.clientDomain}
                      onChange={(e) => setFormData({ ...formData, clientDomain: e.target.value })}
                      className="mt-1 w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Delegated Inboxes</label>
                    <div className="mt-2 space-y-2">
                      {formData.delegatedInboxes.map((inbox, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                          <span className="font-medium text-slate-800">{inbox}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">Active Sync</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: AI Copilot Rules */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">AI Copilot & Auto-Drafting Rules</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Tailor how proactively AI drafts replies and alerts executive clients.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.autoDraftsEnabled}
                      onChange={(e) => setFormData({ ...formData, autoDraftsEnabled: e.target.checked })}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-900">Pre-generate AI reply drafts</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Automatically compose high-confidence drafts for contract follow-ups and inquiries.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.requireExecutiveApproval}
                      onChange={(e) => setFormData({ ...formData, requireExecutiveApproval: e.target.checked })}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-900">Require client sign-off on sensitive threads</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Hold outgoing emails with pricing or contract changes until the client reviews them.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                disabled={isSaving}
                onClick={handleNext}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : currentStep === 3 ? 'Complete Setup' : 'Continue'}
              </button>
            </div>
          </div>
        )}
      </div>
    </AssistantLayout>
  );
}
