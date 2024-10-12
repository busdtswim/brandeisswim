'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, User, LogOut } from 'lucide-react';

const Header = () => {
  // These states will be replaced with actual authentication logic later
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const [userRole, setUserRole] = React.useState("customer");

  // This function will be replaced with actual logout logic
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#003478] text-white h-16 z-50 flex items-center px-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">Brandeis swimming lessons</div>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/" className="text-white hover:text-cyan-300">HOME</Link></li>
            <li><Link href="/contact" className="text-white hover:text-cyan-300 flex items-center"><Mail className="mr-1" size={18} />CONTACT</Link></li>
            {!isLoggedIn ? (
              <>
                <li><Link href="/register" className="text-white hover:text-cyan-300">REGISTER</Link></li>
                <li><Link href="/login" className="text-white hover:text-cyan-300">LOGIN</Link></li>
              </>
            ) : (
              <>
                {userRole === 'admin' ? (
                  <li><Link href="/admin" className="text-white hover:text-cyan-300">ADMIN DASHBOARD</Link></li>
                ) : (
                  <>
                  <li><Link href="/lessons" className="text-white hover:text-cyan-300">REGISTER FOR LESSONS</Link></li>
                  <li><Link href="/customer" className="text-white hover:text-cyan-300">MY DASHBOARD</Link></li>
                  </> 
                )}
                <li><button onClick={handleLogout} className="text-white hover:text-cyan-300 flex items-center"><LogOut className="mr-1" size={18} />LOGOUT</button></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;