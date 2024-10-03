import React from 'react';
import dynamic from 'next/dynamic';
import Header from '../../components/Header';
import RegistrationForm from '../../components/RegistrationForm';

// const RegistrationForm = dynamic(() => import('../../components/RegistrationForm'), { ssr: false });

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-blue-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#003478]">Register for Swim Lessons</h1>
        <RegistrationForm />
      </div>
    </div>
  );
}