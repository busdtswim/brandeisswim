// src/app/login/page.js

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-brandeis-blue transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>

      <div className="min-h-screen flex">
        {/* Left Side - Hero Content */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-brandeis-blue to-pool-blue">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-white/40"></div>
                <span className="text-white/90 font-bold text-sm uppercase tracking-wide">Welcome Back</span>
              </div>
              
              <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
                Dive Back Into Your <span className="text-cyan-300">Swimming Journey</span>
              </h1>
              
              <p className="text-lg xl:text-xl text-white/90 leading-relaxed mb-8">
                Access your account to manage lesson registrations, view your schedule, 
                and continue building your water confidence with Brandeis Swim Lessons.
              </p>
            </div>
            
            {/* Stats/Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                <span className="text-white/80">Manage your lesson schedule</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                <span className="text-white/80">Track your swimming progress</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                <span className="text-white/80">Connect with expert instructors</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-20">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your Brandeis Swim account</p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl xl:text-4xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600">Access your swimming lesson account</p>
            </div>
            
            <LoginForm />
            
            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don&#39;t have an account?{' '}
                <Link 
                  href="/register" 
                  className="font-semibold text-pool-blue hover:text-brandeis-blue transition-colors duration-200"
                >
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}