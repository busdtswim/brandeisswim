'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import type { Session } from 'next-auth';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface NavLinksProps {
  closeMenu: () => void;
  session: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

interface MobileNavLinksProps extends NavLinksProps {
  handleLogout: () => void;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleLogout = async (): Promise<void> => {
    await signOut({ redirect: false });
    router.push('/');
    setIsMenuOpen(false);
  };

  const closeMenu = (): void => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white shadow-md">
      <div className="max-w-full px-3 md:px-5">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo container with proper sizing */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative h-10 w-10 mr-3">
                <Image 
                  src="/logo.png" 
                  alt="logo" 
                  fill
                  priority
                  className="object-contain"
                  sizes="40px"
                />
              </div>
              <span className="text-2xl font-bold text-blue-600">
                Brandeis Swim
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3">
            <NavLinks closeMenu={closeMenu} session={session} status={status} />
          </nav>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost"
            size="icon"
            className="md:hidden text-blue-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
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
const NavLinks: React.FC<NavLinksProps> = ({ closeMenu, session, status }) => {
  const pathname = usePathname();
  const linkClasses = "font-medium hover:text-blue-500 transition-colors relative py-2 text-gray-800";
  const activeLinkClasses = `${linkClasses} text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-500`;

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
            Join Us
          </Link>
          <Button 
            asChild
            variant="default"
            size="lg"
            className="ml-2"
          >
            <Link 
              href="/login" 
              onClick={closeMenu}
            >
              Login
            </Link>
          </Button>
        </>
      ) : status === 'authenticated' && session && (
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
          <Button 
            variant="default"
            size="lg"
            className="ml-2"
            onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
          >
            Logout
          </Button>
        </>
      )}
    </>
  );
};

// Mobile Navigation Links 
const MobileNavLinks: React.FC<MobileNavLinksProps> = ({ closeMenu, session, status, handleLogout }) => {
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
            <Button 
              asChild
              variant="default"
              size="lg"
              className="w-full"
            >
              <Link 
                href="/login" 
                onClick={closeMenu}
              >
                Login
              </Link>
            </Button>
          </li>
        </>
      ) : status === 'authenticated' && session && (
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
            <Button 
              variant="default"
              size="lg"
              className="w-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </li>
        </>
      )}
    </>
  );
};

export default Header; 