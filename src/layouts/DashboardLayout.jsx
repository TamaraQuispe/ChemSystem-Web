import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import AITutor from '../components/ai/AITutor';
import AchievementToast from '../components/shared/AchievementToast';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Responsive Sidebar */}
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />
      
      <div className="flex-grow flex flex-col min-w-0">
        {/* Responsive Header */}
        <Header 
          onMenuClick={() => setIsMobileSidebarOpen(true)} 
        />
        
        {/* Responsive Main container */}
        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto"
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </motion.main>
      </div>
      
      <AchievementToast />
      <AITutor />
    </div>
  );
};

export default DashboardLayout;
