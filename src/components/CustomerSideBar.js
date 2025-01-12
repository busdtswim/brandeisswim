'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { path: '/customer', label: 'Dashboard' },
    { path: '/customer/view-schedule', label: 'View Schedule' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="fixed top-20 left-4 md:hidden bg-blue-400 text-white p-2 rounded-lg z-50 w-10 h-10 flex items-center justify-center shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-16 left-0 h-[calc(100vh-64px)] bg-blue-200 w-64 z-50 
          transform transition-transform duration-300 ease-in-out 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0`}
      >
        {/* Close button for mobile */}
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="absolute -right-10 top-2 text-white md:hidden"
            aria-label="Close menu"
          >
          
          </button>
        )}

        {/* Navigation */}
        <nav className="h-full py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path} className="mx-2">
                <Link
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors
                    ${pathname === item.path 
                      ? 'bg-blue-200 text-blue-800' 
                      : 'text-gray-700 hover:bg-blue-300'
                    }`}
                >
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

export default Sidebar;