// src/app/forgot-password/page.js

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ForgotPasswordForm from '@/components/forms/ForgotPasswordForm';

export default function ForgotPasswordPage() {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
            <p className="text-gray-600">
              Enter your email address and we&#39;ll send you a link to reset your password.
            </p>
          </div>
          
          <ForgotPasswordForm />
          
          {/* Back to Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Remember your password?{' '}
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