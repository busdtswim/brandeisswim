// src/app/admin/add-instructor/page.js

'use client';

import { useSession } from 'next-auth/react';
import AddInstructors from '@/components/admin/AddInstructors';

export default function AddInstructorsPage() {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <AddInstructors />;
}