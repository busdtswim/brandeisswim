// src/app/privacy-policy/page.js

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-8 prose max-w-none">
          <h1 className="text-3xl font-bold mb-6 text-[#003478]">Privacy Policy</h1>
          
          <p className="text-gray-600 mb-6">Last Updated: March 15, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#003478]">1. Introduction</h2>
            <p>
              Welcome to Brandeis Swim Lessons. We respect your privacy and are committed to 
              protecting your personal data. This Privacy Policy explains how we collect, use, 
              disclose, and safeguard your information when you use our website and services.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#003478]">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-[#003478]">2.1 Personal Information</h3>
            <p>We may collect the following personal information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Account Information</strong>: Name, email address, password, phone number</li>
              <li><strong>Swimmer Information</strong>: Name, age, gender, birth date, proficiency level</li>
              <li><strong>Communications</strong>: Emails, messages sent through our contact form</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-3 text-[#003478]">2.2 How We Collect Information</h3>
            <p>We collect information when you:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Create an account</li>
              <li>Register for swim lessons</li>
              <li>Contact us</li>
              <li>Use our website</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#003478]">3. How We Use Your Information</h2>
            <p>We use your personal information to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide and manage swimming lessons</li>
              <li>Communicate with you about your lessons, schedule changes, and important updates</li>
              <li>Match swimmers with appropriate instructors</li>
              <li>Improve our services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#003478]">4. Disclosure of Your Information</h2>
            <p>We may share your personal information with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Instructors</strong>: To facilitate lesson planning and instruction</li>
              <li><strong>Service Providers</strong>: Third parties who help operate our website and services</li>
              <li><strong>Legal Requirements</strong>: When required by law or to protect our rights</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#003478]">5. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. 
              However, no method of transmission over the Internet or electronic storage 
              is 100% secure.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#003478]">6. Your Privacy Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal 
              information, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
            </ul>
            <p>To exercise these rights, please contact us using the details below.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#003478]">7. Children&#39;s Privacy</h2>
            <p>
              Our services are intended for families with children taking swimming lessons. 
              We collect information about children only with parental consent and use it 
              solely for providing swimming instruction.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#003478]">8. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The updated version will be 
              indicated by an updated &#34;Last Updated&#34; date.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#003478]">9. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at:</p>
            <p><strong>Email</strong>: busdtswimlessons@brandeis.edu</p>
            <p><strong>Address</strong>: Joseph M. Linsey Sports Center, Waltham, MA 02453</p>
          </section>
        </div>
      </div>
    </div>
  );
}