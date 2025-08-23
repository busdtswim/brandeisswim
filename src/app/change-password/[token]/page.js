'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, Lock, Key, CheckCircle, AlertTriangle } from 'lucide-react';

const validationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .matches(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .matches(/^(?=.*\d)/, 'Password must contain at least one number')
    .matches(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, 'Password must contain at least one special character')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function ChangePasswordPage() {
  const params = useParams();
  const router = useRouter();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/auth/validate-token/${params.token}`);
        if (response.ok) {
          const data = await response.json();
          setTokenValid(true);
          setUserEmail(data.email);
        } else {
          setTokenValid(false);
          setMessage({
            text: 'Invalid or expired password reset link. Please contact your administrator.',
            type: 'error'
          });
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setTokenValid(false);
        setMessage({
          text: 'An error occurred while validating your link. Please try again.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.token) {
      validateToken();
    }
  }, [params.token]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('/api/auth/instructor/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: values.newPassword,
          token: params.token,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({
          text: 'Password changed successfully! Logging you in...',
          type: 'success'
        });

        // Automatically log the user in with their new credentials
        try {
          const result = await signIn('credentials', {
            redirect: false,
            email: data.user.email,
            password: values.newPassword,
          });

          if (result?.error) {
            setMessage({
              text: 'Password changed but login failed. Please log in manually.',
              type: 'error'
            });
            setTimeout(() => {
              router.push('/login');
            }, 3000);
          } else {
            // Successfully logged in, redirect to appropriate dashboard
            const dashboardUrl = data.user.role === 'instructor' ? '/instructor' : '/admin';
            setTimeout(() => {
              router.push(dashboardUrl);
            }, 1500);
          }
        } catch (loginError) {
          console.error('Auto-login error:', loginError);
          setMessage({
            text: 'Password changed but login failed. Please log in manually.',
            type: 'error'
          });
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        }
      } else {
        const error = await response.json();
        setMessage({
          text: error.error || 'Failed to change password',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Password change error:', error);
      setMessage({
        text: 'An unexpected error occurred. Please try again.',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
            <p className="text-gray-600 mb-6">{message.text}</p>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Change Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome! Please set a new password for your account.
          </p>
          {userEmail && (
            <p className="mt-1 text-sm text-gray-500">
              Account: {userEmail}
            </p>
          )}
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        <Formik
          initialValues={{ newPassword: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <ErrorMessage 
                  name="newPassword" 
                  component="div" 
                  className="mt-1 text-sm text-red-500" 
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <ErrorMessage 
                  name="confirmPassword" 
                  component="div" 
                  className="mt-1 text-sm text-red-500" 
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
} 