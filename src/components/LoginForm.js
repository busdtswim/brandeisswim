'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
  rememberMe: Yup.boolean(),
});

const LoginForm = () => {
  const initialValues = {
    email: '',
    password: '',
    rememberMe: false,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values);
    // Here you would typically handle the login logic
    alert("Login attempted");
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-blue-100">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-[#003478]">Welcome Back!</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-[#003478] mb-2">Email Address</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="shadow-sm rounded-md w-full px-3 py-2 border border-[#003478] focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  placeholder="your@email.com"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-[#003478] mb-2">Password</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="shadow-sm rounded-md w-full px-3 py-2 border border-[#003478] focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  placeholder="Enter your password"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                <Link href="/forgot-password" className="text-xs text-[#003478] hover:text-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                  Forgot Password?
                </Link>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Field
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    className="h-4 w-4 rounded border-[#003478] text-[#003478] focus:ring-cyan-500 focus:outline-none"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-[#003478]">Remember me</label>
                </div>
                <Link href="/register" className="text-xs text-[#003478] hover:text-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                  Create Account
                </Link>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#003478] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                Login
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;