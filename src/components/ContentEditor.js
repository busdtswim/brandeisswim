 'use client';

 import React, { useState, useEffect } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  X, 
  Save, 
  Trash2, 
  FileText, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import DOMPurify from 'dompurify';
import SimpleHtmlEditor from './SimpleHtmlEditor';

const ContentEditor = () => {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showMessage, setShowMessage] = useState(false);
  const [showNewSectionForm, setShowNewSectionForm] = useState(false);
  const [newSectionKey, setNewSectionKey] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  // Wrap fetchContent in useCallback
  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/admin/content');
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
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
      } else {
        displayMessage('Failed to load content', 'error');
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      displayMessage('Error loading content: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const displayMessage = (text, type) => {
    setMessage({ text, type });
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 5000);
  };

  const handleAddNewSection = async () => {
    if (!newSectionKey || !newSectionKey.trim()) {
      displayMessage('Please enter a section key', 'error');
      return;
    }

    const sectionKey = newSectionKey.toLowerCase().replace(/\s+/g, '_');
    
    try {
      // Sanitize the empty content as well (just to be safe)
      const sanitizedContent = DOMPurify.sanitize('', {
        FORBID_ATTR: ['onloadstart', 'onerror', 'onload', 'onmouseover', 'onclick'], 
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 
          'ul', 'ol', 'li', 'a', 'img', 'span', 'blockquote', 
          'pre', 'code', 'div'
        ]
      });

      const response = await fetch('/api/auth/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: sectionKey,
          title: newSectionTitle || newSectionKey,
          content: sanitizedContent,
          is_custom: true,
          order_num: Object.keys(sections).length
        }),
      });

      if (response.ok) {
        await fetchContent();
        setNewSectionKey('');
        setNewSectionTitle('');
        setShowNewSectionForm(false);
        displayMessage('New section added successfully!', 'success');
      } else {
        throw new Error('Failed to add new section');
      }
    } catch (error) {
      console.error('Error adding new section:', error);
      displayMessage('Failed to add new section: ' + error.message, 'error');
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
      // Sanitize content before reordering
      const sanitizedContent1 = DOMPurify.sanitize(sections[sectionKey].content, {
        FORBID_ATTR: ['onloadstart', 'onerror', 'onload', 'onmouseover', 'onclick'],
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 
          'ul', 'ol', 'li', 'a', 'img', 'span', 'blockquote', 
          'pre', 'code', 'div'
        ]
      });

      const sanitizedContent2 = DOMPurify.sanitize(sections[sectionToSwap[0]].content, {
        FORBID_ATTR: ['onloadstart', 'onerror', 'onload', 'onmouseover', 'onclick'],
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 
          'ul', 'ol', 'li', 'a', 'img', 'span', 'blockquote', 
          'pre', 'code', 'div'
        ]
      });

      await Promise.all([
        fetch('/api/auth/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section: sectionKey,
            title: sections[sectionKey].title,
            content: sanitizedContent1,
            order_num: newOrder
          })
        }),
        fetch('/api/auth/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section: sectionToSwap[0],
            title: sections[sectionToSwap[0]].title,
            content: sanitizedContent2,
            order_num: currentOrder
          })
        })
      ]);
  
      setSections(prev => ({
        ...prev,
        [sectionKey]: { ...prev[sectionKey], order_num: newOrder },
        [sectionToSwap[0]]: { ...prev[sectionToSwap[0]], order_num: currentOrder }
      }));
      displayMessage('Sections reordered successfully', 'success');
    } catch (error) {
      console.error('Error reordering sections:', error);
      displayMessage('Failed to reorder sections: ' + error.message, 'error');
    }
  };

  const handleDeleteSection = async (sectionKey) => {
    if (!sections[sectionKey].is_custom) {
      displayMessage('Cannot delete default sections', 'error');
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
          displayMessage('Section deleted successfully!', 'success');
        } else {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete section');
        }
      } catch (error) {
        console.error('Error deleting section:', error);
        displayMessage('Failed to delete section: ' + error.message, 'error');
      }
    }
  };

  const handleSubmit = async (section) => {
    try {
      // Sanitize content before submission to prevent XSS attacks
      const sanitizedContent = DOMPurify.sanitize(sections[section].content, {
        FORBID_ATTR: ['onloadstart', 'onerror', 'onload', 'onmouseover', 'onclick'],
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 
          'ul', 'ol', 'li', 'a', 'img', 'span', 'blockquote', 
          'pre', 'code', 'div'
        ]
      });

      const response = await fetch('/api/auth/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          title: sections[section].title,
          content: sanitizedContent,
          order_num: sections[section].order_num
        }),
      });

      if (response.ok) {
        displayMessage(`${sections[section].title} content updated successfully!`, 'success');
      } else {
        throw new Error('Failed to update content');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      displayMessage('Failed to update content: ' + error.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Homepage Content Editor</h1>
        <p className="text-gray-600">Edit, add, or remove content sections that appear on your homepage.</p>
      </div>

      {/* Notification message */}
      {showMessage && (
        <div className={`mb-6 p-4 rounded-lg flex items-start ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border-l-4 border-green-500' 
            : 'bg-red-50 text-red-800 border-l-4 border-red-500'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 mr-3 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 mr-3 mt-0.5" />
          )}
          <p>{message.text}</p>
        </div>
      )}
      
      {/* Add Section Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowNewSectionForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <Plus size={18} className="mr-2" /> Add New Section
        </button>
      </div>

      {/* New Section Form */}
      {showNewSectionForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Add New Section</h2>
            <button 
              onClick={() => {
                setShowNewSectionForm(false);
                setNewSectionKey('');
                setNewSectionTitle('');
              }}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section ID (internal use)
              </label>
              <input
                type="text"
                value={newSectionKey}
                onChange={(e) => setNewSectionKey(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. spring_schedule, important_info"
              />
              <p className="text-sm text-gray-500 mt-1">
                This is used internally as an identifier. No spaces or special characters.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section Title (displayed to users)
              </label>
              <input
                type="text"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Spring Schedule, Important Information"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleAddNewSection}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
              >
                <Save size={18} className="mr-2" /> Add Section
              </button>
              <button
                onClick={() => {
                  setShowNewSectionForm(false);
                  setNewSectionKey('');
                  setNewSectionTitle('');
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Content Sections */}
      {Object.entries(sections).length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-lg">No content sections found.</p>
          <p className="text-gray-500 mt-2">Click the &#34;Add New Section&#34; button to create your first section.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(sections)
            .sort(([,a], [,b]) => a.order_num - b.order_num)
            .map(([sectionKey, section]) => (
              <div key={sectionKey} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="flex flex-col border rounded p-1 mr-3">
                      <button
                        onClick={() => handleReorder(sectionKey, 'up')}
                        disabled={section.order_num === 0}
                        className={`p-1 rounded hover:bg-gray-100 ${
                          section.order_num === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'
                        }`}
                        title="Move up"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={() => handleReorder(sectionKey, 'down')}
                        disabled={section.order_num === Object.keys(sections).length - 1}
                        className={`p-1 rounded hover:bg-gray-100 ${
                          section.order_num === Object.keys(sections).length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'
                        }`}
                        title="Move down"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-blue-600" />
                        {section.title}
                      </h2>
                      <p className="text-sm text-gray-500">Section ID: {sectionKey}</p>
                    </div>
                  </div>
                  
                  {section.is_custom && (
                    <button
                      onClick={() => handleDeleteSection(sectionKey)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center"
                      title="Delete section"
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </button>
                  )}
                </div>
  
                <div className="p-6 space-y-4">
                  {/* Title Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => handleSectionChange(sectionKey, 'title', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter section title"
                    />
                  </div>
  
                  {/* Content Editor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <SimpleHtmlEditor
                      value={section.content}
                      onChange={(content) => handleSectionChange(sectionKey, 'content', content)}
                      placeholder="Enter your content here..."
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Click to edit content. Use the toolbar to format text, add links, and more.
                    </p>
                  </div>
  
                  {/* Update Button */}
                  <button
                    onClick={() => handleSubmit(sectionKey)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
                  >
                    <Save size={18} className="mr-2" /> Save Changes
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ContentEditor;