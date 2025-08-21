// src/components/Footer.js
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Instagram, ArrowUpRight, Heart, Shield, Users } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-brandeis-blue to-gray-900 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pool-blue/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 md:py-20 lg:py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              
              {/* Column 1 - Brand */}
              <div className="lg:col-span-2">
                <div className="flex items-center mb-6">
                  <div>
                    <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                      Brandeis Swim
                    </span>
                    <p className="text-sm text-white/70 font-medium">Professional Instruction</p>
                  </div>
                </div>
                
                <p className="text-white/80 mb-8 leading-relaxed text-lg max-w-lg">
                  Providing professional swim instruction in a safe and supportive environment 
                  for swimmers of all ages and abilities. Join our community and discover the joy of swimming.
                </p>
                
                {/* Key Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-8 h-8 bg-gradient-to-r from-pool-blue to-cyan-300 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Safety First</p>
                      <p className="text-xs text-white/70">1:1 Instruction</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-8 h-8 bg-gradient-to-r from-brandeis-blue to-pool-blue rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">All Ages</p>
                      <p className="text-xs text-white/70">1+ years old</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-300 to-pool-blue rounded-lg flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Caring</p>
                      <p className="text-xs text-white/70">Expert Team</p>
                    </div>
                  </div>
                </div>
                
                {/* Social Media */}
                <div className="flex items-center gap-4">
                  <span className="text-white/70 font-medium">Follow us:</span>
                  <a 
                    href="https://www.instagram.com/brandeisswimanddive" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all duration-200 hover:shadow-lg group"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  </a>
                </div>
              </div>
              
              {/* Column 2 - Quick Links */}
              <div>
                <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
                <ul className="space-y-4">
                  {[
                    { href: '/', label: 'Home' },
                    { href: '/lessons', label: 'Swim Lessons' },
                    { href: '/register', label: 'Join Us' },
                    { href: '/contact', label: 'Contact Us' },
                    { href: '/login', label: 'Sign In' }
                  ].map((link) => (
                    <li key={link.href}>
                      <Link 
                        href={link.href} 
                        className="group flex items-center text-white/80 hover:text-white transition-all duration-200 hover:translate-x-1"
                      >
                        <ArrowUpRight className="w-4 h-4 mr-2 text-pool-blue group-hover:text-cyan-300 transition-colors duration-200" />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Column 3 - Contact Info */}
              <div>
                <h3 className="text-xl font-bold mb-6 text-white">Get In Touch</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-pool-blue to-brandeis-blue rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white mb-1">Visit Us</p>
                      <p className="text-white/80 text-sm leading-relaxed">
                        Joseph M. Linsey Sports Center<br />
                        Brandeis University<br />
                        Waltham, MA 02453
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-brandeis-blue to-pool-blue rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white mb-1">Email Us</p>
                      <a 
                        href="mailto:busdtswimlessons@brandeis.edu" 
                        className="text-cyan-300 hover:text-white transition-colors duration-200 text-sm font-medium hover:underline"
                      >
                        busdtswimlessons@brandeis.edu
                      </a>
                      <p className="text-white/60 text-xs mt-1">We respond within 24-48 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-white/10"></div>
        
        {/* Bottom Bar */}
        <div className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <p className="text-white/70 text-sm">
                  &copy; {currentYear} Brandeis Swimming Lessons. All rights reserved.
                </p>
                <div className="flex items-center gap-1 text-white/70 text-sm">
                  <span>Made with</span>
                  <Heart className="w-4 h-4 text-red-400 fill-current" />
                  <span>for swimmers</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <Link 
                  href="/privacy-policy" 
                  className="text-white/70 hover:text-white text-sm transition-colors duration-200 hover:underline"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms-of-service" 
                  className="text-white/70 hover:text-white text-sm transition-colors duration-200 hover:underline"
                >
                  Terms of Service
                </Link>
                <div className="hidden sm:block h-4 w-px bg-white/20"></div>
                <Link 
                  href="/contact" 
                  className="text-sm font-medium text-cyan-300 hover:text-white transition-colors duration-200 flex items-center gap-1"
                >
                  <span>Questions?</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;