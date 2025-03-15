// src/components/ContentEditor.js
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Plus, X, Save, Trash2 } from 'lucide-react';
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
  const [newSectionTitle, setNewSectionTitle] = useState('');

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
      setLoading(true);
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
      setMessage({
        text: 'Failed to load content',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewSection = async () => {
    if (!newSectionKey || !newSectionKey.trim()) {
      setMessage({
        text: 'Please enter a section key',
        type: 'error'
      });
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
          title: newSectionTitle || newSectionKey,
          content: '',
          is_custom: true,
          order_num: Object.keys(sections).length
        }),
      });

      if (response.ok) {
        await fetchContent();
        setNewSectionKey('');
        setNewSectionTitle('');
        setShowNewSectionForm(false);
        setMessage({
          text: 'New section added successfully!',
          type: 'success'
        });
        
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Failed to add new section');
      }
    } catch (error) {
      console.error('Error adding new section:', error);
      setMessage({
        text: 'Failed to add new section',
        type: 'error'
      });
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
      setMessage({
        text: 'Failed to reorder sections',
        type: 'error'
      });
    }
  };

  const handleDeleteSection = async (sectionKey) => {
    if (!sections[sectionKey].is_custom) {
      setMessage({
        text: 'Cannot delete default sections',
        type: 'error'
      });
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
          setMessage({
            text: 'Section deleted successfully!',
            type: 'success'
          });
          
          setTimeout(() => setMessage(''), 3000);
        } else {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete section');
        }
      } catch (error) {
        console.error('Error deleting section:', error);
        setMessage({
          text: error.message || 'Failed to delete section',
          type: 'error'
        });
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
        setMessage({
          text: `${section} content updated successfully!`,
          type: 'success'
        });
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Failed to update content');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      setMessage({
        text: 'Failed to update content',
        type: 'error'
      });
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">Homepage Content Editor</h1>
        <p className="text-gray-600 mb-6">
          Edit, add, or remove content sections that appear on your homepage. Changes will be visible to visitors immediately.
        </p>
        
        {message && (
          <div className={`mb-6 p-4 rounded-lg transition-all duration-300 ${
            message.type === 'success' ? 'bg-green-100 text-green-700 border-l-4 border-green-500' : 
            'bg-red-100 text-red-700 border-l-4 border-red-500'
          }`}>
            {message.text}
          </div>
        )}

        <button
          onClick={() => setShowNewSectionForm(true)}
          className="mb-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center"
        >
          <Plus size={18} className="mr-2" /> Add New Section
        </button>
      </div>

      {showNewSectionForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Add New Section</h2>
            <button 
              onClick={() => {
                setShowNewSectionForm(false);
                setNewSectionKey('');
                setNewSectionTitle('');
              }}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Section ID (internal use)
            </label>
            <input
              type="text"
              value={newSectionKey}
              onChange={(e) => setNewSectionKey(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. spring_schedule, important_info"
            />
            <p className="text-sm text-gray-500 mt-1">
              This is used internally as an identifier. No spaces or special characters.
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Section Title (displayed to users)
            </label>
            <input
              type="text"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Spring Schedule, Important Information"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleAddNewSection}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center"
            >
              <Save size={18} className="mr-2" /> Add Section
            </button>
            <button
              onClick={() => {
                setShowNewSectionForm(false);
                setNewSectionKey('');
                setNewSectionTitle('');
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
  
      {Object.entries(sections)
        .sort(([,a], [,b]) => a.order_num - b.order_num)
        .map(([sectionKey, section], index, array) => (
        <div key={sectionKey} className="mb-8 bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col border rounded p-1">
                <button
                  onClick={() => handleReorder(sectionKey, 'up')}
                  disabled={index === 0}
                  className={`p-1 rounded hover:bg-gray-100 ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'}`}
                  title="Move up"
                >
                  <ChevronUp size={20} />
                </button>
                <button
                  onClick={() => handleReorder(sectionKey, 'down')}
                  disabled={index === array.length - 1}
                  className={`p-1 rounded hover:bg-gray-100 ${index === array.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'}`}
                  title="Move down"
                >
                  <ChevronDown size={20} />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{section.title}</h2>
                <p className="text-gray-500 text-sm">Section ID: {sectionKey}</p>
              </div>
            </div>
            
            {section.is_custom && (
              <button
                onClick={() => handleDeleteSection(sectionKey)}
                className="bg-red-100 text-red-600 hover:bg-red-200 font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
                title="Delete section"
              >
                <Trash2 size={18} className="mr-2" /> Delete
              </button>
            )}
          </div>

          {/* Title Field */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={section.title}
              onChange={(e) => handleSectionChange(sectionKey, 'title', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter section title"
            />
          </div>

          {/* Content Editor */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Content
            </label>
            <div className="border rounded">
              <ReactQuill
                theme="snow"
                value={section.content}
                onChange={(content) => handleSectionChange(sectionKey, 'content', content)}
                modules={modules}
                className="h-64 mb-12"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Use the toolbar above to format text, add links, and more.
            </p>
          </div>

          {/* Update Button */}
          <button
            onClick={() => handleSubmit(sectionKey)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center"
          >
            <Save size={18} className="mr-2" /> Save Changes
          </button>
        </div>
      ))}
    </div>
  );
};

export default ContentEditor;