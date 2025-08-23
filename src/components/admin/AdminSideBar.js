'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Menu, 
  X, 
  Home, 
  CalendarPlus, 
  Calendar, 
  ClipboardList, 
  Users, 
  FileText
} from 'lucide-react';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Get user's initial if available
  const userInitial = session?.user?.email?.charAt(0).toUpperCase() || 'A';
  const userEmail = session?.user?.email || 'admin@example.com';

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/admin/create-lessons', label: 'Create Lessons', icon: <CalendarPlus className="w-5 h-5" /> },
    { path: '/admin/view-schedule', label: 'View Schedule', icon: <Calendar className="w-5 h-5" /> },
    { path: '/admin/waitlist', label: 'View Waitlist', icon: <ClipboardList className="w-5 h-5" /> },
    { path: '/admin/add-instructor', label: 'Manage Instructors', icon: <Users className="w-5 h-5" /> },
    { path: '/admin/content', label: 'Edit Content', icon: <FileText className="w-5 h-5" /> }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="fixed top-20 left-4 md:hidden bg-brandeis-blue text-white p-2 rounded-xl z-20 w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-pool-blue hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:absolute left-0 top-0 bottom-0 bg-white/95 backdrop-blur-lg shadow-xl w-64 z-30
          transform transition-transform duration-300 ease-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0`}
      >
        {/* Close button for mobile */}
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 md:hidden transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}

        {/* User Info Section */}
        <div className="py-8 px-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-brandeis-blue to-pool-blue flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {userInitial}
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-900">Administrator</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-6">
          <div className="px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            MAIN
          </div>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-6 py-3 transition-all duration-200 mx-2 rounded-xl
                    ${pathname === item.path 
                      ? 'bg-gradient-to-r from-brandeis-blue to-pool-blue text-white font-medium shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-pool-blue hover:translate-x-1'
                    }`}
                >
                  <span className={`mr-3 ${pathname === item.path ? 'text-white' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
          <div className="text-center">
            <div className="w-8 h-1 bg-gradient-to-r from-brandeis-blue to-pool-blue mx-auto mb-2"></div>
            <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
            <p className="text-xs text-gray-400">Full System Access</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;