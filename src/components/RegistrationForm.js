'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  swimmerName: Yup.string().required('Swimmer\'s name is required'),
  birthday: Yup.date().required('Birthday is required').max(new Date(), 'Birthday cannot be in the future'),
  parentName: Yup.string(),
  swimmerGender: Yup.string().required('Gender is required'),
  phoneNumber: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
  preferredDays: Yup.array().min(1, 'Please select at least one preferred day'),
  proficiency: Yup.string().required('Proficiency level is required'),
});

const RegistrationForm = () => {
  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
    swimmerName: '',
    birthday: '',
    parentName: '',
    swimmerGender: '',
    phoneNumber: '',
    preferredDays: [],
    proficiency: '',
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values);
    // Here you would typically send this data to your backend
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, setFieldValue }) => {
        const birthDate = new Date(values.birthday);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        const showParentName = age < 18;

        // Custom validation for parent name
        React.useEffect(() => {
          if (showParentName && !values.parentName) {
            setFieldValue('parentName', '', false);
            errors.parentName = 'Parent\'s name is required for swimmers under 18';
          }
        }, [showParentName, values.parentName, setFieldValue]);

        return (
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
              <label htmlFor="swimmerName" className="block mb-2 text-[#003478]">Swimmer's Name (required)</label>
              <Field name="swimmerName" type="text" className="w-full p-2 border border-[#003478] rounded text-black placeholder-black" placeholder="Enter swimmer's name" />
              <ErrorMessage name="swimmerName" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-4">
              <label htmlFor="birthday" className="block mb-2 text-[#003478]">Birthday</label>
              <Field name="birthday" type="date" className="w-full p-2 border border-[#003478] rounded text-black" />
              <ErrorMessage name="birthday" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {showParentName && (
              <div className="mb-4">
                <label htmlFor="parentName" className="block mb-2 text-[#003478]">Parent's Name</label>
                <Field name="parentName" type="text" className="w-full p-2 border border-[#003478] rounded text-black placeholder-black" placeholder="Enter parent's name" />
                {errors.parentName && touched.parentName && <div className="text-red-500 text-sm mt-1">{errors.parentName}</div>}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="swimmerGender" className="block mb-2 text-[#003478]">Swimmer's Gender</label>
              <Field name="swimmerGender" as="select" className="w-full p-2 border border-[#003478] rounded text-black">
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Field>
              <ErrorMessage name="swimmerGender" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block mb-2 text-[#003478]">Phone Number</label>
              <Field name="phoneNumber" type="text" className="w-full p-2 border border-[#003478] rounded text-black placeholder-black" placeholder="Enter phone number" />
              <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-[#003478]">Preferred Days of the Week</label>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div key={day} className="flex items-center mb-2">
                  <Field type="checkbox" name="preferredDays" value={day.toLowerCase()} id={day} className="mr-2" />
                  <label htmlFor={day} className="text-[#003478]">{day}</label>
                </div>
              ))}
              <ErrorMessage name="preferredDays" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-6">
              <label htmlFor="proficiency" className="block mb-2 text-[#003478]">Proficiency in the Water</label>
              <Field name="proficiency" as="select" className="w-full p-2 border border-[#003478] rounded text-black">
                <option value="">Select proficiency</option>
                <option value="no experience">No Experience</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Field>
              <ErrorMessage name="proficiency" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#003478] text-white p-3 rounded hover:bg-blue-700 transition duration-300"
            >
              Submit Registration
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default RegistrationForm;