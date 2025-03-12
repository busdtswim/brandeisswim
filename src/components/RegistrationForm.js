'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  phoneNumber: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
  fullName: Yup.string().required('Full name is required'),
  swimmers: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Swimmer\'s name is required'),
      birthdate: Yup.date().required('Birthdate is required'),
      gender: Yup.string().required('Gender is required'),
      proficiency: Yup.string().required('Proficiency level is required'),
    })
  ).min(1, 'At least one swimmer is required'),
});

const RegistrationForm = () => {
  const router = useRouter();
  
  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    fullName: '',
    swimmers: [{ 
      name: '', 
      birthdate: '', 
      gender: '',
      proficiency: '' 
    }],
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      // Attempt to log in immediately after registration
      const loginResult = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (loginResult?.error) {
        throw new Error(loginResult.error);
      }

      // Redirect to home page after successful registration and login
      router.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ 
        submit: error.message || 'An error occurred during registration' 
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
      {({ values, isSubmitting }) => (
        <Form className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-[#003478]">Swim Lesson Registration Form</h2>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-[#003478]">Email</label>
            <Field name="email" type="email" className="w-full p-2 border border-[#003478] rounded text-black placeholder-black" placeholder="Enter email" />
            <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-[#003478]">Password</label>
            <Field name="password" type="password" className="w-full p-2 border border-[#003478] rounded text-black placeholder-black" placeholder="Enter password" />
            <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 text-[#003478]">Confirm Password</label>
            <Field name="confirmPassword" type="password" className="w-full p-2 border border-[#003478] rounded text-black placeholder-black" placeholder="Confirm password" />
            <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block mb-2 text-[#003478]">Phone Number</label>
            <Field name="phoneNumber" type="text" className="w-full p-2 border border-[#003478] rounded text-black placeholder-black" placeholder="Enter phone number" />
            <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div className="mb-4">
            <label htmlFor="fullName" className="block mb-2 text-[#003478]">Full Name</label>
            <Field name="fullName" type="text" className="w-full p-2 border border-[#003478] rounded text-black placeholder-black" placeholder="Enter your full name" />
            <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <FieldArray name="swimmers">
            {({ push, remove }) => (
              <div>
                {values.swimmers.map((_, index) => (
                  <div key={index} className="mb-4 p-4 border border-[#003478] rounded">
                    <h3 className="text-lg font-semibold mb-2 text-[#003478]">Swimmer {index + 1}</h3>
                    
                    <div className="mb-2">
                      <label htmlFor={`swimmers.${index}.name`} className="block mb-1 text-[#003478]">Full Name</label>
                      <Field 
                        name={`swimmers.${index}.name`} 
                        type="text" 
                        className="w-full p-2 border border-[#003478] rounded text-black placeholder-black" 
                        placeholder="Enter swimmer's name" 
                      />
                      <ErrorMessage name={`swimmers.${index}.name`} component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="mb-2">
                      <label htmlFor={`swimmers.${index}.birthdate`} className="block mb-1 text-[#003478]">Birth Date</label>
                      <Field 
                        name={`swimmers.${index}.birthdate`} 
                        type="date" 
                        className="w-full p-2 border border-[#003478] rounded text-black" 
                      />
                      <ErrorMessage name={`swimmers.${index}.birthdate`} component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="mb-2">
                      <label htmlFor={`swimmers.${index}.gender`} className="block mb-1 text-[#003478]">Gender</label>
                      <Field 
                        name={`swimmers.${index}.gender`} 
                        as="select" 
                        className="w-full p-2 border border-[#003478] rounded text-black"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Field>
                      <ErrorMessage name={`swimmers.${index}.gender`} component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="mb-2">
                      <label htmlFor={`swimmers.${index}.proficiency`} className="block mb-1 text-[#003478]">Proficiency</label>
                      <Field 
                        name={`swimmers.${index}.proficiency`} 
                        as="select" 
                        className="w-full p-2 border border-[#003478] rounded text-black"
                      >
                        <option value="">Select proficiency</option>
                        <option value="no experience">No Experience</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </Field>
                      <ErrorMessage name={`swimmers.${index}.proficiency`} component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {index > 0 && (
                      <button 
                        type="button" 
                        onClick={() => remove(index)} 
                        className="mt-2 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-300"
                      >
                        Remove Swimmer
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => push({ name: '', birthdate: '', gender: '', proficiency: '' })} 
                  className="mb-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300"
                >
                  Add Another Swimmer
                </button>
              </div>
            )}
          </FieldArray>

          <button 
            type="submit" 
            className="w-full bg-[#003478] text-white p-3 rounded hover:bg-blue-700 transition duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RegistrationForm;