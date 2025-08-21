// src/app/reset-password/page.js
"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ResetPasswordForm from '@/components/forms/ResetPasswordForm';

// Loading component for Suspense fallback
const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-md mx-auto">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pool-blue mx-auto mb-4"></div>
      <p className="text-gray-700 font-medium">Loading password reset form...</p>
    </div>
  </div>
);

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-brandeis-blue transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Login</span>
        </Link>
      </div>

      <div className="min-h-screen flex items-center justify-center px-6 sm:px-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">
              Enter your new password to regain access to your account.
            </p>
          </div>
          
          <Suspense fallback={<LoadingState />}>
            <ResetPasswordForm />
          </Suspense>
          
          {/* Back to Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Password reset successful?{' '}
              <Link 
                href="/login" 
                className="font-semibold text-pool-blue hover:text-brandeis-blue transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}