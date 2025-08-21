'use client';

import { useEffect } from 'react';
import React from 'react';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import ContactForm from '@/components/forms/ContactForm';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ContactPage = () => {
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
      {/* Contact Hero Section */}
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
                  <span className="text-white/90 font-bold text-lg uppercase tracking-wide">Contact Us</span>
                  <div className="h-1 w-12 bg-white/40"></div>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Get In <span className="text-cyan-300">Touch</span>
                </h1>
                
                <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Have questions about our swim lessons? We&#39;re here to help! 
                  Reach out and let&#39;s discuss how we can help you or your child become confident in the water.
                </p>
                
                {/* Quick Contact Info */}
                <div className="space-y-4 max-w-lg mx-auto lg:mx-0">
                  <div className="flex items-center gap-3 justify-center lg:justify-start">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-cyan-300" />
                    </div>
                    <span className="text-white/90">busdtswimlessons@brandeis.edu</span>
                  </div>
                  <div className="flex items-center gap-3 justify-center lg:justify-start">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-cyan-300" />
                    </div>
                    <span className="text-white/90">Joseph M. Linsey Sports Center, Waltham, MA</span>
                  </div>
                </div>
              </div>
              
              {/* Right Info Card */}
              <div className="relative scroll-reveal">
                <div className="glass-effect rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 text-white">Why Contact Us?</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-cyan-300 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-white/90">Get personalized lesson recommendations</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-cyan-300 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-white/90">Schedule a facility tour</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-cyan-300 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-white/90">Ask about group or family lessons</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-cyan-300 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-white/90">Learn about special needs accommodations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Content */}
      <section className="py-16 md:py-20 lg:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="scroll-reveal">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-pool-blue"></div>
                <h2 className="text-pool-blue font-bold text-lg uppercase tracking-wide">Contact Info</h2>
              </div>
              
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                Let&#39;s <span className="gradient-text">Connect</span>
              </h3>
              
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Whether you&#39;re looking to enroll in swimming lessons, have questions about our programs, 
                or need more information, we&#39;re here to assist you. Feel free to reach out using any of 
                the methods below.
              </p>
              
              <div className="space-y-6">
                <div className="card-hover bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pool-blue to-brandeis-blue text-white rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold mb-2 text-gray-900">Our Location</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Joseph M. Linsey Sports Center<br />
                      Brandeis University<br />
                      Waltham, MA 02453
                    </p>
                  </div>
                </div>
                
                <div className="card-hover bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 rounded-2xl p-6 flex items-start gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pool-blue to-brandeis-blue text-white rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold mb-2 text-gray-900">Email Us</h4>
                    <a 
                      href="mailto:busdtswimlessons@brandeis.edu" 
                      className="text-pool-blue hover:text-brandeis-blue transition-colors duration-200 font-medium"
                    >
                      busdtswimlessons@brandeis.edu
                    </a>
                    <p className="text-gray-600 mt-1 text-sm">We typically respond within 24 hours</p>
                  </div>
                </div>

                <div className="card-hover bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-6 flex items-start gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pool-blue to-brandeis-blue text-white rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold mb-2 text-gray-900">Response Time</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Monday - Friday: Within 24 hours<br />
                      Weekends: Within 48 hours<br />
                      <span className="text-sm text-gray-500">During academic year</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="scroll-reveal">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-pool-blue"></div>
                <h2 className="text-pool-blue font-bold text-lg uppercase tracking-wide">Send Message</h2>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 leading-tight">
                Send Us a <span className="gradient-text">Message</span>
              </h3>
              
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl md:rounded-3xl border border-gray-100 p-6 md:p-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-1 w-12 bg-pool-blue"></div>
              <h2 className="text-pool-blue font-bold text-lg uppercase tracking-wide">Location</h2>
              <div className="h-1 w-12 bg-pool-blue"></div>
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              Find <span className="gradient-text">Us</span>
            </h3>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Located in the beautiful Joseph M. Linsey Sports Center at Brandeis University
            </p>
          </div>
          
          <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-[500px] relative scroll-reveal">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=Joseph+M.+Linsey+Sports+Center,Brandeis+University,Waltham+MA`}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 lg:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-1 w-12 bg-pool-blue"></div>
              <h2 className="text-pool-blue font-bold text-lg uppercase tracking-wide">FAQ</h2>
              <div className="h-1 w-12 bg-pool-blue"></div>
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h3>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Find answers to our most commonly asked questions. If you can&#39;t find what you&#39;re looking for, 
              please don&#39;t hesitate to contact us.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto scroll-reveal">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-2" className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-sm border border-blue-100">
                <AccordionTrigger className="px-6 py-6 text-lg md:text-xl font-bold text-gray-900 hover:no-underline">
                  What age groups and abilities do you cater to?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed">
                  Brandeis Swim team members work with all ages and ability from 1 years of age to adult.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl shadow-sm border border-cyan-100">
                <AccordionTrigger className="px-6 py-6 text-lg md:text-xl font-bold text-gray-900 hover:no-underline">
                  What are the qualifications of your instructors?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed">
                  Our instructors have over 10 years of swimming experience, and most teach at their home pools over the summer and throughout high school. Regardless of experience first-year swimmers are introduced to our &#34;Safety First&#34; method of teaching lessons that includes body awareness, breathing and stroke development.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-sm border border-purple-100">
                <AccordionTrigger className="px-6 py-6 text-lg md:text-xl font-bold text-gray-900 hover:no-underline">
                  What is the instructor to student ratio?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed">
                  Our lessons are a 1:1 ratio, occasionally we will partner up a newer instructor with an experienced one to make sure child has fun while also learning. We also try to group friends together as well.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-sm border border-green-100">
                <AccordionTrigger className="px-6 py-6 text-lg md:text-xl font-bold text-gray-900 hover:no-underline">
                  What is the structure of the lesson?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed">
                  <p>Our first lesson is about gaining confidence and getting and understanding of your child&#39;s ability and needs. From there your instructor will develop body position awareness (floating), breathing (comfortability of face in the water), phases of forward movement (freestyle) and then from there all safety and stroke developmental.</p>
                  <p className="mt-4">The goal for all beginner swimmers is to be comfortable with their face in the water, floating, and able to safely get themselves out of the pool. More experienced swimmers will develop freestyle, higher level safety skills such as treading water and then the remaining swimming strokes. The last few minutes of class will always be saved for fun!</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-2xl shadow-sm border border-orange-100">
                <AccordionTrigger className="px-6 py-6 text-lg md:text-xl font-bold text-gray-900 hover:no-underline">
                  How do you assess and track progress?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Our instructors keep notes and will share progress with parents every lesson.</li>
                    <li>All instructors are provided with guidelines and target areas of improvement that can also be shared with parents upon request.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7" className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl shadow-sm border border-pink-100">
                <AccordionTrigger className="px-6 py-6 text-lg md:text-xl font-bold text-gray-900 hover:no-underline">
                  What safety measures are in place?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed">
                  Our 1:1 ratio provides our instructors with full attention to your swimmer. We also have the deck monitored to make sure young swimmers are being respectful of the water. We do expect parents to maintain 100% contact with their children while waiting for their lesson to start.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-8" className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-sm border border-blue-100">
                <AccordionTrigger className="px-6 py-6 text-lg md:text-xl font-bold text-gray-900 hover:no-underline">
                  What should my child bring to swim lessons?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Children who are not potty trained should be DOUBLE SWIM DIAPERS. If there is a fecal incident the pool must be shut down for 24 hours which will impact the entire lesson program. Please make sure to have your swimmer use the bathroom beforehand and double up. Non disposable diapers are preferred.</li>
                    <li>Male, Female and Family Locker rooms are provided.</li>
                    <li>A towel and a change of clothes. The pool is kept at a competitive swimming temperature of 83 degrees, so it can get chilly for the little ones.</li>
                    <li>If your child has long hair, please tie up in ponytails or braids, it can be very uncomfortable to have hair in their face while trying to learn to breath.</li>
                    <li>Goggles and fun toys are welcome however we will work with your child to not have a dependency on goggles as a safety precaution.</li>
                    <li>We do not teach with floatation devices; the goal is for your child to be able to save themselves in an emergency.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-9" className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl shadow-sm border border-cyan-100">
                <AccordionTrigger className="px-6 py-6 text-lg md:text-xl font-bold text-gray-900 hover:no-underline">
                  Are parents allowed to watch lessons?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Parents are welcome to sit on the benches provided. Please know that if your young swimmer has any type of nervousness, sometimes it does help for the parent to not be on deck in their view but this will be handled on a case-by-case basis. We also have the stands open for any parents to sit and view.</li>
                    <li>Parents of children under 3 should expect to get in the water with their child. Developmentally young swimmers often need the security of their parent. As they become more confident the parent may be able to sit on the side. You know your child best.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-10" className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-sm border border-purple-100">
                <AccordionTrigger className="px-6 py-6 text-lg md:text-xl font-bold text-gray-900 hover:no-underline">
                  What is the policy for missed lessons?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed">
                  We will have one make-up lesson at the end of the session. The instructor and time are not guaranteed and we will discuss towards the end. No refunds are given for any missed lessons. All payments are final.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-11" className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-sm border border-green-100">
                <AccordionTrigger className="px-6 py-6 text-lg md:text-xl font-bold text-gray-900 hover:no-underline">
                  How do you handle children with special needs?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed">
                  Our instructors have a variety of abilities and skills. If your child has special needs please communicate that before your lesson so we are able to provide the safest and best experience possible. We may not be able to meet all requests but will try.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-12" className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-2xl shadow-sm border border-orange-100">
                <AccordionTrigger className="px-6 py-6 text-lg md:text-xl font-bold text-gray-900 hover:no-underline">
                  How can parents support their child&#39;s learning?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed">
                  <p>Learning how to swim is a life skill that we are proud to provide. Drowning is the number one cause of death for children 1-6. A parent&#39;s role is to always make sure they are watching their child in an aquatic setting. Just because a child has swim lessons does not mean they are water safe; no one is ever water safe not even our elite-level college swimmers. Our goal is to teach parents and swimmers a healthy respect for the water and skills to develop throughout life.</p>
                  <p className="mt-4">Parents may need to sit on the edge with their swimmer or even be out of view so the young swimmer isn&#39;t distracted but this will be discussed with your instructor and management.</p>
                  <p className="mt-4">Any parents that also want to learn to swim, please speak to the managers. Our goal is safety for everyone, and we would be happy to provide lessons to the whole family!</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;