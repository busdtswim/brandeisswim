// src/app/admin/view-schedule/page.js

'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminClassOverview from '@/components/admin/lessons/AdminClassOverview';

export default function ViewSchedulePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check if user needs to change password
    if (session?.user?.must_change_password) {
      router.push(`/change-password/${session.user.one_time_login_token || 'expired'}`);
      return;
    }
  }, [session, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (session?.user?.must_change_password) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to password change...</p>
        </div>
      </div>
    );
  }

  return <AdminClassOverview />;
}