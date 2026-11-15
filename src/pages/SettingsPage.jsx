import { useState } from 'react';
import AssistantLayout from '../layouts/AssistantLayout';
import { accountService } from '../services/accountService';
import { useAuthStore } from '../stores/authStore';

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();

  const [name, setName] = useState(user?.name || 'Alex Johnson');
  const [email, setEmail] = useState(user?.email || 'alex@company.com');
  const [title, setTitle] = useState('Executive Assistant');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'notifications' | 'security'

  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    aiDigest: true,
    urgentSms: false,
    autoDrafting: true,
    weeklyReport: true,
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      await accountService.updateProfile({ name, email, title });
      updateUser({ name, email });
      setStatusMessage({ type: 'success', text: 'Profile changes saved successfully.' });
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      await accountService.updatePreferences(preferences);
      setStatusMessage({ type: 'success', text: 'Notification preferences updated.' });
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to update preferences.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    setStatusMessage(null);

    if (newPassword.length < 6) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setStatusMessage({ type: 'success', text: 'Password changed successfully.' });
      setTimeout(() => setStatusMessage(null), 4000);
    }, 600);
  };

  return (
    <AssistantLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Account & Operations Settings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Manage your assistant credentials, email triage preferences, and security.
          </p>
        </div>

        {statusMessage && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="font-bold ml-2">
              ✕
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 pt-3 gap-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'profile'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Profile & Identity
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`pb-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'notifications'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Notifications & AI
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'security'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Security & Credentials
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Tab 1: Profile */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Title / Designation</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Account Role</label>
                  <input
                    type="text"
                    disabled
                    value={user?.role || 'assistant'}
                    className="mt-1 w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed capitalize"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Contact your administrator to change workspace permissions.
                  </span>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Notifications & AI Preferences */}
            {activeTab === 'notifications' && (
              <form onSubmit={handleSavePreferences} className="space-y-4 max-w-xl">
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.emailAlerts}
                      onChange={(e) =>
                        setPreferences({ ...preferences, emailAlerts: e.target.checked })
                      }
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-900">Urgent Contract Alerts</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Receive instant notifications when client emails mention contracts, budget renewals, or deadline expirations.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.aiDigest}
                      onChange={(e) =>
                        setPreferences({ ...preferences, aiDigest: e.target.checked })
                      }
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-900">Automated Daily AI Digest</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Summarize top thread highlights every morning at 08:00 AM.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.autoDrafting}
                      onChange={(e) =>
                        setPreferences({ ...preferences, autoDrafting: e.target.checked })
                      }
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-900">Auto-Draft Inbound Emails</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Trigger background LLM draft creation whenever unread customer inquiries arrive.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? 'Updating...' : 'Save Preferences'}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 3: Security */}
            {activeTab === 'security' && (
              <form onSubmit={handleSavePassword} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1 w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="mt-1 w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1 w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </AssistantLayout>
  );
}
