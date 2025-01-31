// src/components/EditExceptionsModal.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ExceptionDates from './ExceptionDates';

const EditExceptionsModal = ({ isOpen, onClose, lessonId, onUpdate }) => {
  const [exceptions, setExceptions] = useState([]);

  const fetchExceptions = useCallback(async () => {
    if (!lessonId) return;

    try {
      const response = await fetch(`/api/auth/lessons/exceptions/${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        const sortedExceptions = data.sort((a, b) => new Date(a) - new Date(b));
        setExceptions(sortedExceptions);
      }
    } catch (error) {
      console.error('Error fetching exceptions:', error);
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
      }
    } catch (error) {
      console.error('Error updating exceptions:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Edit Exception Dates</h2>
        
        <ExceptionDates
          exceptions={exceptions}
          onAdd={handleAddException}
          onRemove={handleRemoveException}
        />

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditExceptionsModal;