'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { User, Calendar, LogOut, Menu, X } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Get user's initial if available
  const userInitial = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U';
  const userEmail = session?.user?.email || 'user@example.com';
  const userName = session?.user?.name || 'User Name';

  const navItems = [
    { path: '/customer', label: 'Dashboard', icon: <User className="w-5 h-5" /> },
    { path: '/customer/view-schedule', label: 'My Schedule', icon: <Calendar className="w-5 h-5" /> },
  ];

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="fixed top-20 left-4 md:hidden bg-gradient-to-r from-pool-blue to-brandeis-blue text-white p-2 rounded-xl z-20 w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-all duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`} onClick={() => setIsOpen(false)} />

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:absolute left-0 top-16 md:top-0 bottom-0 bg-gradient-to-b from-white via-gray-50/50 to-white shadow-xl border-r border-gray-100 w-72 z-30
          transform transition-all duration-300 ease-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0`}
      >
        {/* Header Section */}
        <div className="relative bg-gradient-to-br from-brandeis-blue to-pool-blue text-white p-6 mb-6">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-300/10 rounded-full blur-xl"></div>
          
          {/* User Info Section */}
          <div className="relative z-10">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {userInitial}
              </div>
              <div className="ml-4">
                <p className="text-lg font-bold text-white">{userName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4">
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-3">Navigation</h3>
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
                        isActive 
                          ? 'bg-gradient-to-r from-pool-blue to-brandeis-blue text-white shadow-lg transform scale-[1.02]' 
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-pool-blue/10 hover:to-brandeis-blue/10 hover:text-brandeis-blue'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl"></div>
                      )}
                      <span className={`mr-3 relative z-10 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-gray-500 group-hover:text-brandeis-blue'
                      }`}>
                        {item.icon}
                      </span>
                      <span className="relative z-10 font-medium">{item.label}</span>
                      {isActive && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-80"></div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 to-transparent">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group border border-gray-200 hover:border-red-200"
          >
            <span className="mr-3 text-gray-500 group-hover:text-red-500 transition-colors duration-200">
              <LogOut className="w-5 h-5" />
            </span>
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;