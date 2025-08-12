'use client';

import React, { useState, useEffect } from 'react';

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
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-12 animate-pulse">
            {/* Image skeleton */}
            <div className="md:w-2/5 h-[400px] rounded-2xl bg-gray-200"></div>
            
            {/* Content skeleton */}
            <div className="md:w-3/5 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-1 w-10 bg-gray-300"></div>
                <div className="h-6 bg-gray-300 rounded w-32"></div>
              </div>
              <div className="h-10 bg-gray-300 rounded w-3/4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
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
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row gap-12">

          {/* Left image column */}
          <div className="md:w-4/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-10 bg-blue-600"></div>
              <h2 className="text-blue-600 font-semibold text-lg capitalize">
                {content.section?.replace(/_/g, ' ') || 'About Us'}
              </h2>
            </div>            
            <div 
              className="prose prose-lg prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}