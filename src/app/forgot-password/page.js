// src/app/forgot-password/page.js

import React from 'react';
import ForgotPasswordForm from '@/components/forms/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-blue-100">
      <div className="container mx-auto px-4 py-8">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}