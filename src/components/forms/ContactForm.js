'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, User, Mail, MessageSquare, FileText } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({
          submitted: true,
          success: true,
          message: 'Thank you! Your message has been sent successfully.'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      setStatus({
        submitted: true,
        success: false,
        message: error.message || 'An error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {status.submitted && (
        <div className={`p-6 mb-6 rounded-xl border ${
          status.success 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            {status.success ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            )}
            <p className="font-medium">{status.message}</p>
          </div>
          {status.success && (
            <p className="text-sm ml-9">We&#39;ll get back to you within 24-48 hours during business days.</p>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 md:py-4 pl-11 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900 placeholder-gray-500"
              placeholder="Your full name"
              required
            />
          </div>
        </div>
        
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 md:py-4 pl-11 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900 placeholder-gray-500"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>
        
        {/* Subject Field */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 md:py-4 pl-11 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900 placeholder-gray-500"
              placeholder="What is this regarding?"
              required
            />
          </div>
        </div>
        
        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <div className="relative">
            <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
              <MessageSquare className="w-5 h-5 text-gray-400 mt-1" />
            </div>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              className="w-full px-4 py-3 md:py-4 pl-11 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
              placeholder="Please provide details about your inquiry, including age of swimmer(s), any specific needs, preferred schedule, or any questions you have about our programs..."
              required
            ></textarea>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Include details like swimmer age, experience level, and scheduling preferences to help us provide the best recommendations.
          </p>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-pool-blue hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold px-8 py-3 md:py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Sending Message...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send Message</span>
            </>
          )}
        </button>
        
        {/* Privacy Note */}
        <p className="text-xs text-gray-500 text-center">
          Your information is secure and will only be used to respond to your inquiry. We respect your privacy and will never share your contact details.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;