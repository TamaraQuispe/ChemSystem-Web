import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParentSidebar from '../components/parent/ParentSidebar';
import ParentHeader from '../components/parent/ParentHeader';
import ParentMobileNav from '../components/parent/ParentMobileNav';

const ParentLayout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <ParentSidebar onNavClick={() => setMobileMenuOpen(false)} />
      <ParentMobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex-grow flex flex-col min-w-0">
        <ParentHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-grow p-4 sm:p-8 lg:p-12 overflow-y-auto"
        >
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default ParentLayout;
