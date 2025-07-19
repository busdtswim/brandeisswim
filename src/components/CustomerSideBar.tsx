'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, Calendar } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const CustomerSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Get user's initial if available
  const userInitial: string = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U';
  const userEmail: string = session?.user?.email || 'user@example.com';
  const userName: string = session?.user?.name || 'User Name';

  const navItems: NavItem[] = [
    { path: '/customer', label: 'Dashboard', icon: <User className="w-5 h-5" /> },
    { path: '/customer/view-schedule', label: 'View Schedule', icon: <Calendar className="w-5 h-5" /> },
  ];

  const handleToggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  const handleCloseMenu = (): void => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="fixed top-20 left-4 md:hidden bg-blue-500 text-white p-2 rounded-lg z-20 w-10 h-10 flex items-center justify-center shadow-md transition-colors hover:bg-blue-600"
        onClick={handleToggleMenu}
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={handleCloseMenu}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:absolute left-0 top-0 bottom-0 bg-white shadow-sm w-64 z-30
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0`}
      >
        {/* Close button for mobile */}
        {isOpen && (
          <button
            onClick={handleCloseMenu}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 md:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}

        {/* User Info Section */}
        <div className="py-8 px-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {userInitial}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{userName}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={handleCloseMenu}
                  className={`flex items-center px-6 py-3 transition-colors
                    ${pathname === item.path 
                      ? 'bg-blue-100 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                >
                  <span className={`mr-3 ${pathname === item.path ? 'text-blue-500' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default CustomerSidebar; 