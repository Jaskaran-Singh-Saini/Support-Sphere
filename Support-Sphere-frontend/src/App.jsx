import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './components/Dashboard';
import ReflectionPage from './pages/ReflectionPage';
import SelfCarePage from './pages/SelfCarePage';
import ProgressPage from './pages/ProgressPage';
import CounselorListPage from './pages/CounselorListPage';
import CounselorProfilePage from './pages/CounselorProfilePage';
import AiChatPage from './pages/AiChatPage';
import ForumListPage from './pages/ForumListPage';
import ForumPostPage from './pages/ForumPostPage';
import LoginPage from './pages/LoginPage';
import CounselorDashboard from './pages/CounselorDashboard';
import StudentCaseFilePage from './pages/StudentCaseFilePage';
import VolunteerApplicationPage from './pages/VolunteerApplicationPage';
import AdminCounselorDashboard from './pages/AdminCounselorDashboard';
import SelfHelpPage from './pages/SelfHelpPage';
import TestSelectionPage from './pages/TestSelectionPage';
import QuizPage from './pages/QuizPage';
import OnboardingPage from './pages/OnboardingPage';
import SettingsPage from './pages/SettingsPage';
import AdminVolunteerApplicationsPage from './pages/AdminVolunteerApplicationsPage';
import CurrentVolunteersPage from './pages/CurrentVolunteersPage';
import CallPage from './pages/CallPage';
import CounselorListPageAdmin from './pages/AdminCounselorListPage';
import ReportConcernPage from './pages/ReportConcernPage';
import CreatePostPage from './pages/CreatePostPage';

import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Standalone pages (no main header) */}
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/student/login" element={<LoginPage />} />
      <Route path="/student/register" element={<RegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/counselor/dashboard" element={<ProtectedRoute requireRole="counselor"><CounselorDashboard /></ProtectedRoute>} />
      <Route path="/counselor/student/:studentId" element={<ProtectedRoute requireRole="counselor"><StudentCaseFilePage /></ProtectedRoute>} />
      <Route path="/apply-volunteer" element={<VolunteerApplicationPage />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute requireRole="admin"><AdminCounselorDashboard /></ProtectedRoute>} />
      <Route path="/admin/counselor-list" element={<ProtectedRoute requireRole="admin"><CounselorListPageAdmin /></ProtectedRoute>} />
      <Route path="/admin/volunteer-applications" element={<ProtectedRoute requireRole="admin"><AdminVolunteerApplicationsPage /></ProtectedRoute>} />
      <Route path="/admin/current-volunteers" element={<ProtectedRoute requireRole="admin"><CurrentVolunteersPage /></ProtectedRoute>} />
      <Route path="/call/:counselorId" element={<CallPage />} />
      <Route path="/report-concern" element={<ReportConcernPage />} />
      <Route path="/forum/new" element={<CreatePostPage />} />
      

      {/* Pages with the main header layout */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/reflection" element={<ReflectionPage />} />
        <Route path="/tasks" element={<SelfCarePage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/counseling" element={<CounselorListPage />} />
        <Route path="/counseling/:counselorId" element={<CounselorProfilePage />} />
        <Route path="/chat" element={<AiChatPage />} />
        <Route path="/self-help" element={<SelfHelpPage />} />
        <Route path="/assessments" element={<TestSelectionPage />} />
        <Route path="/assessments/:testSlug" element={<QuizPage />} />
        <Route path="/forum" element={<ForumListPage />} />
        <Route path="/forum/:postId" element={<ForumPostPage />} />
      </Route>
    </Routes>
  );
}

export default App;