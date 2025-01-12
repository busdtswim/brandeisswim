// src/app/admin/layout.js

import React from 'react';
import Sidebar from '@/components/AdminSideBar';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-blue-100">
      {/* Main Layout */}
      <div className="flex pt-16">
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 transition-all duration-300 md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
