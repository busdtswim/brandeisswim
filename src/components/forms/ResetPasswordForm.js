'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Check } from 'lucide-react';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .matches(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .matches(/^(?=.*\d)/, 'Password must contain at least one number')
    .matches(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState({ message: '', success: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full bg-blue-100">
        <div className="bg-white shadow-md rounded-lg px-8 py-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-[#003478]">Invalid Reset Link</h1>
          <p className="text-red-600 mb-4">
            The password reset link is invalid or has expired.
          </p>
          <div className="text-center mt-4">
            <Link
              href="/forgot-password"
              className="text-[#003478] hover:underline"
            >
              Request a new password reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          message: 'Your password has been reset successfully.',
          success: true,
        });
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setStatus({
          message: data.error || 'Failed to reset password. Please try again.',
          success: false,
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setStatus({
        message: 'An unexpected error occurred. Please try again later.',
        success: false,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-blue-100">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#003478]">Reset Your Password</h1>
        
        {status.message && (
          <div className={`p-4 mb-6 ${status.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} rounded-md`}>
            <p>{status.message}</p>
            {status.success && (
              <p className="mt-2">
                Redirecting you to the login page...
              </p>
            )}
          </div>
        )}
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#003478] mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="shadow-sm rounded-md w-full px-3 py-2 border border-[#003478] focus:outline-none focus:ring-2 focus:ring-cyan-300 text-black placeholder-gray-400 pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff size={20} className="text-[#003478]" />
                    ) : (
                      <Eye size={20} className="text-[#003478]" />
                    )}
                  </button>
                </div>
                <ErrorMessage 
                  name="password" 
                  component="div" 
                  className="mt-1 text-sm text-red-600" 
                />
                
                {/* Password Requirements */}
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-600 font-medium">Password Requirements:</p>
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    <div className={`flex items-center ${values.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                      <Check className={`h-3 w-3 mr-1 ${values.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} />
                      At least 8 characters
                    </div>
                    <div className={`flex items-center ${/[a-z]/.test(values.password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <Check className={`h-3 w-3 mr-1 ${/[a-z]/.test(values.password) ? 'text-green-600' : 'text-gray-400'}`} />
                      One lowercase letter
                    </div>
                    <div className={`flex items-center ${/[A-Z]/.test(values.password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <Check className={`h-3 w-3 mr-1 ${/[A-Z]/.test(values.password) ? 'text-green-600' : 'text-gray-400'}`} />
                      One uppercase letter
                    </div>
                    <div className={`flex items-center ${/\d/.test(values.password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <Check className={`h-3 w-3 mr-1 ${/\d/.test(values.password) ? 'text-green-600' : 'text-gray-400'}`} />
                      One number
                    </div>
                    <div className={`flex items-center ${/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(values.password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <Check className={`h-3 w-3 mr-1 ${/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(values.password) ? 'text-green-600' : 'text-gray-400'}`} />
                      One special character
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#003478] mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="shadow-sm rounded-md w-full px-3 py-2 border border-[#003478] focus:outline-none focus:ring-2 focus:ring-cyan-300 text-black placeholder-gray-400 pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} className="text-[#003478]" />
                    ) : (
                      <Eye size={20} className="text-[#003478]" />
                    )}
                  </button>
                </div>
                <ErrorMessage 
                  name="confirmPassword" 
                  component="div" 
                  className="mt-1 text-sm text-red-600" 
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || status.success}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#003478] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </Form>
          )}
        </Formik>
        
        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-sm text-[#003478] hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;