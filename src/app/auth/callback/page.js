// src/app/auth/callback/page.js

'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AuthCallback = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session?.user) {
      const { role } = session.user;
      
      if (role === 'admin') {
        router.push('/admin');
      } else if (role === 'instructor') {
        router.push('/instructor');
      } else {
        router.push('/');
      }
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default AuthCallback; 