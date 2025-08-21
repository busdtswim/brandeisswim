// src/app/lessons/page.js
'use client';

import { useEffect } from 'react';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Award, Calendar, Users, Clock, Target, Heart, CheckCircle, Star } from 'lucide-react';
import LessonRegistration from '@/components/customer/lessons/LessonRegistration';

const LessonsPage = () => {
  // Scroll reveal animation
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.scroll-reveal');
    scrollElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brandeis-blue to-pool-blue text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 py-20 md:py-28 lg:py-32 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left scroll-reveal">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                  <div className="h-1 w-12 bg-white/40"></div>
                  <span className="text-white/90 font-bold text-lg uppercase tracking-wide">Swimming Lessons</span>
                  <div className="h-1 w-12 bg-white/40"></div>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Professional <span className="text-cyan-300">Swim Lessons</span> for All Ages
                </h1>
                
                <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Join our professional swim program where safety meets fun. Develop essential 
                  water skills in a supportive environment designed for swimmers of all levels.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                  <Link 
                    href="#registration" 
                    className="btn-primary bg-white text-brandeis-blue hover:bg-gray-100 w-full sm:w-auto"
                  >
                    Register Now
                  </Link>
                  <Link 
                    href="/contact" 
                    className="btn-secondary w-full sm:w-auto"
                  >
                    Ask Questions
                  </Link>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-cyan-300">$40</div>
                    <div className="text-sm text-white/80">Per Session</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-cyan-300">30min</div>
                    <div className="text-sm text-white/80">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-cyan-300">1:1</div>
                    <div className="text-sm text-white/80">Private Lessons</div>
                  </div>
                </div>
              </div>
              
              {/* Right Image */}
              <div className="relative scroll-reveal">
                <div className="relative h-[400px] lg:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                  <Image 
                    src="/team.jpg" 
                    alt="Brandeis Swimming Lessons" 
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brandeis-blue/40 to-transparent"></div>
                  
                  {/* Floating Info Card */}
                  <div className="absolute bottom-6 left-6 right-6 glass-effect rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pool-blue rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-bold">Expert Instructors</div>
                        <div className="text-white/80 text-sm">Brandeis University Athletes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Lessons Section */}
      <section className="py-16 md:py-20 lg:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-1 w-12 bg-pool-blue"></div>
              <h2 className="text-pool-blue font-bold text-lg uppercase tracking-wide">Why Choose Us</h2>
              <div className="h-1 w-12 bg-pool-blue"></div>
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              What Makes Our <span className="gradient-text">Lessons</span> Special?
            </h3>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our swim lessons combine the expertise of Brandeis University student-athletes with personalized, 
              one-on-one instruction designed to build confidence and skills in the water.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-hover bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-blue-100 scroll-reveal">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pool-blue to-brandeis-blue text-white rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h4 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">One-on-One Instruction</h4>
              <p className="text-gray-600 leading-relaxed">
                Every lesson is private, ensuring personalized attention and instruction tailored to your individual needs and learning pace.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-hover bg-gradient-to-br from-cyan-50 to-blue-50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-cyan-100 scroll-reveal">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pool-blue to-brandeis-blue text-white rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h4 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Expert Student-Athletes</h4>
              <p className="text-gray-600 leading-relaxed">
                Learn from experienced Brandeis University Swimming and Diving team members who bring competitive expertise and passion to teaching.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-hover bg-gradient-to-br from-purple-50 to-blue-50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-purple-100 scroll-reveal">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pool-blue to-brandeis-blue text-white rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h4 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Flexible Scheduling</h4>
              <p className="text-gray-600 leading-relaxed">
                Choose the number of sessions that work for your schedule. No need to commit to a full program - pay only for what you attend.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card-hover bg-gradient-to-br from-green-50 to-blue-50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-green-100 scroll-reveal">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pool-blue to-brandeis-blue text-white rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h4 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">All Skill Levels</h4>
              <p className="text-gray-600 leading-relaxed">
                From complete beginners to advanced swimmers looking to refine technique, our instructors adapt to every skill level and age group.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card-hover bg-gradient-to-br from-orange-50 to-blue-50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-orange-100 scroll-reveal">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pool-blue to-brandeis-blue text-white rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h4 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Convenient Duration</h4>
              <p className="text-gray-600 leading-relaxed">
                30-minute sessions provide focused, effective instruction without overwhelming new swimmers or exhausting young children.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card-hover bg-gradient-to-br from-pink-50 to-blue-50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-pink-100 scroll-reveal">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pool-blue to-brandeis-blue text-white rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h4 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Supporting Our Team</h4>
              <p className="text-gray-600 leading-relaxed">
                Your participation directly supports the Brandeis Swimming and Diving team&#39;s winter training program and competitive success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="scroll-reveal">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-pool-blue"></div>
                <h2 className="text-pool-blue font-bold text-lg uppercase tracking-wide">What to Expect</h2>
              </div>
              
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                Your Lesson <span className="gradient-text">Experience</span>
              </h3>
              
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Each lesson is carefully structured to maximize learning while ensuring a fun, supportive environment that builds confidence in the water.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-pool-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">Pre-Lesson Assessment</h4>
                    <p className="text-gray-600">Your instructor will assess your current skill level and discuss goals for the session.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-pool-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">Personalized Instruction</h4>
                    <p className="text-gray-600">Focused, one-on-one teaching tailored to your learning style and comfort level.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-pool-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">Progress Feedback</h4>
                    <p className="text-gray-600">Clear communication about progress made and recommendations for continued improvement.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="relative scroll-reveal">
              <div className="relative h-[400px] lg:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl">
                <Image 
                  src="/pool.jpg" 
                  alt="Swimming lesson in progress" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brandeis-blue/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="registration" className="py-16 md:py-20 lg:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-1 w-12 bg-pool-blue"></div>
              <h2 className="text-pool-blue font-bold text-lg uppercase tracking-wide">Registration</h2>
              <div className="h-1 w-12 bg-pool-blue"></div>
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              Ready to <span className="gradient-text">Get Started</span>?
            </h3>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Browse available lesson times and register for the sessions that work best for your schedule. 
              Payment is due before your first lesson.
            </p>
          </div>
          
          <div className="scroll-reveal">
            <LessonRegistration />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LessonsPage;