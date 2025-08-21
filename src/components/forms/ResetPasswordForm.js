'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Shield } from 'lucide-react';

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

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength++;
    return strength;
  };

  if (!token) {
    return (
      <div className="w-full">
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <h2 className="text-lg font-bold">Invalid Reset Link</h2>
          </div>
          <p className="mb-4">
            The password reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-sm font-medium text-pool-blue hover:text-brandeis-blue transition-colors duration-200"
          >
            Request a new password reset link
          </Link>
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

  if (status.message) {
    return (
      <div className="w-full">
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
              You will be redirected to the login page in a few seconds...
            </p>
          )}
          
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-sm font-medium text-pool-blue hover:text-brandeis-blue transition-colors duration-200"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form className="space-y-6">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <Field
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full px-4 py-3 md:py-4 pl-11 pr-11 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-500" />
              
              {/* Password Requirements */}
              {values.password && (
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getPasswordStrength(values.password) >= 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={getPasswordStrength(values.password) >= 1 ? 'text-green-600' : 'text-gray-500'}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getPasswordStrength(values.password) >= 2 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={getPasswordStrength(values.password) >= 2 ? 'text-green-600' : 'text-gray-500'}>One lowercase letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getPasswordStrength(values.password) >= 3 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={getPasswordStrength(values.password) >= 3 ? 'text-green-600' : 'text-gray-500'}>One uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getPasswordStrength(values.password) >= 4 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={getPasswordStrength(values.password) >= 4 ? 'text-green-600' : 'text-gray-500'}>One number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getPasswordStrength(values.password) >= 5 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={getPasswordStrength(values.password) >= 5 ? 'text-green-600' : 'text-gray-500'}>One special character</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <Field
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full px-4 py-3 md:py-4 pl-11 pr-11 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-500" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pool-blue hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold px-8 py-3 md:py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Resetting Password...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Reset Password</span>
                </>
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;