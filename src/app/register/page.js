// src/app/register/page.js

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import RegistrationForm from '@/components/forms/RegistrationForm';

export default function RegisterPage() {
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
        <div className="hidden lg:flex lg:w-2/5 relative bg-gradient-to-br from-pool-blue to-brandeis-blue">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-white/40"></div>
                <span className="text-white/90 font-bold text-sm uppercase tracking-wide">Join Our Community</span>
              </div>
              
              <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
                Start Your <span className="text-cyan-300">Swimming Adventure</span> Today
              </h1>
              
              <p className="text-lg xl:text-xl text-white/90 leading-relaxed mb-8">
                Create your account to access professional swim lessons with Brandeis University 
                student-athletes. Build confidence, learn essential skills, and join our swimming community.
              </p>
            </div>
            
            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                <span className="text-white/80">Expert one-on-one instruction</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                <span className="text-white/80">Flexible scheduling options</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                <span className="text-white/80">Support Brandeis athletics</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                <span className="text-white/80">All ages and skill levels welcome</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-3/5 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-20 py-12">
          <div className="w-full max-w-2xl mx-auto">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Register for Swim Lessons</h1>
              <p className="text-gray-600">Create your account to get started</p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl xl:text-4xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Join the Brandeis Swim community</p>
            </div>
            
            <RegistrationForm />
            
            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="font-semibold text-pool-blue hover:text-brandeis-blue transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}