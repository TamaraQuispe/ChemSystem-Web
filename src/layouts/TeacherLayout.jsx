import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TeacherSidebar from '../components/teacher/TeacherSidebar';
import TeacherHeader from '../components/teacher/TeacherHeader';
import { motion, AnimatePresence } from 'framer-motion';

const TeacherLayout = () => {
  const location = useLocation();
  const isGradesPage = location.pathname === '/teacher/grades';

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <TeacherSidebar />
      <div className="flex-grow flex flex-col min-w-0">
        <TeacherHeader showSearch={isGradesPage} />
        <motion.main 
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-grow p-8 lg:p-12 overflow-y-auto"
        >
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default TeacherLayout;
