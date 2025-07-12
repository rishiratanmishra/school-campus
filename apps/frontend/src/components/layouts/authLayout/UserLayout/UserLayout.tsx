  import React from 'react';
  import { motion } from 'framer-motion';
  import LeftNavigation from './UserLayoutNavigation/LeftNavigation';
  import RightNavigation from './UserLayoutNavigation/RightNavigation';

  const UserLayout = ({ children }: { children: React.ReactNode }) => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {/* Container with max-width (like Bootstrap) */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex min-h-screen">
          {/* Left Navigation - Hidden on mobile */}
          <motion.aside
            className="hidden lg:block lg:w-64 xl:w-72 border-r bg-background/95 backdrop-blur"
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <LeftNavigation />
          </motion.aside>

          {/* Main Content - Full width on mobile, constrained in center on desktop */}
          <main className="flex-1 overflow-y-auto py-4 px-0 sm:px-4 md:px-6">
            {children}
          </main>

          {/* Right Navigation - Hidden on mobile */}
          <motion.aside
            className="hidden lg:block lg:w-64 xl:w-80 border-l bg-background/95 backdrop-blur"
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <RightNavigation />
          </motion.aside>
        </div>
      </motion.div>
    );
  };

  export default UserLayout;
