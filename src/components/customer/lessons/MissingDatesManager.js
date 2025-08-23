'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar } from 'lucide-react';
import MultiSelectDropdown from '@/components/ui/MultiSelectDropdown';

/**
 * MissingDatesManager Component
 * Allows users to add missing dates for their swimmers' lessons
 * 
 * @param {Object} props
 * @param {number} props.lessonId - Lesson ID
 * @param {number} props.swimmerId - Swimmer ID
 * @param {string} props.swimmerName - Swimmer's name
 * @param {string} props.lessonDetails - Lesson details for display
 * @param {Function} props.onUpdate - Callback when missing dates are updated
 */
export default function MissingDatesManager({ 
  lessonId, 
  swimmerId, 
  swimmerName, 
  lessonDetails, 
  lessonDates = [], // Array of available lesson dates
  onUpdate 
}) {
  const { data: session } = useSession();
  const [missingDates, setMissingDates] = useState('');
  const [missingDatesArray, setMissingDatesArray] = useState([]);
  const [currentMissingDates, setCurrentMissingDates] = useState('');
  const [currentMissingDatesArray, setCurrentMissingDatesArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Load existing missing dates on component mount
  useEffect(() => {
    if (lessonId && swimmerId) {
      loadMissingDates();
    }
  }, [lessonId, swimmerId]);

  const loadMissingDates = async () => {
    try {
      const response = await fetch(
        `/api/auth/customer/schedule/${lessonId}/missing-dates?swimmerId=${swimmerId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const missingDatesString = data.data.missingDates || '';
        setCurrentMissingDates(missingDatesString);
        
        // Parse existing missing dates into array
        if (missingDatesString) {
          const datesArray = missingDatesString.split(',').map(date => date.trim()).filter(Boolean);
          setCurrentMissingDatesArray(datesArray);
        } else {
          setCurrentMissingDatesArray([]);
        }
      }
    } catch (error) {
      console.error('Failed to load missing dates:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!missingDates.trim()) {
      setError('Please select at least one new date');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/auth/customer/schedule/${lessonId}/missing-dates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          swimmerId,
          missingDates: missingDates.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setMissingDates('');
        setShowForm(false);
        setShowWarning(false);
        
        // Reload missing dates
        await loadMissingDates();
        
        // Call parent callback
        if (onUpdate) {
          onUpdate();
        }
      } else {
        setError(data.error || 'Failed to add missing dates');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    if (currentMissingDates) {
      setShowWarning(true);
    } else {
      setShowForm(true);
    }
  };

  const confirmAdd = () => {
    setShowWarning(false);
    setShowForm(true);
  };

  const cancelAdd = () => {
    setShowWarning(false);
    setShowForm(false);
  };

  const formatMissingDates = (datesString) => {
    if (!datesString) return 'None';
    
    return datesString.split(',').map(date => date.trim()).join(', ');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-500" />
          Missing Dates
        </h4>
        <p className="text-xs text-gray-500">
          Mark dates when {swimmerName} will be absent
        </p>
      </div>

      {/* Current Missing Dates Display */}
      {currentMissingDates && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <h5 className="font-medium text-amber-800 mb-1 text-sm">Current Missing Dates:</h5>
          <p className="text-amber-700 text-sm font-mono">
            {formatMissingDates(currentMissingDates)}
          </p>
          <p className="text-amber-600 text-xs mt-1">
            ⚠️ These dates are permanent and cannot be changed
          </p>
        </div>
      )}

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 mb-3">
                <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Missing Dates Are Permanent
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Once you add missing dates, they cannot be removed. This helps us accommodate waitlist swimmers.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={confirmAdd}
                  className="w-full bg-pool-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  Continue Adding
                </button>
                <button
                  onClick={cancelAdd}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Missing Dates Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="missingDates" className="block text-xs font-medium text-gray-700 mb-1">
              Select Missing Dates
            </label>
            <MultiSelectDropdown
              placeholder="Select missing dates..."
              options={lessonDates.map(date => ({
                value: date,
                label: date,
                disabled: currentMissingDatesArray.includes(date)
              }))}
              value={[...currentMissingDatesArray, ...missingDatesArray]}
              onChange={(selectedValues) => {
                // Filter out the current (permanent) dates to get only new selections
                const newSelections = selectedValues.filter(date => !currentMissingDatesArray.includes(date));
                setMissingDatesArray(newSelections);
                setMissingDates(newSelections.join(', '));
              }}
              disabled={isLoading}
              className="text-sm"
            />
            {currentMissingDatesArray.length > 0 && (
              <p className="text-xs text-amber-600 mt-1">
                Dates marked with (Permanent) cannot be removed
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-xs">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-xs">{success}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-pool-blue hover:bg-blue-600 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                'Add Missing Dates'
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Add Button */}
      {!showForm && (
        <button
          onClick={handleAddClick}
          className="w-full bg-pool-blue hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        >
          {currentMissingDates ? 'Add More Missing Dates' : 'Mark Missing Dates'}
        </button>
      )}

      {/* Information Box */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <h5 className="text-xs font-medium text-blue-800">Important Information</h5>
                  <div className="mt-1 text-xs text-blue-700">
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>Missing dates are permanent and cannot be removed</li>
                      <li>Existing missing dates are shown as selected and disabled</li>
                      <li>You can only add new missing dates</li>
                      <li>Our team will be notified of your changes</li>
                      <li>This helps accommodate waitlist swimmers</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
    </div>
  );
} 