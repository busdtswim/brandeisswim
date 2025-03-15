// src/components/ModernHomepage.js
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, Calendar, Clock, Users } from 'lucide-react';

const ModernHomepage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        {/* Hero Background */}
        <div className="relative h-[600px] w-full overflow-hidden">
          <Image 
            src="/header.jpeg" 
            alt="Swimming pool" 
            fill
            priority
            className="object-cover brightness-[0.6]"
            sizes="(max-width: 768px) 100vw, 100vw"
          />
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-white z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                Dive Into Excellence With Brandeis Swim Lessons
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                Join our professional swim program where safety meets fun. Develop essential 
                water skills in a supportive environment designed for all ages and abilities.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Register Now
                </Link>
                <Link 
                  href="/lessons" 
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Explore Lessons
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Why Choose Our Swim Program?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer professional instruction in a safe, supportive environment designed to help swimmers 
              of all levels build confidence and skills.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Award className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Expert Instructors</h3>
              <p className="text-gray-600">
                Our certified instructors bring years of experience and passion to every lesson, ensuring safe and effective learning.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Users className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Small Class Sizes</h3>
              <p className="text-gray-600">
                We maintain small instructor-to-student ratios, ensuring personalized attention and faster progress.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-6">
                <Calendar className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Flexible Scheduling</h3>
              <p className="text-gray-600">
                Choose from a variety of class times and days to accommodate your busy lifestyle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 md:py-24 px-4 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Swimmers Say
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Hear from families who have experienced the difference our swim program makes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="text-lg mb-4">
                "My daughter was terrified of water before starting lessons here. Now she can't wait for her weekly class! The instructors are patient and make learning fun."
              </blockquote>
              <cite className="font-medium">- Sarah Thompson, Parent</cite>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="text-lg mb-4">
                "The swim lessons transformed my child's confidence in the water! We couldn't be happier with the progress they've made."
              </blockquote>
              <cite className="font-medium">- Michael Chen, Parent</cite>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Transforming Lives Through Swim Education
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                With over a decade of experience, we have taught thousands of students to swim confidently. Our success rate speaks for itself, ensuring safety and skill development for swimmers of all ages.
              </p>
              <div className="flex gap-4">
                <Link 
                  href="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center"
                >
                  Sign Up <ArrowRight size={16} className="ml-2" />
                </Link>
                <Link 
                  href="/about" 
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-200">
                <span className="text-5xl font-bold text-blue-600 block mb-2">95%</span>
                <span className="text-gray-600 font-medium">Success Rate</span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-200">
                <span className="text-5xl font-bold text-blue-600 block mb-2">10+</span>
                <span className="text-gray-600 font-medium">Years Experience</span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-200">
                <span className="text-5xl font-bold text-blue-600 block mb-2">1000+</span>
                <span className="text-gray-600 font-medium">Happy Swimmers</span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-200">
                <span className="text-5xl font-bold text-blue-600 block mb-2">20+</span>
                <span className="text-gray-600 font-medium">Certified Instructors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-blue-600 rounded-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8 md:p-12 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Dive In?</h2>
                <p className="text-blue-100 text-lg mb-8">
                  Join our swim program today and experience the joy of swimming in a supportive, professional environment.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/register" 
                    className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-colors text-center"
                  >
                    Sign Up Now
                  </Link>
                  <Link 
                    href="/contact" 
                    className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-center"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
              <div className="relative h-64 md:h-full min-h-[300px]">
                <Image 
                  src="/placeholder-cta.jpg" 
                  alt="Swimming lesson" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernHomepage;