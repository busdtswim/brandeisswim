// src/app/instructor/waitlist/page.js

'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import InstructorViewWaitlist from '@/components/Instructor/InstructorViewWaitlist';

const InstructorWaitlist = () => {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <InstructorViewWaitlist />;
};

export default InstructorWaitlist; 