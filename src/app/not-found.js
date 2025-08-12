'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 404 Icon */}
        <div className="flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        {/* 404 Text */}
        <div>
          <h1 className="text-9xl font-bold text-gray-900">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Page Not Found
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <Home className="h-5 w-5 mr-2" />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            You might want to check out these pages:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/lessons"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200"
            >
              <Search className="h-4 w-4 mr-1" />
              Swimming Lessons
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className="pt-4">
          <p className="text-xs text-gray-400">
            If you believe this is an error, please{' '}
            <Link href="/contact" className="text-blue-500 hover:text-blue-600 underline">
              contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 