// src/components/ContentEditor.js
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

import 'react-quill/dist/quill.snow.css';

const ContentEditor = () => {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showNewSectionForm, setShowNewSectionForm] = useState(false);
  const [newSectionKey, setNewSectionKey] = useState('');

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/auth/admin/content');
      if (response.ok) {
        const data = await response.json();
        const sectionsData = data.reduce((acc, item) => {
          acc[item.section] = {
            title: item.title,
            content: item.content,
            is_custom: item.is_custom,
            order_num: item.order_num
          };
          return acc;
        }, {});
        setSections(sectionsData);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setMessage('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewSection = async () => {
    if (!newSectionKey || !newSectionKey.trim()) {
      setMessage('Please enter a section key');
      return;
    }

    const sectionKey = newSectionKey.toLowerCase().replace(/\s+/g, '_');
    
    try {
      const response = await fetch('/api/auth/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: sectionKey,
          title: newSectionKey,
          content: '',
          is_custom: true,
          order_num: Object.keys(sections).length
        }),
      });

      if (response.ok) {
        await fetchContent();
        setNewSectionKey('');
        setShowNewSectionForm(false);
        setMessage('New section added successfully!');
      } else {
        throw new Error('Failed to add new section');
      }
    } catch (error) {
      console.error('Error adding new section:', error);
      setMessage('Failed to add new section');
    }
  };

  const handleSectionChange = (section, field, value) => {
    setSections(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleReorder = async (sectionKey, direction) => {
    const currentOrder = sections[sectionKey].order_num;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    const sectionToSwap = Object.entries(sections).find(
      ([_, section]) => section.order_num === newOrder
    );
  
    if (!sectionToSwap) return;
  
    try {
      await Promise.all([
        fetch('/api/auth/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section: sectionKey,
            title: sections[sectionKey].title,
            content: sections[sectionKey].content,
            order_num: newOrder
          })
        }),
        fetch('/api/auth/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section: sectionToSwap[0],
            title: sections[sectionToSwap[0]].title,
            content: sections[sectionToSwap[0]].content,
            order_num: currentOrder
          })
        })
      ]);
  
      setSections(prev => ({
        ...prev,
        [sectionKey]: { ...prev[sectionKey], order_num: newOrder },
        [sectionToSwap[0]]: { ...prev[sectionToSwap[0]], order_num: currentOrder }
      }));
    } catch (error) {
      console.error('Error reordering sections:', error);
      setMessage('Failed to reorder sections');
    }
  };

  const handleDeleteSection = async (sectionKey) => {
    if (!sections[sectionKey].is_custom) {
      setMessage('Cannot delete default sections');
      return;
    }
  
    if (confirm('Are you sure you want to delete this section?')) {
      try {
        const response = await fetch(`/api/auth/admin/content/${sectionKey}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          const newSections = { ...sections };
          delete newSections[sectionKey];
          setSections(newSections);
          setMessage('Section deleted successfully!');
        } else {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete section');
        }
      } catch (error) {
        console.error('Error deleting section:', error);
        setMessage(error.message || 'Failed to delete section');
      }
    }
  };

  const handleSubmit = async (section) => {
    try {
      const response = await fetch('/api/auth/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          title: sections[section].title,
          content: sections[section].content,
          order_num: sections[section].order_num
        }),
      });

      if (response.ok) {
        setMessage(`${section} content updated successfully!`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Failed to update content');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      setMessage('Failed to update content');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-8">Edit Homepage Content</h1>
      
      {message && (
        <div className={`mb-4 p-4 rounded ${
          message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <button
        onClick={() => setShowNewSectionForm(true)}
        className="mb-8 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add New Section
      </button>

      {showNewSectionForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Add New Section</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Section Name
            </label>
            <input
              type="text"
              value={newSectionKey}
              onChange={(e) => setNewSectionKey(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter section name"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleAddNewSection}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Section
            </button>
            <button
              onClick={() => {
                setShowNewSectionForm(false);
                setNewSectionKey('');
              }}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
  
    {Object.entries(sections)
        .sort(([,a], [,b]) => a.order_num - b.order_num)
        .map(([sectionKey, section], index, array) => (
        <div key={sectionKey} className="mb-8 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
                <div className="flex flex-col">
                <button
                    onClick={() => handleReorder(sectionKey, 'up')}
                    disabled={index === 0}
                    className={`p-1 rounded hover:bg-gray-100 ${index === 0 ? 'text-gray-300' : 'text-gray-600'}`}
                >
                    <ChevronUp size={20} />
                </button>
                <button
                    onClick={() => handleReorder(sectionKey, 'down')}
                    disabled={index === array.length - 1}
                    className={`p-1 rounded hover:bg-gray-100 ${index === array.length - 1 ? 'text-gray-300' : 'text-gray-600'}`}
                >
                    <ChevronDown size={20} />
                </button>
                </div>
                <h2 className="text-2xl font-bold capitalize">{sectionKey.replace('_', ' ')}</h2>
            </div>
            {section.is_custom && (
                <button
                onClick={() => handleDeleteSection(sectionKey)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                Delete Section
                </button>
            )}
            </div>

            {/* Rest of your section content */}
            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
                Title
            </label>
            <input
                type="text"
                value={section.title}
                onChange={(e) => handleSectionChange(sectionKey, 'title', e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            </div>

            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
                Content
            </label>
            <div className="mb-4">
                <ReactQuill
                theme="snow"
                value={section.content}
                onChange={(content) => handleSectionChange(sectionKey, 'content', content)}
                modules={modules}
                className="h-64 mb-12"
                style={{ fontSize: '14px', lineHeight: '1.4' }}
                />
            </div>
            </div>

            <button
            onClick={() => handleSubmit(sectionKey)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
            Update {section.title}
            </button>
        </div>
        ))}
    </div>
  );
};

export default ContentEditor;