// src/app/contact/page.js
'use client';

import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contact Hero Section */}
      <section className="pt-20 pb-12 md:pt-28 md:pb-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-lg text-blue-100 mb-0">
              Have questions about our swim lessons? We're here to help!
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
                  Whether you're looking to enroll in swimming lessons, have questions about our programs, 
                  or need more information, we're here to assist you. Feel free to reach out using any of 
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
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-3 mr-4">
                      <Phone className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-gray-900">Call Us</h3>
                      <p className="text-gray-600">(781) 555-1234</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Monday-Friday: 9:00 AM - 5:00 PM<br />
                        Saturday: 9:00 AM - 1:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Office Hours</h3>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Monday-Friday</h4>
                        <p className="text-gray-600">9:00 AM - 5:00 PM</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Saturday</h4>
                        <p className="text-gray-600">9:00 AM - 1:00 PM</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Sunday</h4>
                        <p className="text-gray-600">Closed</p>
                      </div>
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
              {/* Replace this with an actual Google Maps iframe or integration */}
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-600">Map placeholder - Add your Google Maps embed here</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Find answers to our most commonly asked questions. If you can't find what you're looking for, 
              please don't hesitate to contact us.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {/* FAQ Item 1 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900">What ages do you offer lessons for?</h3>
                <p className="text-gray-600">
                  We offer swimming lessons for all ages, from toddlers (starting at age 3) to adults. 
                  Our programs are tailored to meet the needs of different age groups and skill levels.
                </p>
              </div>
              
              {/* FAQ Item 2 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900">How long are the swimming lessons?</h3>
                <p className="text-gray-600">
                  Our standard lessons are 30 minutes for beginners and 45 minutes for intermediate and 
                  advanced swimmers. Most lessons run in 8-week sessions, meeting once or twice per week.
                </p>
              </div>
              
              {/* FAQ Item 3 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900">What should my child bring to lessons?</h3>
                <p className="text-gray-600">
                  Swimmers should bring a swimsuit, towel, and goggles (optional for beginners, 
                  recommended for intermediate and advanced). Swim caps are recommended but not required.
                </p>
              </div>
              
              {/* FAQ Item 4 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900">How do I register for lessons?</h3>
                <p className="text-gray-600">
                  Registration can be done online through our website. Simply create an account, 
                  select your preferred class time, and complete the payment process. 
                  You can also register in person at our facility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;