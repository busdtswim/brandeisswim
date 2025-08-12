'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Calendar, Save, AlertTriangle, Loader2 } from 'lucide-react';
import ExceptionDates from './ExceptionDates';

const EditExceptionsModal = ({ isOpen, onClose, lessonId, onUpdate }) => {
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchExceptions = useCallback(async () => {
    if (!lessonId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/auth/lessons/exceptions/${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        const sortedExceptions = data.sort((a, b) => new Date(a) - new Date(b));
        setExceptions(sortedExceptions);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch exceptions');
      }
    } catch (error) {
      console.error('Error fetching exceptions:', error);
      setError('Error loading exception dates. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [lessonId]); 

  useEffect(() => {
    if (isOpen && lessonId) {
      fetchExceptions();
    }
  }, [isOpen, lessonId, fetchExceptions]); 

  const handleAddException = (date) => {
    const updatedExceptions = [...exceptions, date].sort((a, b) => new Date(a) - new Date(b));
    setExceptions(updatedExceptions);
  };

  const handleRemoveException = (date) => {
    setExceptions(prev => prev.filter(d => d !== date));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');
      const sortedExceptions = [...exceptions].sort((a, b) => new Date(a) - new Date(b));
      
      const response = await fetch(`/api/auth/lessons/exceptions/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ exception_dates: sortedExceptions })
      });

      if (response.ok) {
        const updatedLesson = await response.json();
        onUpdate(updatedLesson);
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update exceptions');
      }
    } catch (error) {
      console.error('Error updating exceptions:', error);
      setError(error.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Edit Exception Dates
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-100 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-5">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <p>{error}</p>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                Add dates when classes will not be held. These dates will be excluded from the lesson schedule.
              </p>
              
              <ExceptionDates
                exceptions={exceptions}
                onAdd={handleAddException}
                onRemove={handleRemoveException}
              />
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-5 py-4 flex justify-end space-x-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || isSaving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditExceptionsModal;