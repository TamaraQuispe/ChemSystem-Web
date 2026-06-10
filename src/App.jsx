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
import Analytics from './pages/analytics/Analytics';
import Community from './pages/community/Community';
import Settings from './pages/settings/Settings';
import AchievementsPage from './pages/achievements/AchievementsPage';
import TeacherLayout from './layouts/TeacherLayout';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherGrades from './pages/teacher/TeacherGrades';
import TeacherMonitoring from './pages/teacher/TeacherMonitoring';
import TeacherPredictive from './pages/teacher/TeacherPredictive';
import TeacherCommunity from './pages/teacher/TeacherCommunity';
import { useAuthStore } from './store/authStore';

// Lazy loaded advanced modules
const ElectrolysisPage = lazy(() => import('./pages/simulators/ElectrolysisPage'));
const CatalysisPage = lazy(() => import('./pages/simulators/CatalysisPage'));
const QuizPage = lazy(() => import('./pages/quizzes/QuizPage'));
const MolecularPage = lazy(() => import('./pages/molecular/MolecularPage'));
const AIPathPage = lazy(() => import('./pages/ai-learning/AIPathPage'));
const ModulesPage = lazy(() => import('./pages/quizzes/ModulesPage'));
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
          
          {/* Advanced Modules */}
          <Route path="simulators/electrolysis" element={
            <Suspense fallback={<LoadingFallback />}><ElectrolysisPage /></Suspense>
          } />
          <Route path="simulators/catalysis" element={
            <Suspense fallback={<LoadingFallback />}><CatalysisPage /></Suspense>
          } />
          <Route path="quizzes/molecular" element={
            <Suspense fallback={<LoadingFallback />}><QuizPage /></Suspense>
          } />
          <Route path="modules" element={
            <Suspense fallback={<LoadingFallback />}><ModulesPage /></Suspense>
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
          <Route index element={<TeacherDashboard />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="grades" element={<TeacherGrades />} />
          <Route path="monitoring" element={<TeacherMonitoring />} />
          <Route path="predictive" element={<TeacherPredictive />} />
          <Route path="community" element={<TeacherCommunity />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
