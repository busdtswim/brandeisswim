// src/app/register/page.js

import React from 'react';
import RegistrationForm from '../../components/RegistrationForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-blue-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#003478]">Register for Swim Lessons</h1>
        <RegistrationForm />
      </div>
    </div>
  );
}