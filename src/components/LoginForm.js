'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().required('Password is required'),
  rememberMe: Yup.boolean(),
});

const LoginForm = () => {
  const router = useRouter();
  const [loginError, setLoginError] = useState('');
  
  const initialValues = {
    email: '',
    password: '',
    rememberMe: false,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoginError('');
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        setLoginError('Invalid email or password. Please try again.');
      } else {
        console.log('Login successful');
        router.push('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An unexpected error occurred. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-blue-100">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#003478]">Welcome Back!</h1>
        
        {loginError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {loginError}
          </div>
        )}
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#003478] mb-2">
                  Email Address
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="shadow-sm rounded-md w-full px-3 py-2 border border-[#003478] focus:outline-none focus:ring-2 focus:ring-cyan-300 text-black placeholder-gray-400"
                  placeholder="your@email.com"
                />
                <ErrorMessage 
                  name="email" 
                  component="div" 
                  className="mt-1 text-sm text-red-600" 
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#003478] mb-2">
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="shadow-sm rounded-md w-full px-3 py-2 border border-[#003478] focus:outline-none focus:ring-2 focus:ring-cyan-300 text-black placeholder-gray-400"
                  placeholder="Enter your password"
                />
                <ErrorMessage 
                  name="password" 
                  component="div" 
                  className="mt-1 text-sm text-red-600" 
                />
                <div className="mt-1">
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-[#003478] hover:text-cyan-600 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Field
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    className="h-4 w-4 rounded border-[#003478] text-[#003478] focus:ring-cyan-500"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-[#003478]">
                    Remember me
                  </label>
                </div>
                <Link 
                  href="/register" 
                  className="text-sm text-[#003478] hover:text-cyan-600 transition-colors"
                >
                  Create Account
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#003478] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;