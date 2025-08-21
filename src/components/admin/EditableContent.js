'use client';

import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

export default function EditableContent() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setContent(data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8 lg:p-12 animate-pulse">
              {/* Header skeleton */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0"></div>
                <div className="space-y-2 min-w-0">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
                  <div className="h-5 sm:h-6 bg-gray-300 rounded w-32 sm:w-40"></div>
                </div>
              </div>
              
              {/* Content skeleton */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden card-hover">
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            {/* Modern Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 md:mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-pool-blue to-brandeis-blue rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-pool-blue uppercase tracking-wider">
                  Latest Updates
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 capitalize leading-tight">
                  {content.section?.replace(/_/g, ' ') || 'Program Information'}
                </h2>
              </div>
            </div>
            
            {/* Content with Modern Typography */}
            <div 
              className="admin-content prose prose-base sm:prose-lg prose-gray max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold prose-headings:leading-tight
                prose-h1:text-xl prose-h1:sm:text-2xl prose-h1:md:text-3xl prose-h1:mb-4 prose-h1:sm:mb-6
                prose-h2:text-lg prose-h2:sm:text-xl prose-h2:md:text-2xl prose-h2:mb-3 prose-h2:sm:mb-4 prose-h2:text-brandeis-blue
                prose-h3:text-base prose-h3:sm:text-lg prose-h3:md:text-xl prose-h3:mb-2 prose-h3:sm:mb-3
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-3 prose-p:sm:mb-4 prose-p:text-sm prose-p:sm:text-base
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-a:text-pool-blue prose-a:font-medium prose-a:no-underline hover:prose-a:text-brandeis-blue hover:prose-a:underline prose-a:break-words
                prose-blockquote:border-l-4 prose-blockquote:border-pool-blue prose-blockquote:bg-blue-50 prose-blockquote:pl-4 prose-blockquote:sm:pl-6 prose-blockquote:py-3 prose-blockquote:sm:py-4 prose-blockquote:rounded-r-xl prose-blockquote:my-4 prose-blockquote:sm:my-6
                prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}