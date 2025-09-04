// src/components/ModernHomepage.js
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Award, Calendar, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import EditableContent from '@/components/admin/EditableContent';

const ModernHomepage = () => {
  const { data: session, status } = useSession();

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        {/* Hero Background */}
        <div className="relative min-h-screen sm:h-[90vh] md:h-[100vh] w-full overflow-hidden">
          <Image 
            src="/header.jpeg" 
            alt="Swimming pool" 
            fill
            priority
            className="object-cover brightness-[0.6]"
            sizes="(max-width: 768px) 100vw, 100vw"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-pool-blue/20 to-brandeis-blue/40 z-[5]"></div>
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-white z-10">
            <div className="max-w-5xl mx-auto text-center">
              {/* Main Heading - Improved mobile sizing */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight scroll-reveal">
                Dive Into <span className="gradient-text">Excellence</span> With Brandeis Swim Lessons
              </h1>
              
              {/* Subtitle - Better mobile scaling */}
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed scroll-reveal px-2 sm:px-0">
                Join our professional swim program where safety meets fun. Develop essential 
                water skills in a supportive environment designed for all ages and abilities.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 scroll-reveal">
                {status === 'unauthenticated' ? (
                  <Link 
                    href="/register" 
                    className="btn-primary w-full sm:w-auto"
                  >
                    Start Your Journey
                  </Link>
                ) : status === 'authenticated' && (
                  <Link 
                    href={session?.user?.role === 'admin' ? '/admin' : '/customer'} 
                    className="btn-primary w-full sm:w-auto"
                  >
                    Go to Dashboard
                  </Link>
                )}
                <Link 
                  href="/lessons" 
                  className="btn-secondary w-full sm:w-auto"
                >
                  Learn More
                </Link>
              </div>
              
              {/* Stats Cards - Better mobile layout */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto scroll-reveal">
                <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold">300+</div>
                  <div className="text-xs sm:text-sm md:text-base opacity-90">Happy Swimmers</div>
                </div>
                <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold">30+</div>
                  <div className="text-xs sm:text-sm md:text-base opacity-90">Expert Instructors</div>
                </div>
                <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold">5+</div>
                  <div className="text-xs sm:text-sm md:text-base opacity-90">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin-Editable Content Sections */}
      <div className="scroll-reveal">
        <EditableContent />
      </div>

      {/* Program Info Section */}
      <section className="py-16 md:py-20 lg:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left column with image */}
            <div className="w-full lg:w-2/5 relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl scroll-reveal">
              <Image 
                src="/team.jpg" 
                alt="Brandeis Swim Program" 
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brandeis-blue/90 to-transparent p-6 text-white">
                <span className="text-sm font-semibold uppercase tracking-wide text-pool-blue">Brandeis University</span>
                <h3 className="text-xl font-bold">Swimming & Diving Teams</h3>
              </div>
            </div>
            
            {/* Right column with content */}
            <div className="lg:w-3/5 scroll-reveal">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-pool-blue"></div>
                <h2 className="text-pool-blue font-bold text-lg uppercase tracking-wide">Our Program</h2>
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">Excellence Through Experience</h3>
              
              <div className="space-y-6">
                                 <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                   Throughout the academic year, the Brandeis University Men&#39;s and Women&#39;s Swimming and 
                   Diving teams offer swimming lessons as fundraising to support the team&#39;s winter training trip.
                 </p>
                 
                 <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                   Lessons are taught by our experienced student-athletes and are designed to provide 
                   one-on-one instruction to swimmers of all ages and experience levels. These sessions offer 
                   the community an opportunity to improve their comfort and confidence in the water while directly 
                   supporting the team&#39;s training and development.
                 </p>
                
                <div className="bg-gradient-to-br from-pool-blue/5 to-brandeis-blue/5 border-l-4 border-pool-blue p-6 md:p-8 rounded-2xl">
                  <p className="font-bold text-lg text-gray-900 mb-4">Lesson Information:</p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center gap-3">
                      <span className="inline-block w-2 h-2 bg-pool-blue rounded-full flex-shrink-0"></span>
                      <span className="text-base md:text-lg">Duration: lessons run for 30 minutes</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="inline-block w-2 h-2 bg-pool-blue rounded-full flex-shrink-0"></span>
                      <span className="text-base md:text-lg">Cost: $40 per session, paid upfront</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="inline-block w-2 h-2 bg-pool-blue rounded-full flex-shrink-0"></span>
                      <span className="text-base md:text-lg">Payment should be made via cash or check</span>
                    </li>
                  </ul>
                </div>
                
                <Link href="/register" className="btn-outline inline-block">
                  Register Today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* General Information Section */}
      <section className="py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-1 w-12 bg-pool-blue"></div>
              <h2 className="text-pool-blue font-bold text-lg uppercase tracking-wide">What to Know</h2>
              <div className="h-1 w-12 bg-pool-blue"></div>
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">General Information</h3>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know before starting your swimming journey with us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="card-hover bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 scroll-reveal">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pool-blue to-brandeis-blue text-white rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Schedule & Reminders</h4>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Please note that you will not receive a reminder when lessons are about to begin. Be sure to mark 
                the lesson dates in your calendar upon receiving your email registration confirmation.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our schedule follows the Brandeis University Academic Calendar, and lessons will occur even on 
                recognized holidays and during public and private school vacations.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="card-hover bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 scroll-reveal">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pool-blue to-brandeis-blue text-white rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Safety & Equipment</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-pool-blue font-bold mt-1 text-lg">•</span>
                  <span className="leading-relaxed">No special equipment is required, though goggles are highly recommended for all participants.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pool-blue font-bold mt-1 text-lg">•</span>
                  <span className="leading-relaxed">For safety and hygiene reasons, long hair must be tied back.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pool-blue font-bold mt-1 text-lg">•</span>
                  <span className="leading-relaxed">Children who are unwell should remain at home.</span>
                </li>
              </ul>
            </div>
            
            {/* Card 3 */}
            <div className="card-hover bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 scroll-reveal">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pool-blue to-brandeis-blue text-white rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Policies & Payment</h4>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Please be aware that <strong>we do not offer refunds</strong>, and the availability of make-up 
                lessons cannot be guaranteed.
              </p>
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-r-xl text-sm text-gray-700">
                <strong className="text-yellow-800">Important:</strong> All payments must be completed before the first lesson. Any missed payments may result in the release of your reserved time slot.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 lg:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-1 w-12 bg-pool-blue"></div>
              <h2 className="text-pool-blue font-bold text-lg uppercase tracking-wide">Why Choose Us</h2>
              <div className="h-1 w-12 bg-pool-blue"></div>
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              Why Choose <span className="gradient-text">Brandeis</span>?
            </h3>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We offer professional instruction in a safe, supportive environment designed to help swimmers 
              of all levels build confidence and skills.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-hover bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-blue-100 scroll-reveal">
              <div className="rounded-2xl bg-gradient-to-br from-pool-blue to-brandeis-blue p-3 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-6">
                <Award className="text-white w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h4 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Expert Instructors</h4>
              <p className="text-gray-600 leading-relaxed">
                Our instructors bring years of experience and passion to every lesson, ensuring safe and effective learning for swimmers of all levels.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="card-hover bg-gradient-to-br from-cyan-50 to-blue-50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-cyan-100 scroll-reveal">
              <div className="rounded-2xl bg-gradient-to-br from-pool-blue to-brandeis-blue p-3 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-6">
                <Users className="text-white w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h4 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Personal Attention</h4>
              <p className="text-gray-600 leading-relaxed">
                We maintain 1-on-1 instruction with our private lessons, ensuring personalized attention and faster progress for every swimmer.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="card-hover bg-gradient-to-br from-purple-50 to-blue-50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-purple-100 scroll-reveal">
              <div className="rounded-2xl bg-gradient-to-br from-pool-blue to-brandeis-blue p-3 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-6">
                <Calendar className="text-white w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h4 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Flexible Scheduling</h4>
              <p className="text-gray-600 leading-relaxed">
                Sign up for however many sessions you can attend without paying the full cost. Learn at your own pace with our flexible approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-br from-brandeis-blue to-pool-blue text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-1 w-12 bg-white/40"></div>
              <h2 className="text-white/90 font-bold text-lg uppercase tracking-wide">Testimonials</h2>
              <div className="h-1 w-12 bg-white/40"></div>
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              What Our Swimmers Say
            </h3>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Hear from families who have experienced the difference our swim program makes in building confidence and skills.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {/* Testimonial 1 */}
             <div className="glass-effect p-6 md:p-8 rounded-2xl md:rounded-3xl scroll-reveal">
               <div className="flex items-center mb-6">
                 <div className="text-yellow-400 flex">
                   {[...Array(5)].map((_, i) => (
                     <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 20 20" fill="currentColor">
                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                     </svg>
                   ))}
                 </div>
               </div>
               <blockquote className="text-lg md:text-xl mb-6 leading-relaxed">
                 &#34;This was our six-year-old&#39;s first swim lesson experience. His teacher, Jason, was so friendly and attentive to his interests and his needs. We are grateful to the Brandeis Swim and Dive team for offering this option for one-on-one lessons. We&#39;ll definitely be signing up again next year!&#34;
               </blockquote>
               <cite className="font-semibold text-white/90">- Jonathan Krones</cite>
             </div>
             
             {/* Testimonial 2 */}
             <div className="glass-effect p-6 md:p-8 rounded-2xl md:rounded-3xl scroll-reveal">
               <div className="flex items-center mb-6">
                 <div className="text-yellow-400 flex">
                   {[...Array(5)].map((_, i) => (
                     <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 20 20" fill="currentColor">
                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                     </svg>
                   ))}
                 </div>
               </div>
               <blockquote className="text-lg md:text-xl mb-6 leading-relaxed">
                 &#34;I&#39;ve been so impressed with the private swimming lessons my child has been taking. The instructor is professional, patient, and tailors each lesson to my child&#39;s progress and comfort level. The personalized attention really helps Felix feel more confident in the water, and I&#39;ve noticed huge improvements in his skills. It&#39;s been a fantastic experience, and I highly recommend this program for anyone looking for focused, one-on-one swim instruction!&#34;
               </blockquote>
               <cite className="font-semibold text-white/90">- Nina Cheng</cite>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 lg:py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-brandeis-blue to-pool-blue rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl scroll-reveal">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              <div className="p-8 md:p-12 text-white">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">Ready to <span className="text-cyan-300">Dive In</span>?</h2>
                <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed">
                  Join our swim program today and experience the joy of swimming in a supportive, professional environment. Start your journey to water confidence with Brandeis.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/register" 
                    className="bg-white text-brandeis-blue hover:bg-gray-100 font-bold px-8 py-4 rounded-full transition-all duration-300 text-center transform hover:scale-105 hover:shadow-lg"
                  >
                    Register Now
                  </Link>
                  <Link 
                    href="/contact" 
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 font-bold px-8 py-4 rounded-full transition-all duration-300 text-center transform hover:scale-105"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
              <div className="relative h-64 lg:h-full min-h-[400px]">
                <Image 
                  src="/pool.jpg" 
                  alt="Swimming lesson" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
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