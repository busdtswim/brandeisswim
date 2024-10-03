import React from 'react';
import LoginForm from '../../components/LoginForm';
import Header from '../../components/Header';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-blue-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <LoginForm />
      </div>
    </div>
  );
}