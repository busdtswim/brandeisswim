// src/app/terms-of-service/page.js

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Users, CreditCard, AlertTriangle, Shield, Scale, Clock } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white hover:text-brandeis-blue transition-all duration-200 shadow-lg hover:shadow-xl border border-white/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>

      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-brandeis-blue to-pool-blue text-white overflow-hidden pt-20 pb-16">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <Scale className="w-8 h-8 text-cyan-300" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Terms of <span className="text-cyan-300">Service</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            Understanding our service terms and your responsibilities as a participant in our swim program.
          </p>
          <p className="text-white/70 mt-4 font-medium">Last Updated: March 15, 2025</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-20 lg:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Introduction */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl md:rounded-3xl p-6 md:p-8 mb-12 border border-blue-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pool-blue to-brandeis-blue text-white rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed">
                  Welcome to Brandeis Swim Lessons. These Terms of Service (&#34;Terms&#34;) govern your 
                  use of our website and services. By accessing or using our services, you agree 
                  to be bound by these Terms.
                </p>
              </div>
            </div>
          </div>
          
          {/* Services */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl md:rounded-3xl p-6 md:p-8 mb-12 border border-cyan-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pool-blue to-brandeis-blue text-white rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">2. Services</h2>
            </div>
            
            <div className="ml-16">
              <p className="text-gray-700 mb-4">
                Brandeis Swim Lessons provides swimming instruction services to individuals of all 
                ages and skill levels. Our services include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Individual swimming lessons</li>
                <li>Group swimming classes</li>
                <li>Specialized instruction for different skill levels</li>
                <li>Water safety education</li>
                <li>Stroke technique improvement</li>
              </ul>
            </div>
          </div>
          
          {/* Registration and Payment */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl md:rounded-3xl p-6 md:p-8 mb-12 border border-purple-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pool-blue to-brandeis-blue text-white rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">3. Registration and Payment</h2>
            </div>
            
            <div className="ml-16 space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">3.1 Registration</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>You must create an account to register for lessons</li>
                  <li>All information provided must be accurate and current</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>Registration is subject to availability and approval</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">3.2 Payment Terms</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Payment is required at the time of registration</li>
                  <li>We accept major credit cards and electronic payments</li>
                  <li>Prices are subject to change with notice</li>
                  <li>Payments are processed securely through third-party providers</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">3.3 Refund Policy</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>All payments are final - no refunds for missed lessons</li>
                  <li>One make-up lesson may be provided at the end of the session</li>
                  <li>Make-up lessons are subject to instructor and time availability</li>
                  <li>Refunds may be considered for medical emergencies with documentation</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Safety and Liability */}
          <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-2xl md:rounded-3xl p-6 md:p-8 mb-12 border border-orange-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pool-blue to-brandeis-blue text-white rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">4. Safety and Liability</h2>
            </div>
            
            <div className="ml-16 space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">4.1 Assumption of Risk</h3>
                <p className="text-gray-700 mb-4">
                  Swimming involves inherent risks. By participating, you acknowledge and assume these risks. 
                  We maintain safety protocols, but cannot guarantee complete safety.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">4.2 Medical Clearance</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Participants should be in good health for swimming activities</li>
                  <li>Disclose any medical conditions that may affect participation</li>
                  <li>Obtain medical clearance if you have health concerns</li>
                  <li>Inform instructors of any changes to health status</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">4.3 Supervision</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Parents must maintain 100% supervision of children before and after lessons</li>
                  <li>Children under 3 may require parent participation in water</li>
                  <li>Follow all facility rules and instructor guidance</li>
                  <li>Immediately report any incidents or concerns</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Conduct and Behavior */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl md:rounded-3xl p-6 md:p-8 mb-12 border border-green-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pool-blue to-brandeis-blue text-white rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">5. Conduct and Behavior</h2>
            </div>
            
            <div className="ml-16">
              <p className="text-gray-700 mb-4">All participants and their families must:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Treat instructors, staff, and other participants with respect</li>
                <li>Follow all safety rules and facility guidelines</li>
                <li>Arrive on time and prepared for lessons</li>
                <li>Notify us promptly of any schedule changes or concerns</li>
                <li>Maintain appropriate swimwear and hygiene standards</li>
                <li>Use bathroom facilities before lessons (especially important for young children)</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Disruptive behavior may result in lesson termination without refund.
              </p>
            </div>
          </div>
          
          {/* Scheduling and Cancellation */}
          <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl md:rounded-3xl p-6 md:p-8 mb-12 border border-pink-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pool-blue to-brandeis-blue text-white rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">6. Scheduling and Cancellation</h2>
            </div>
            
            <div className="ml-16 space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">6.1 Lesson Scheduling</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Lessons are scheduled based on availability</li>
                  <li>We will attempt to accommodate scheduling preferences</li>
                  <li>Schedule changes may be necessary due to instructor availability</li>
                  <li>We will provide advance notice of any schedule changes</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">6.2 Cancellation by Participants</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>No refunds for missed lessons</li>
                  <li>One make-up lesson available at end of session (subject to availability)</li>
                  <li>Advance notice of absence is appreciated but not required for make-up eligibility</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">6.3 Cancellation by Program</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>We may cancel lessons due to weather, facility issues, or safety concerns</li>
                  <li>Cancelled lessons will be rescheduled when possible</li>
                  <li>Refunds may be provided for lessons we cannot reschedule</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-indigo-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pool-blue to-brandeis-blue text-white rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Contact Us</h2>
            </div>
            
            <div className="ml-16">
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> busdtswimlessons@brandeis.edu</p>
                <p><strong>Address:</strong> Joseph M. Linsey Sports Center, Brandeis University, Waltham, MA 02453</p>
              </div>
              <p className="text-gray-700 mt-4">
                These Terms may be updated periodically. Continued use of our services constitutes acceptance of any changes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}