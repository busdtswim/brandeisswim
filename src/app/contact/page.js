'use client';

import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contact Hero Section */}
      <section className="pt-20 pb-12 md:pt-28 md:pb-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-lg text-blue-100 mb-0">
              Have questions about our swim lessons? We&#39;re here to help!
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
                  Contact Information
                </h2>
                <p className="text-gray-600 mb-8">
                  Whether you&#39;re looking to enroll in swimming lessons, have questions about our programs, 
                  or need more information, we&#39;re here to assist you. Feel free to reach out using any of 
                  the methods below.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-3 mr-4">
                      <MapPin className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-gray-900">Our Location</h3>
                      <p className="text-gray-600">
                        Joseph M. Linsey Sports Center<br />
                        Waltham, MA 02453
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-3 mr-4">
                      <Mail className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-gray-900">Email Us</h3>
                      <a 
                        href="mailto:busdtswimlessons@brandeis.edu" 
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        busdtswimlessons@brandeis.edu
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
                  Send Us a Message
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 text-center">
              Find Us
            </h2>
            <div className="rounded-xl overflow-hidden shadow-lg h-[400px] relative">
              <iframe
                width="100%"
                height="400"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=Joseph+M.+Linsey+Sports+Center,Brandeis+University,Waltham+MA`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with shadcn/UI Accordion */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Find answers to our most commonly asked questions. If you can&#39;t find what you&#39;re looking for, 
              please don&#39;t hesitate to contact us.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-2" className="bg-white rounded-lg shadow-sm border border-gray-100">
                <AccordionTrigger className="px-6 py-4 text-xl font-bold text-gray-900 hover:no-underline">
                  What age groups and abilities do you cater to?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                  Brandeis Swim team members work with all ages and ability from 1 years of age to adult.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white rounded-lg shadow-sm border border-gray-100">
                <AccordionTrigger className="px-6 py-4 text-xl font-bold text-gray-900 hover:no-underline">
                  What are the qualifications of your instructors?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                  Our instructors have over 10 years of swimming experience, and most teach at their home pools over the summer and throughout high school. Regardless of experience first-year swimmers are introduced to our &#34;Safety First&#34; method of teaching lessons that includes body awareness, breathing and stroke development.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-white rounded-lg shadow-sm border border-gray-100">
                <AccordionTrigger className="px-6 py-4 text-xl font-bold text-gray-900 hover:no-underline">
                  What is the instructor to student ratio?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                  Our lessons are a 1:1 ratio, occasionally we will partner up a newer instructor with an experienced one to make sure child has fun while also learning. We also try to group friends together as well.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-white rounded-lg shadow-sm border border-gray-100">
                <AccordionTrigger className="px-6 py-4 text-xl font-bold text-gray-900 hover:no-underline">
                  What is the structure of the lesson?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                  <p>Our first lesson is about gaining confidence and getting and understanding of your child&#39;s ability and needs. From there your instructor will develop body position awareness (floating), breathing (comfortability of face in the water), phases of forward movement (freestyle) and then from there all safety and stroke developmental.</p>
                  <p className="mt-2">The goal for all beginner swimmers is to be comfortable with their face in the water, floating, and able to safely get themselves out of the pool. More experienced swimmers will develop freestyle, higher level safety skills such as treading water and then the remaining swimming strokes. The last few minutes of class will always be saved for fun!</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-white rounded-lg shadow-sm border border-gray-100">
                <AccordionTrigger className="px-6 py-4 text-xl font-bold text-gray-900 hover:no-underline">
                  How do you assess and track progress?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Our instructors keep notes and will share progress with parents every lesson.</li>
                    <li>All instructors are provided with guidelines and target areas of improvement that can also be shared with parents upon request.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7" className="bg-white rounded-lg shadow-sm border border-gray-100">
                <AccordionTrigger className="px-6 py-4 text-xl font-bold text-gray-900 hover:no-underline">
                  What safety measures are in place?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                  Our 1:1 ratio provides our instructors with full attention to your swimmer. We also have the deck monitored to make sure young swimmers are being respectful of the water. We do expect parents to maintain 100% contact with their children while waiting for their lesson to start.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-8" className="bg-white rounded-lg shadow-sm border border-gray-100">
                <AccordionTrigger className="px-6 py-4 text-xl font-bold text-gray-900 hover:no-underline">
                  What should my child bring to swim lessons?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Children who are not potty trained should be DOUBLE SWIM DIAPERS. If there is a fecal incident the pool must be shut down for 24 hours which will impact the entire lesson program. Please make sure to have your swimmer use the bathroom beforehand and double up. Non disposable diapers are preferred.</li>
                    <li>Male, Female and Family Locker rooms are provided.</li>
                    <li>A towel and a change of clothes. The pool is kept at a competitive swimming temperature of 83 degrees, so it can get chilly for the little ones.</li>
                    <li>If your child has long hair, please tie up in ponytails or braids, it can be very uncomfortable to have hair in their face while trying to learn to breath.</li>
                    <li>Goggles and fun toys are welcome however we will work with your child to not have a dependency on goggles as a safety precaution.</li>
                    <li>We do not teach with floatation devices; the goal is for your child to be able to save themselves in an emergency.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-9" className="bg-white rounded-lg shadow-sm border border-gray-100">
                <AccordionTrigger className="px-6 py-4 text-xl font-bold text-gray-900 hover:no-underline">
                  Are parents allowed to watch lessons?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Parents are welcome to sit on the benches provided. Please know that if your young swimmer has any type of nervousness, sometimes it does help for the parent to not be on deck in their view but this will be handled on a case-by-case basis. We also have the stands open for any parents to sit and view.</li>
                    <li>Parents of children under 3 should expect to get in the water with their child. Developmentally young swimmers often need the security of their parent. As they become more confident the parent may be able to sit on the side. You know your child best.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-10" className="bg-white rounded-lg shadow-sm border border-gray-100">
                <AccordionTrigger className="px-6 py-4 text-xl font-bold text-gray-900 hover:no-underline">
                  What is the policy for missed lessons?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                  We will have one make-up lesson at the end of the session. The instructor and time are not guaranteed and we will discuss towards the end. No refunds are given for any missed lessons. All payments are final.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-11" className="bg-white rounded-lg shadow-sm border border-gray-100">
                <AccordionTrigger className="px-6 py-4 text-xl font-bold text-gray-900 hover:no-underline">
                  How do you handle children with special needs?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                  Our instructors have a variety of abilities and skills. If your child has special needs please communicate that before your lesson so we are able to provide the safest and best experience possible. We may not be able to meet all requests but will try.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-12" className="bg-white rounded-lg shadow-sm border border-gray-100">
                <AccordionTrigger className="px-6 py-4 text-xl font-bold text-gray-900 hover:no-underline">
                  How can parents support their child&#39;s learning?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                  <p>Learning how to swim is a life skill that we are proud to provide. Drowning is the number one cause of death for children 1-6. A parent&#39;s role is to always make sure they are watching their child in an aquatic setting. Just because a child has swim lessons does not mean they are water safe; no one is ever water safe not even our elite-level college swimmers. Our goal is to teach parents and swimmers a healthy respect for the water and skills to develop throughout life.</p>
                  <p className="mt-2">Parents may need to sit on the edge with their swimmer or even be out of view so the young swimmer isn&#39;t distracted but this will be discussed with your instructor and management.</p>
                  <p className="mt-2">Any parents that also want to learn to swim, please speak to the managers. Our goal is safety for everyone, and we would be happy to provide lessons to the whole family!</p>
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