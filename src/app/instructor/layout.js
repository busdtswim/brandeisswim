// src/app/instructor/layout.js

import React from 'react';
import InstructorSidebar from '@/components/Instructor/InstructorSideBar';

const InstructorLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Layout - reduced top padding */}
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1 relative">
          <InstructorSidebar />
          {/* Main Content */}
          <main className="flex-1 p-4 md:ml-64 transition-all duration-300">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default InstructorLayout; 