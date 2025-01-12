import React from 'react';
import Sidebar from '@/components/CustomerSideBar';

const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-blue-100">
      {/* Main Layout */}
      <div className="flex pt-16">
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 p-4 md:ml-64 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;