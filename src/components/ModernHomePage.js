// src/components/ModernHomepage.js
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, Calendar, Users } from 'lucide-react';
import EditableContent from '@/components/EditableContent';

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

      {/* Admin-Editable Content Sections */}
      <EditableContent />

      {/* Program Info Section */}
        <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Left column with image */}
            <div className="md:w-2/5 relative h-[400px] md:h-auto rounded-2xl overflow-hidden shadow-xl">
              <Image 
                src="/team.jpg" 
                alt="Brandeis Swim Program" 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/80 to-transparent p-6 text-white">
                <span className="text-sm font-semibold uppercase tracking-wide">Brandeis University</span>
                <h3 className="text-xl font-bold">Swimming & Diving Teams</h3>
              </div>
            </div>
            
            {/* Right column with content */}
            <div className="md:w-3/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-10 bg-blue-600"></div>
                <h2 className="text-blue-600 font-semibold text-lg">Our Program</h2>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Program Information</h3>
              
              <div className="prose prose-lg prose-blue max-w-none">
                <p className="lead text-xl text-gray-600 mb-6">
                  Throughout the academic year, the Brandeis University Men's and Women's Swimming and 
                  Diving teams offer swimming lessons as fundraising to support the team's winter training trip.
                </p>
                
                <p>
                  Lessons are taught by our experienced student-athletes and are designed to provide 
                  one-on-one instruction to swimmers of all ages and experience levels. These sessions offer 
                  the community an opportunity to improve their comfort and confidence in the water while directly 
                  supporting the team's training and development.
                </p>
                
                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg my-8">
                  <p className="font-medium text-gray-900 mb-1">Lesson Information:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                      Each lesson lasts <strong>30 minutes</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                      Cost is <strong>$40 per session</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                      <strong>Payment is required upfront</strong> and can be made by cash or check
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* General Information Section */}
        <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-1 w-10 bg-blue-600"></div>
              <h2 className="text-blue-600 font-semibold text-lg">What to Know</h2>
              <div className="h-1 w-10 bg-blue-600"></div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">General Information</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-4 text-gray-900">Schedule & Reminders</h4>
              <p className="text-gray-600">
                Please note that you will not receive a reminder when lessons are about to begin. Be sure to mark 
                the lesson dates in your calendar upon receiving your email registration confirmation.
              </p>
              <p className="text-gray-600 mt-4">
                Our schedule follows the Brandeis University Academic Calendar, and lessons will occur even on 
                recognized holidays and during public and private school vacations.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-4 text-gray-900">Safety & Equipment</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>No special equipment is required, though goggles are highly recommended for all participants.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>For safety and hygiene reasons, long hair must be tied back.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Children who are unwell should remain at home.</span>
                </li>
              </ul>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-4 text-gray-900">Policies & Payments</h4>
              <p className="text-gray-600">
                Please be aware that <strong>we do not offer refunds</strong>, and the availability of make-up 
                lessons cannot be guaranteed.
              </p>
              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r text-sm text-gray-700">
                <strong className="text-yellow-800">Important:</strong> All payments must be completed before the first lesson. Any missed payments may result in the release of your reserved time slot.
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
                  src="/lessons.jpeg" 
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