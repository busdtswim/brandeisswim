'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { Mail } from 'lucide-react';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
});

const ForgotPasswordForm = () => {
  const [status, setStatus] = useState({ 
    message: '', 
    success: false,
    submitted: false 
  });
  
  const initialValues = {
    email: '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          message: 'Password reset link has been sent to your email.',
          success: true,
          submitted: true
        });
      } else {
        setStatus({
          message: data.error || 'Failed to send reset email. Please try again.',
          success: false,
          submitted: true
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setStatus({
        message: 'An unexpected error occurred. Please try again later.',
        success: false,
        submitted: true
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-blue-100">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#003478]">Forgot Password</h1>
        
        {status.submitted ? (
          <div className={`p-4 mb-4 ${status.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} rounded-md`}>
            <p>{status.message}</p>
            {status.success && (
              <p className="mt-2">
                Please check your email for further instructions. 
                The link will expire in 1 hour for security reasons.
              </p>
            )}
            <div className="mt-4">
              <Link 
                href="/login" 
                className="text-[#003478] hover:underline"
              >
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <p className="text-gray-600 mb-4">
                  Enter your email address and we&#39;ll send you a link to reset your password.
                </p>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#003478] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="pl-10 shadow-sm rounded-md w-full px-3 py-2 border border-[#003478] focus:outline-none focus:ring-2 focus:ring-cyan-300 text-black placeholder-gray-400"
                      placeholder="your@email.com"
                    />
                  </div>
                  <ErrorMessage 
                    name="email" 
                    component="div" 
                    className="mt-1 text-sm text-red-600" 
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#003478] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
                
                <div className="text-center mt-4">
                  <Link
                    href="/login"
                    className="text-sm text-[#003478] hover:underline"
                  >
                    Back to Login
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordForm;