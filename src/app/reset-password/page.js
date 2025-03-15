// src/app/reset-password/page.js

import React from 'react';
import ResetPasswordForm from '@/components/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-blue-100">
      <div className="container mx-auto px-4 py-8">
        <ResetPasswordForm />
      </div>
    </div>
  );
}