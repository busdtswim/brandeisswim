// src/app/lessons/page.js
'use client';

import React from 'react';
import LessonRegistration from '@/components/LessonRegistration';
import Footer from '@/components/Footer';

const LessonsPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-blue-600 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Swim Lessons</h1>
            <p className="text-xl text-white mb-0">
              Join our professional swim program where safety meets fun. Develop essential 
              water skills in a supportive environment.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen">
        <LessonRegistration />
      </div>
    </>
  );
};

export default LessonsPage;