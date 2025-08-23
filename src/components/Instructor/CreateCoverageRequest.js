'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertTriangle } from 'lucide-react';
import { formatLessonInfo, formatMeetingDays } from '@/lib/utils/lessonUtils';
import { useSession } from 'next-auth/react';

const CreateCoverageRequest = ({ onClose, onSuccess, onError }) => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    lesson_id: '',
    swimmer_id: '',
    request_date: '',
    reason: '',
    notes: ''
  });
  const [availableLessons, setAvailableLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lessonsLoading, setLessonsLoading] = useState(true);

  useEffect(() => {
    fetchAvailableLessons();
  }, []);

  const fetchAvailableLessons = async () => {
    try {
      setLessonsLoading(true);
      const response = await fetch('/api/auth/instructor/coverage/available-lessons');
      if (response.ok) {
        const data = await response.json();
        setAvailableLessons(data.availableLessons || []);
      } else {
        onError('Failed to fetch available lessons');
      }
    } catch (error) {
      console.error('Error fetching available lessons:', error);
      onError('Failed to fetch available lessons');
    } finally {
      setLessonsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    console.log('Debug - Input change:', { name, value, currentFormData: formData });
    
    // If lesson changes, reset the swimmer and request date
    if (name === 'lesson_id') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        swimmer_id: '', // Reset swimmer when lesson changes
        request_date: '' // Reset date when lesson changes
      }));
    } else if (name === 'swimmer_id') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        request_date: '' // Reset date when swimmer changes
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.lesson_id || !formData.swimmer_id || !formData.request_date) {
      onError('Please select a lesson, swimmer, and request date');
      return;
    }

    // Validate that swimmer_id is a valid number
    const swimmerId = parseInt(formData.swimmer_id);
    if (isNaN(swimmerId)) {
      onError('Please select a valid swimmer');
      return;
    }

    if (!session?.user?.email) {
      onError('User session not found');
      return;
    }

    try {
      setLoading(true);
      
      // Convert lesson_id to number for the API and add instructor email
      const requestData = {
        ...formData,
        lesson_id: parseInt(formData.lesson_id),
        swimmer_id: swimmerId,
        requesting_instructor_email: session.user.email
      };
      
      console.log('Debug - Form data:', formData);
      console.log('Debug - Request data being sent:', requestData);
      
      const response = await fetch('/api/auth/instructor/coverage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        
        // Check for specific duplicate constraint error
        if (error.error && error.error.includes('duplicate key value violates unique constraint')) {
          onError('You have already requested coverage for this lesson on this date. Please check your existing coverage requests or choose a different date.');
        } else {
          onError(error.error || 'Failed to create coverage request');
        }
      }
    } catch (error) {
      onError('Failed to create coverage request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Request Coverage</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Lesson Selection */}
          <div>
            <label htmlFor="lesson_id" className="block text-sm font-medium text-gray-700 mb-2">
              Select Lesson <span className="text-red-500">*</span>
            </label>
            {lessonsLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : availableLessons.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No available lessons for coverage requests</p>
              </div>
            ) : (
              <select
                id="lesson_id"
                name="lesson_id"
                value={formData.lesson_id}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a lesson</option>
                {availableLessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {formatLessonInfo(lesson)}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Swimmer Selection */}
          {formData.lesson_id && (
            <div>
              <label htmlFor="swimmer_id" className="block text-sm font-medium text-gray-700 mb-2">
                Select Swimmer <span className="text-red-500">*</span>
              </label>
              {(() => {
                const lesson = availableLessons.find(l => l.id === parseInt(formData.lesson_id));
                if (!lesson) {
                  return <div className="text-red-500 text-sm">Lesson not found</div>;
                }
                if (!lesson.participants) {
                  return <div className="text-red-500 text-sm">No participants data for this lesson</div>;
                }
                if (lesson.participants.length === 0) {
                  return <div className="text-red-500 text-sm">No swimmers enrolled in this lesson</div>;
                }
                return (
                  <select
                    id="swimmer_id"
                    name="swimmer_id"
                    value={formData.swimmer_id}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a swimmer</option>
                    {lesson.participants.map((participant) => (
                      <option key={participant.id} value={participant.id}>
                        {participant.name} {participant.proficiency ? `(${participant.proficiency})` : ''}
                      </option>
                    ))}
                  </select>
                );
              })()}
              
              {/* Debug info - remove this after fixing */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-2 text-xs text-gray-500">
                  <div>Selected lesson ID: {formData.lesson_id}</div>
                  <div>Available lessons: {availableLessons.length}</div>
                  <div>Lesson participants: {(() => {
                    const lesson = availableLessons.find(l => l.id === parseInt(formData.lesson_id));
                    return lesson?.participants?.length || 'No participants';
                  })()}</div>
                </div>
              )}
            </div>
          )}

          {/* Request Date */}
          <div>
            <label htmlFor="request_date" className="block text-sm font-medium text-gray-700 mb-2">
              Date Coverage Needed <span className="text-red-500">*</span>
            </label>
            {formData.lesson_id ? (
              <div>
                {(() => {
                  const lesson = availableLessons.find(l => l.id === parseInt(formData.lesson_id));
                  return (
                    <p className="mb-2 text-sm text-gray-600">
                      <span className="font-medium">Meeting days:</span> {formatMeetingDays(lesson?.meeting_days)}
                    </p>
                  );
                })()}
                <input
                  type="date"
                  id="request_date"
                  name="request_date"
                  value={formData.request_date}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Please select a meeting day for this lesson
                </p>
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">
                Please select a lesson first to see available meeting dates
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Coverage
            </label>
            <select
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a reason</option>
              <option value="illness">Illness</option>
              <option value="personal_emergency">Emergency</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Provide any additional details about your coverage request..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">How it works:</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Your coverage request will be visible to other instructors</li>
                  <li>They can volunteer to cover your lesson</li>
                  <li>You&apos;ll be notified when someone accepts or declines</li>
                  <li>You can cancel pending requests at any time</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.lesson_id || !formData.swimmer_id || !formData.request_date}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Coverage Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCoverageRequest; 