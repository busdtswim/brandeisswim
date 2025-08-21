'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

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
    <div className="w-full">
      {status.submitted ? (
        <div className={`p-6 rounded-xl border ${
          status.success 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            {status.success ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            )}
            <p className="font-medium">{status.message}</p>
          </div>
          
          {status.success && (
            <p className="text-sm mb-4">
              Please check your email for further instructions. 
              The link will expire in 1 hour for security reasons.
            </p>
          )}
          
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-sm font-medium text-pool-blue hover:text-brandeis-blue transition-colors duration-200"
          >
            Return to Login
          </Link>
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 md:py-4 pl-11 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="your@email.com"
                  />
                </div>
                <ErrorMessage 
                  name="email" 
                  component="div" 
                  className="mt-1 text-sm text-red-500" 
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-pool-blue hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold px-8 py-3 md:py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default ForgotPasswordForm;