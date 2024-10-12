'use client';

import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/AdminSideBar';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />
        {/* Main content */}
        <main className="flex-1 ml-64 p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
