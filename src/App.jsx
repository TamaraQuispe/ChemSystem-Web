import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import React, { lazy, Suspense, useEffect } from 'react';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Recovery from './pages/auth/Recovery';
import RoleSelection from './pages/auth/RoleSelection';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/dashboard/Home';
import Simulators from './pages/simulators/Simulators';
import SimulatorPage from './pages/simulators/SimulatorPage';
import Analytics from './pages/analytics/Analytics';
import Community from './pages/community/Community';
import Settings from './pages/settings/Settings';
import AchievementsPage from './pages/achievements/AchievementsPage';
import TeacherLayout from './layouts/TeacherLayout';
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'));
const TeacherGrades = lazy(() => import('./pages/teacher/TeacherGrades'));
const TeacherMonitoring = lazy(() => import('./pages/teacher/TeacherMonitoring'));
const TeacherPredictive = lazy(() => import('./pages/teacher/TeacherPredictive'));
const TeacherCommunity = lazy(() => import('./pages/teacher/TeacherCommunity'));
const NewPracticePage = lazy(() => import('./pages/teacher/NewPracticePage'));
const ClassroomDetail = lazy(() => import('./pages/teacher/ClassroomDetail'));
import ParentLayout from './layouts/ParentLayout';
import ParentRoute from './components/parent/ParentRoute';
import ParentDashboard from './pages/parent/ParentDashboard';
import ParentAlerts from './pages/parent/ParentAlerts';
import ParentRecommendations from './pages/parent/ParentRecommendations';
import ParentMessages from './pages/parent/ParentMessages';
import ParentAchievements from './pages/parent/ParentAchievements';
import { useAuthStore } from './store/authStore';

// Lazy loaded advanced modules
const ElectrolysisPage = lazy(() => import('./pages/simulators/ElectrolysisPage'));
const CatalysisPage = lazy(() => import('./pages/simulators/CatalysisPage'));
const QuizPage = lazy(() => import('./pages/quizzes/QuizPage'));
const MolecularPage = lazy(() => import('./pages/molecular/MolecularPage'));
const AIPathPage = lazy(() => import('./pages/ai-learning/AIPathPage'));
const ModulesPage = lazy(() => import('./pages/quizzes/ModulesPage'));
const ModuleDetail = lazy(() => import('./pages/modules/ModuleDetail'));
const CourseDetail = lazy(() => import('./pages/courses/CourseDetail'));
const CertificateViewer = lazy(() => import('./pages/courses/CertificateViewer'));
const LessonsPage = lazy(() => import('./pages/lessons/LessonsPage'));
const LessonViewer = lazy(() => import('./pages/lessons/LessonViewer'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const TeacherRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== 'teacher') return <Navigate to="/home" />;
  return children;
};

function App() {
  const { isAuthenticated, fetchUser, user } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/role-selection" element={isAuthenticated ? <RoleSelection /> : <Navigate to="/login" />} />

        {/* Dashboard Routes (Protected) */}
        <Route path="/" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="simulators" element={<Simulators />} />
          <Route path="simulators/:id" element={
            <Suspense fallback={<LoadingFallback />}><SimulatorPage /></Suspense>
          } />
          <Route path="quizzes/molecular" element={
            <Suspense fallback={<LoadingFallback />}><QuizPage /></Suspense>
          } />
          <Route path="modules" element={
            <Suspense fallback={<LoadingFallback />}><ModulesPage /></Suspense>
          } />
          <Route path="modules/:id" element={
            <Suspense fallback={<LoadingFallback />}><ModuleDetail /></Suspense>
          } />
          <Route path="modules/course/:courseSlug" element={
            <Suspense fallback={<LoadingFallback />}><CourseDetail /></Suspense>
          } />
          <Route path="certificates" element={
            <Suspense fallback={<LoadingFallback />}><CertificateViewer /></Suspense>
          } />
          <Route path="molecular/builder" element={
            <Suspense fallback={<LoadingFallback />}><MolecularPage /></Suspense>
          } />
          <Route path="ai-learning/path" element={
            <Suspense fallback={<LoadingFallback />}><AIPathPage /></Suspense>
          } />
          <Route path="lessons" element={
            <Suspense fallback={<LoadingFallback />}><LessonsPage /></Suspense>
          } />
          <Route path="lessons/:lessonId" element={
            <Suspense fallback={<LoadingFallback />}><LessonViewer /></Suspense>
          } />

          <Route path="analytics" element={<Analytics />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="community" element={<Community />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Teacher Routes (Role-protected) */}
        <Route path="/teacher" element={isAuthenticated ? <TeacherRoute><TeacherLayout /></TeacherRoute> : <Navigate to="/login" />}>
          <Route index element={<Suspense fallback={<LoadingFallback />}><TeacherDashboard /></Suspense>} />
          <Route path="dashboard" element={<Suspense fallback={<LoadingFallback />}><TeacherDashboard /></Suspense>} />
          <Route path="grades" element={<Suspense fallback={<LoadingFallback />}><TeacherGrades /></Suspense>} />
          <Route path="monitoring" element={<Suspense fallback={<LoadingFallback />}><TeacherMonitoring /></Suspense>} />
          <Route path="predictive" element={<Suspense fallback={<LoadingFallback />}><TeacherPredictive /></Suspense>} />
          <Route path="community" element={<Suspense fallback={<LoadingFallback />}><TeacherCommunity /></Suspense>} />
          <Route path="new-practice" element={<Suspense fallback={<LoadingFallback />}><NewPracticePage /></Suspense>} />
          <Route path="classroom/:id" element={<Suspense fallback={<LoadingFallback />}><ClassroomDetail /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<LoadingFallback />}><Settings /></Suspense>} />
        </Route>

        {/* Parent Routes (Role-protected) */}
        <Route path="/parent" element={isAuthenticated ? <ParentRoute><ParentLayout /></ParentRoute> : <Navigate to="/login" />}>
          <Route index element={<ParentDashboard />} />
          <Route path="dashboard" element={<ParentDashboard />} />
          <Route path="alerts" element={<ParentAlerts />} />
          <Route path="recommendations" element={<ParentRecommendations />} />
          <Route path="messages" element={<ParentMessages />} />
          <Route path="achievements" element={<ParentAchievements />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
