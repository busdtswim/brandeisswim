// src/app/admin/layout.js

import React from 'react';
import AdminSidebar from '@/components/AdminSideBar';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Layout - reduced top padding */}
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1 relative">
          <AdminSidebar />
          {/* Main Content */}
          <main className="flex-1 p-4 md:ml-64 transition-all duration-300">
            <div className="max-w-7xl mx-auto text-black">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;