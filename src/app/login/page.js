// src/app/login/page.js

import React from 'react';
import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-blue-100">
      <div className="container mx-auto px-4 py-8">
        <LoginForm />
      </div>
    </div>
  );
}