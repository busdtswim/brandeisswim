'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Send } from 'lucide-react';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  message: Yup.string()
    .min(10, 'Message is too short')
    .max(1000, 'Message is too long')
    .required('Message is required'),
});

const ContactForm = () => {
  const initialValues = {
    name: '',
    email: '',
    message: '',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm, setStatus }) => {
    try {
      const response = await fetch('/api/auth/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ success: true, message: 'Message sent successfully!' });
        resetForm();
      } else {
        setStatus({ 
          success: false, 
          message: data.message || 'Failed to send message. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus({ 
        success: false, 
        message: 'An error occurred. Please try again later.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, status, touched, errors }) => (
        <Form className="card h-fit max-w-6xl p-5 md:p-12 bg-white shadow-lg rounded-lg text-black" id="form">
          <h2 className="mb-4 text-2xl font-bold text-[#003478]">Ready to Get Started?</h2>
          {status && status.message && (
            <div 
              className={`mb-4 p-3 rounded-lg flex items-center justify-between ${
                status.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
              role="alert"
            >
              <span>{status.message}</span>
              {status.success && <span className="text-sm">✓</span>}
            </div>
          )}
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Name
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                autoComplete="given-name"
                placeholder="Your name"
                className={`mt-1 w-full rounded-md border py-2 px-4 shadow-sm transition duration-150 ease-in-out 
                  ${touched.name && errors.name 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-[#003478] focus:border-blue-500 focus:ring-blue-500'
                  }`}
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            <div className="relative">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="Your email address"
                className={`mt-1 w-full rounded-md border py-2 px-4 shadow-sm transition duration-150 ease-in-out 
                  ${touched.email && errors.email 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-[#003478] focus:border-blue-500 focus:ring-blue-500'
                  }`}
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            <div className="relative">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                Message
              </label>
              <Field
                as="textarea"
                id="message"
                name="message"
                rows="5"
                placeholder="Write your message..."
                className={`mt-1 w-full rounded-md border py-2 px-4 shadow-sm transition duration-150 ease-in-out 
                  ${touched.message && errors.message 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-[#003478] focus:border-blue-500 focus:ring-blue-500'
                  }`}
              />
              <ErrorMessage name="message" component="div" className="text-red-500 text-xs mt-1" />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#003478] text-white px-6 py-3 rounded-md 
                hover:bg-blue-700 focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-blue-500 
                transition duration-150 ease-in-out
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ContactForm;