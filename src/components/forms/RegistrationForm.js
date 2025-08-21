'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { User, Mail, Lock, Calendar, Users, ChevronDown, Check, Plus, Trash2, Eye, EyeOff, AlertCircle, Phone } from 'lucide-react';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
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

      const data = await response.json();

      if (!response.ok) {
        // Map specific backend errors to fields
        if (data.error && data.error.toLowerCase().includes('email')) {
          setErrors({ email: data.error });
        } else {
          setSubmissionError(data.error || 'Registration failed');
        }
        return;
      }

      // Attempt to log in immediately after registration
      const loginResult = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (loginResult?.error) {
        // Show login error as a general error
        setSubmissionError(loginResult.error);
        return;
      }

      // Ensure session is established before redirecting
      router.push('/');
      router.refresh();
      router.push('/customer');
    } catch (error) {
      console.error('Registration error:', error);
      setSubmissionError(error.message || 'An error occurred during registration');
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="w-full">
      {submissionError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <div>
              <p className="font-medium">Registration Error</p>
              <p>{submissionError}</p>
            </div>
          </div>
        </div>
      )}
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, errors, touched }) => (
          <Form className="space-y-8">
            {/* Account Information Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Account Information</h3>
                <p className="text-sm text-gray-600">Create your account credentials</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <Field
                      name="fullName"
                      type="text"
                      className="w-full px-4 py-3 md:py-4 pl-11 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="John Smith"
                    />
                  </div>
                  <ErrorMessage name="fullName" component="div" className="mt-1 text-sm text-red-500" />
                </div>
                
                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <Field
                      name="phoneNumber"
                      type="text"
                      className="w-full px-4 py-3 md:py-4 pl-11 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="1234567890"
                    />
                  </div>
                  <ErrorMessage name="phoneNumber" component="div" className="mt-1 text-sm text-red-500" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <Field
                    name="email"
                    type="email"
                    className="w-full px-4 py-3 md:py-4 pl-11 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="your@email.com"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
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
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <Field
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
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
              </div>
            </div>

            {/* Swimmers Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Swimmer Information</h3>
                <p className="text-sm text-gray-600">Add swimmers who will be taking lessons</p>
              </div>

              <FieldArray name="swimmers">
                {({ remove, push }) => (
                  <div className="space-y-6">
                    {values.swimmers.map((swimmer, index) => (
                      <div key={index} className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-md font-semibold text-gray-900">Swimmer {index + 1}</h4>
                          {values.swimmers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700 transition-colors duration-200"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Swimmer Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Swimmer&#39;s Name
                            </label>
                            <Field
                              name={`swimmers.${index}.name`}
                              type="text"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900 placeholder-gray-500"
                              placeholder="Enter swimmer's name"
                            />
                            <ErrorMessage name={`swimmers.${index}.name`} component="div" className="mt-1 text-sm text-red-500" />
                          </div>

                          {/* Birthdate */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Birthdate
                            </label>
                            <Field
                              name={`swimmers.${index}.birthdate`}
                              type="date"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900"
                            />
                            <ErrorMessage name={`swimmers.${index}.birthdate`} component="div" className="mt-1 text-sm text-red-500" />
                          </div>

                          {/* Gender */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Gender
                            </label>
                            <Field
                              as="select"
                              name={`swimmers.${index}.gender`}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900"
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </Field>
                            <ErrorMessage name={`swimmers.${index}.gender`} component="div" className="mt-1 text-sm text-red-500" />
                          </div>

                          {/* Proficiency */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Swimming Level
                            </label>
                            <Field
                              as="select"
                              name={`swimmers.${index}.proficiency`}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900"
                            >
                              <option value="">Select Level</option>
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </Field>
                            <ErrorMessage name={`swimmers.${index}.proficiency`} component="div" className="mt-1 text-sm text-red-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => push({ name: '', birthdate: '', gender: '', proficiency: '' })}
                      className="w-full border-2 border-dashed border-pool-blue text-pool-blue hover:bg-pool-blue hover:text-white transition-all duration-300 py-3 rounded-xl flex items-center justify-center gap-2 font-medium"
                    >
                      <Plus className="w-5 h-5" />
                      Add Another Swimmer
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pool-blue hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegistrationForm;