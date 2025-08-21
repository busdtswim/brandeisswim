'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, LogOut, User, Settings } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 bg-white backdrop-blur-lg shadow-lg border-b border-white/20`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo container with proper sizing */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative h-10 w-10 md:h-12 md:w-12 mr-3 transition-transform duration-200 group-hover:scale-105">
                <Image 
                  src="/logo.png" 
                  alt="Brandeis Swim Lessons Logo" 
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 40px, 48px"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-brandeis-blue to-pool-blue bg-clip-text text-transparent">
                  Brandeis Swim
                </span>
                <span className="text-xs md:text-sm text-gray-600 font-medium -mt-1">
                  Professional Instruction
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavLinks closeMenu={closeMenu} session={session} status={status} />
          </nav>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost"
            size="icon"
            className={`lg:hidden transition-all duration-200 hover:bg-pool-blue/10 ${
              isMenuOpen ? 'text-pool-blue' : 'text-gray-700'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${
        isMenuOpen 
          ? 'max-h-screen opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-lg">
          <nav className="max-w-7xl mx-auto py-6">
            <ul className="flex flex-col space-y-4">
              <MobileNavLinks closeMenu={closeMenu} session={session} status={status} handleLogout={handleLogout} />
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

// Desktop Navigation Links
const NavLinks = ({ closeMenu, session, status }) => {
  const pathname = usePathname();
  const baseLinkClasses = "relative px-4 py-2 font-medium transition-all duration-200 rounded-xl hover:bg-gradient-to-r hover:from-pool-blue/10 hover:to-brandeis-blue/10 hover:text-brandeis-blue";
  const activeLinkClasses = `${baseLinkClasses} text-brandeis-blue bg-gradient-to-r from-pool-blue/20 to-brandeis-blue/20 after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-gradient-to-r after:from-pool-blue after:to-brandeis-blue after:rounded-full`;
  const linkClasses = `${baseLinkClasses} text-gray-700 hover:text-brandeis-blue`;

  return (
    <>
      <Link 
        href="/lessons" 
        className={pathname === '/lessons' ? activeLinkClasses : linkClasses}
        onClick={closeMenu}
      >
        Lessons
      </Link>
      
      <Link 
        href="/contact" 
        className={pathname === '/contact' ? activeLinkClasses : linkClasses}
        onClick={closeMenu}
      >
        Contact
      </Link>
      
      {status === 'unauthenticated' ? (
        <>
          <Link 
            href="/register" 
            className="px-4 py-2 font-medium text-pool-blue hover:text-brandeis-blue transition-all duration-200 rounded-xl hover:bg-pool-blue/10"
            onClick={closeMenu}
          >
            Join Us
          </Link>
          <Button 
            asChild
            className="bg-gradient-to-r from-pool-blue to-brandeis-blue hover:from-brandeis-blue hover:to-pool-blue text-white font-medium px-6 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <Link 
              href="/login" 
              onClick={closeMenu}
            >
              Sign In
            </Link>
          </Button>
        </>
      ) : status === 'authenticated' && (
        <>
          {session.user.role === 'admin' ? (
            <Link 
              href="/admin" 
              className={pathname.startsWith('/admin') ? activeLinkClasses : linkClasses}
              onClick={closeMenu}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Admin
            </Link>
          ) : (
            <Link 
              href="/customer" 
              className={pathname.startsWith('/customer') ? activeLinkClasses : linkClasses}
              onClick={closeMenu}
            >
              <User className="w-4 h-4 inline mr-2" />
              Dashboard
            </Link>
          )}
          <Button 
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 rounded-xl"
            onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </>
      )}
    </>
  );
};

// Mobile Navigation Links 
const MobileNavLinks = ({ closeMenu, session, status, handleLogout }) => {
  const pathname = usePathname();
  const baseLinkClasses = "block py-3 px-4 font-medium transition-all duration-200 rounded-xl";
  const activeLinkClasses = `${baseLinkClasses} text-brandeis-blue bg-gradient-to-r from-pool-blue/20 to-brandeis-blue/20 border-l-4 border-brandeis-blue`;
  const linkClasses = `${baseLinkClasses} text-gray-700 hover:text-brandeis-blue hover:bg-gradient-to-r hover:from-pool-blue/10 hover:to-brandeis-blue/10`;

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
          Lessons
        </Link>
      </li>
      <li>
        <Link 
          href="/contact" 
          className={pathname === '/contact' ? activeLinkClasses : linkClasses}
          onClick={closeMenu}
        >
          Contact
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
              Join Us
            </Link>
          </li>
          <li className="pt-2">
            <Button 
              asChild
              className="w-full bg-gradient-to-r from-pool-blue to-brandeis-blue hover:from-brandeis-blue hover:to-pool-blue text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <Link 
                href="/login" 
                onClick={closeMenu}
              >
                Sign In
              </Link>
            </Button>
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
                <Settings className="w-4 h-4 inline mr-2" />
                Admin Dashboard
              </Link>
            </li>
          ) : (
            <li>
              <Link 
                href="/customer" 
                className={pathname.startsWith('/customer') ? activeLinkClasses : linkClasses}
                onClick={closeMenu}
              >
                <User className="w-4 h-4 inline mr-2" />
                My Dashboard
              </Link>
            </li>
          )}
          <li className="pt-2">
            <Button 
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 py-3 rounded-xl"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </li>
        </>
      )}
    </>
  );
};

export default Header;