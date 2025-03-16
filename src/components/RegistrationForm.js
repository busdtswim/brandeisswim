'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { User, Mail, Lock, Calendar, Users, ChevronDown, Check, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  
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
      setSubmissionError('');
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
      setSubmissionError(error.message || 'An error occurred during registration');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Left side - Image/Brand area */}
        <div className="hidden md:block md:w-1/3 bg-blue-600 text-white p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6">Dive Into Excellence</h2>
            <p className="mb-8 text-blue-100">
              Join our professional swim program where safety meets fun. Develop essential 
              water skills in a supportive environment.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white text-blue-600 flex items-center justify-center mr-2">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm">Professional instructors</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white text-blue-600 flex items-center justify-center mr-2">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm">Small class sizes</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white text-blue-600 flex items-center justify-center mr-2">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm">All ages and skill levels</span>
              </li>
            </ul>
          </div>
          
          {/* Background decorative elements */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-50 -mr-32 -mb-32"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400 rounded-full opacity-30 -mr-20 -mt-20"></div>
        </div>
        
        {/* Right side - Form */}
        <div className="p-8 md:w-2/3">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h1>
            <p className="text-gray-600">Join Brandeis Swim Lessons and register swimmers for classes.</p>
          </div>

          {submissionError && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-500 text-red-700">
              <p className="font-medium">Registration Error</p>
              <p>{submissionError}</p>
            </div>
          )}
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          name="fullName"
                          type="text"
                          className={`block w-full pl-10 pr-3 py-2 rounded-md border ${
                            errors.fullName && touched.fullName ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="John Smith"
                        />
                      </div>
                      <ErrorMessage name="fullName" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                        <Field
                          name="phoneNumber"
                          type="text"
                          className={`block w-full pl-10 pr-3 py-2 rounded-md border ${
                            errors.phoneNumber && touched.phoneNumber ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="1234567890"
                        />
                      </div>
                      <ErrorMessage name="phoneNumber" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        name="email"
                        type="email"
                        className={`block w-full pl-10 pr-3 py-2 rounded-md border ${
                          errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="your@email.com"
                      />
                    </div>
                    <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          name="password"
                          type={showPassword ? "text" : "password"}
                          className={`block w-full pl-10 pr-10 py-2 rounded-md border ${
                            errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(prev => !prev)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          className={`block w-full pl-10 pr-10 py-2 rounded-md border ${
                            errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(prev => !prev)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>
                </div>

                {/* Swimmers Section */}
                <div className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Swimmer Information</h2>
                    <div className="h-px bg-gray-200 flex-grow ml-4"></div>
                  </div>
                  
                  <FieldArray name="swimmers">
                    {({ push, remove }) => (
                      <div className="space-y-6">
                        {values.swimmers.map((_, index) => (
                          <div key={index} className="p-5 border border-gray-200 rounded-lg bg-gray-50 relative">
                            <div className="absolute top-4 right-4 flex items-center text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                              <Users className="w-4 h-4 mr-1" />
                              <span>Swimmer {index + 1}</span>
                            </div>
                            
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <label htmlFor={`swimmers.${index}.name`} className="block text-sm font-medium text-gray-700 mb-1">
                                  Swimmer's Name
                                </label>
                                <Field 
                                  name={`swimmers.${index}.name`} 
                                  type="text" 
                                  className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                  placeholder="Enter swimmer's name" 
                                />
                                <ErrorMessage name={`swimmers.${index}.name`} component="div" className="mt-1 text-sm text-red-600" />
                              </div>

                              <div>
                                <label htmlFor={`swimmers.${index}.birthdate`} className="block text-sm font-medium text-gray-700 mb-1">
                                  Birth Date
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <Field 
                                    name={`swimmers.${index}.birthdate`} 
                                    type="date" 
                                    className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                  />
                                </div>
                                <ErrorMessage name={`swimmers.${index}.birthdate`} component="div" className="mt-1 text-sm text-red-600" />
                              </div>

                              <div>
                                <label htmlFor={`swimmers.${index}.gender`} className="block text-sm font-medium text-gray-700 mb-1">
                                  Gender
                                </label>
                                <div className="relative">
                                  <Field 
                                    name={`swimmers.${index}.gender`} 
                                    as="select" 
                                    className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                  >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                  </Field>
                                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                    <ChevronDown className="h-5 w-5" />
                                  </div>
                                </div>
                                <ErrorMessage name={`swimmers.${index}.gender`} component="div" className="mt-1 text-sm text-red-600" />
                              </div>

                              <div>
                                <label htmlFor={`swimmers.${index}.proficiency`} className="block text-sm font-medium text-gray-700 mb-1">
                                  Proficiency Level
                                </label>
                                <div className="relative">
                                  <Field 
                                    name={`swimmers.${index}.proficiency`} 
                                    as="select" 
                                    className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                  >
                                    <option value="">Select proficiency</option>
                                    <option value="no experience">No Experience</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                  </Field>
                                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                    <ChevronDown className="h-5 w-5" />
                                  </div>
                                </div>
                                <ErrorMessage name={`swimmers.${index}.proficiency`} component="div" className="mt-1 text-sm text-red-600" />
                              </div>
                            </div>

                            {index > 0 && (
                              <button 
                                type="button" 
                                onClick={() => remove(index)} 
                                className="mt-4 flex items-center text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                <span>Remove Swimmer</span>
                              </button>
                            )}
                          </div>
                        ))}
                        
                        <button 
                          type="button" 
                          onClick={() => push({ name: '', birthdate: '', gender: '', proficiency: '' })} 
                          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
                        >
                          <Plus className="h-5 w-5 mr-1" />
                          <span>Add Another Swimmer</span>
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
                
                <p className="text-center text-sm text-gray-500">
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;