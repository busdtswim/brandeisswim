'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import CoverageDashboard from '@/components/Instructor/CoverageDashboard';

const InstructorCoverage = () => {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <CoverageDashboard />;
};

export default InstructorCoverage; 