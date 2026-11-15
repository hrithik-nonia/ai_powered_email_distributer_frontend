import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import RootRedirect from './components/RootRedirect';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import AssistantDashboard from './pages/AssistantDashboard';
import InboxPage from './pages/InboxPage';
import ClientDashboard from './pages/ClientDashboard';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public only routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected routes: Assistant only */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute allowedRole="assistant">
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="assistant">
              <AssistantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <ProtectedRoute allowedRole="assistant">
              <InboxPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbox/:threadId"
          element={
            <ProtectedRoute allowedRole="assistant">
              <InboxPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRole="assistant">
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Protected routes: Client only */}
        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        {/* Root redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
