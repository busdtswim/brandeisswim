// src/app/reset-password/page.js
"use client";

import React, { Suspense } from 'react';
import ResetPasswordForm from '@/components/ResetPasswordForm';

// Loading component for Suspense fallback
const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-blue-100">
    <div className="bg-white shadow-md rounded-lg p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
      <p className="text-gray-700">Loading password reset form...</p>
    </div>
  </div>
);

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-blue-100">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingState />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}