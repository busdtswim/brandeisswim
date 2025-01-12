'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, LogOut, Menu, X } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const NavLinks = () => (
    <>
      <li>
        <Link 
          href="/" 
          className="text-white hover:text-cyan-300 block py-2 md:py-0"
          onClick={closeMenu}
        >
          HOME
        </Link>
      </li>
      <li>
        <Link 
          href="/contact" 
          className="text-white hover:text-cyan-300 flex items-center py-2 md:py-0"
          onClick={closeMenu}
        >
          <Mail className="mr-1" size={18} />CONTACT
        </Link>
      </li>
      {status === 'unauthenticated' ? (
        <>
          <li>
            <Link 
              href="/register" 
              className="text-white hover:text-cyan-300 block py-2 md:py-0"
              onClick={closeMenu}
            >
              REGISTER
            </Link>
          </li>
          <li>
            <Link 
              href="/login" 
              className="text-white hover:text-cyan-300 block py-2 md:py-0"
              onClick={closeMenu}
            >
              LOGIN
            </Link>
          </li>
        </>
      ) : status === 'authenticated' && (
        <>
          {session.user.role === 'admin' ? (
            <li>
              <Link 
                href="/admin" 
                className="text-white hover:text-cyan-300 block py-2 md:py-0"
                onClick={closeMenu}
              >
                ADMIN DASHBOARD
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link 
                  href="/lessons" 
                  className="text-white hover:text-cyan-300 block py-2 md:py-0"
                  onClick={closeMenu}
                >
                  REGISTER FOR LESSONS
                </Link>
              </li>
              <li>
                <Link 
                  href="/customer" 
                  className="text-white hover:text-cyan-300 block py-2 md:py-0"
                  onClick={closeMenu}
                >
                  MY DASHBOARD
                </Link>
              </li>
            </> 
          )}
          <li>
            <button 
              onClick={handleLogout} 
              className="text-white hover:text-cyan-300 flex items-center py-2 md:py-0 w-full"
            >
              <LogOut className="mr-1" size={18} />LOGOUT
            </button>
          </li>
        </>
      )}
    </>
  );

  return (
    <header className="bg-[#003478] text-white h-16 flex items-center w-full">
      <div className="flex justify-between items-center w-full">
        <div className="text-white font-bold text-lg md:text-2xl pl-4">
          Brandeis swimming lessons
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white pr-4"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:block pr-4">
          <ul className="flex space-x-8">
            <NavLinks />
          </ul>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="absolute top-16 right-0 w-64 bg-[#003478] shadow-lg md:hidden">
            <ul className="flex flex-col p-4 space-y-2">
              <NavLinks />
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;