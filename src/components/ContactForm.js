'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  message: Yup.string().required('Message is required'),
});

const ContactForm = () => {
  const initialValues = {
    name: '',
    email: '',
    message: '',
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log(values);
    // Here you would typically handle the form submission
    alert("Message sent!");
    resetForm();
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="card h-fit max-w-6xl p-5 md:p-12" id="form">
          <h2 className="mb-4 text-2xl font-bold text-[#003478]">Ready to Get Started?</h2>
          <div className="mb-6">
            <div className="mx-0 mb-1 sm:mb-4">
              <Field
                type="text"
                id="name"
                name="name"
                autoComplete="given-name"
                placeholder="Your name"
                className="mb-2 w-full rounded-md border border-[#003478] py-2 pl-2 pr-4 shadow-md text-black"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div className="mx-0 mb-1 sm:mb-4">
              <Field
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="Your email address"
                className="mb-2 w-full rounded-md border border-[#003478] py-2 pl-2 pr-4 shadow-md text-black"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div className="mx-0 mb-1 sm:mb-4">
              <Field
                as="textarea"
                id="message"
                name="message"
                rows="5"
                placeholder="Write your message..."
                className="mb-2 w-full rounded-md border border-[#003478] py-2 pl-2 pr-4 shadow-md text-black"
              />
              <ErrorMessage name="message" component="div" className="text-red-500 text-xs mt-1" />
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#003478] text-white px-6 py-3 font-xl rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              Send Message
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ContactForm;