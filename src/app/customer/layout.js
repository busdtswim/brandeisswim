// src/app/customer/layout.js
import React from 'react';
import Sidebar from '@/components/customer/CustomerSideBar';

const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Main Layout */}
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1 relative">
          <Sidebar />
          {/* Main Content - No margin on mobile, margin only on desktop when sidebar is visible */}
          <main className="flex-1 w-full md:ml-72 transition-all duration-300">
            <div className="w-full px-4 py-6 md:px-6 md:py-8 lg:px-8">
              <div className="w-full max-w-7xl mx-auto">
                {/* Content wrapper with mobile-safe styling */}
                <div className="w-full min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-10rem)]">
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;