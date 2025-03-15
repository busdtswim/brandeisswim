// src/components/Header.js
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const ModernHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled || isMenuOpen ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link 
            href="/"
            className={`text-2xl font-bold ${scrolled || isMenuOpen ? 'text-blue-600' : 'text-white'}`}
          >
            Brandeis Swim
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks scrolled={scrolled} closeMenu={closeMenu} session={session} status={status} />
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden p-2 rounded-lg ${
              scrolled || isMenuOpen ? 'text-blue-600' : 'text-white'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="container mx-auto px-4 py-4">
            <ul className="flex flex-col space-y-4">
              <MobileNavLinks closeMenu={closeMenu} session={session} status={status} handleLogout={handleLogout} />
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

// Desktop Navigation Links
const NavLinks = ({ scrolled, closeMenu, session, status }) => {
  const pathname = usePathname();
  const linkClasses = `font-medium hover:text-blue-500 transition-colors relative py-2 ${
    scrolled ? 'text-gray-800' : 'text-white'
  }`;
  const activeLinkClasses = `${linkClasses} after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-500`;

  return (
    <>
      <Link 
        href="/contact" 
        className={pathname === '/contact' ? activeLinkClasses : linkClasses}
        onClick={closeMenu}
      >
        Contact Us
      </Link>
      
      {status === 'unauthenticated' ? (
        <>
          <Link 
            href="/register" 
            className={pathname === '/register' ? activeLinkClasses : linkClasses}
            onClick={closeMenu}
          >
            Register
          </Link>
          <Link 
            href="/login" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors"
            onClick={closeMenu}
          >
            Login
          </Link>
        </>
      ) : status === 'authenticated' && (
        <>
          {session.user.role === 'admin' ? (
            <Link 
              href="/admin" 
              className={pathname.startsWith('/admin') ? activeLinkClasses : linkClasses}
              onClick={closeMenu}
            >
              Admin Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/lessons" 
                className={pathname === '/lessons' ? activeLinkClasses : linkClasses}
                onClick={closeMenu}
              >
                Register for Lessons
              </Link>
              <Link 
                href="/customer" 
                className={pathname.startsWith('/customer') ? activeLinkClasses : linkClasses}
                onClick={closeMenu}
              >
                My Dashboard
              </Link>
            </> 
          )}
          <button 
            onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </>
      )}
    </>
  );
};

// Mobile Navigation Links 
const MobileNavLinks = ({ closeMenu, session, status, handleLogout }) => {
  const pathname = usePathname();
  const linkClasses = "text-gray-800 font-medium block py-2";
  const activeLinkClasses = "text-blue-600 font-medium block py-2";

  return (
    <>
      <li>
        <Link 
          href="/" 
          className={pathname === '/' ? activeLinkClasses : linkClasses}
          onClick={closeMenu}
        >
          Home
        </Link>
      </li>
      <li>
        <Link 
          href="/lessons" 
          className={pathname === '/lessons' ? activeLinkClasses : linkClasses}
          onClick={closeMenu}
        >
          Swim Lessons
        </Link>
      </li>
      <li>
        <Link 
          href="/contact" 
          className={pathname === '/contact' ? activeLinkClasses : linkClasses}
          onClick={closeMenu}
        >
          Contact Us
        </Link>
      </li>
      
      {status === 'unauthenticated' ? (
        <>
          <li>
            <Link 
              href="/register" 
              className={pathname === '/register' ? activeLinkClasses : linkClasses}
              onClick={closeMenu}
            >
              Register
            </Link>
          </li>
          <li>
            <Link 
              href="/login" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block mt-2"
              onClick={closeMenu}
            >
              Login
            </Link>
          </li>
        </>
      ) : status === 'authenticated' && (
        <>
          {session.user.role === 'admin' ? (
            <li>
              <Link 
                href="/admin" 
                className={pathname.startsWith('/admin') ? activeLinkClasses : linkClasses}
                onClick={closeMenu}
              >
                Admin Dashboard
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link 
                  href="/lessons" 
                  className={pathname === '/lessons' ? activeLinkClasses : linkClasses}
                  onClick={closeMenu}
                >
                  Register for Lessons
                </Link>
              </li>
              <li>
                <Link 
                  href="/customer" 
                  className={pathname.startsWith('/customer') ? activeLinkClasses : linkClasses}
                  onClick={closeMenu}
                >
                  My Dashboard
                </Link>
              </li>
            </> 
          )}
          <li>
            <button 
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block mt-2"
            >
              Logout
            </button>
          </li>
        </>
      )}
    </>
  );
};

export default ModernHeader;