'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/create-lessons', label: 'Create Lessons' },
    { path: '/admin/view-schedule', label: 'View Schedule' },
    { path: '/admin/add-instructor', label: 'Add Instructors' },
    { path: '/admin/content', label: 'Edit Content' }
  ];

  return (
    <aside
      className="fixed left-0 top-16 w-64 bg-blue-200 h-[calc(100vh-64px)] overflow-hidden z-40"
    >
      <nav>
        <ul className="flex flex-col py-4 space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-300 text-black border-l-4 ${
                  pathname === item.path ? 'border-blue-500' : 'border-transparent'
                } hover:border-blue-500 pr-6 pl-6`}
              >
                <span className="ml-2 text-sm tracking-wide truncate">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
