'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, Clock, User, AlertTriangle, Check, X } from 'lucide-react';

const ViewSchedule = () => {
  const { data: session } = useSession();
  const [userClasses, setUserClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUserClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/customer/schedule');
      if (!response.ok) {
        throw new Error('Failed to fetch schedule');
      }
      const data = await response.json();
      setUserClasses(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUserClasses();
    }
  }, [session]);

  const handleScheduleUpdate = async () => {
    setLoading(true);
    await fetchUserClasses();
    setLoading(false);
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const cancelRegistration = async (classData) => {
    setSelectedClass(classData);
    setIsModalOpen(true);
  };

  const confirmCancellation = async () => {
    try {
      const response = await fetch(`/api/auth/customer/schedule/${selectedClass.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          swimmerId: selectedClass.swimmerId,
        }),
      });

      if (response.ok) {
        showSuccessMessage('Registration cancelled successfully');
        handleScheduleUpdate();
      } else {
        const error = await response.json();
        setError(error.message || 'Failed to cancel registration');
      }
    } catch (error) {
      console.error('Error cancelling registration:', error);
      setError('Failed to cancel registration');
    } finally {
      setIsModalOpen(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const isUpcoming = (classData) => {
    return new Date(classData.endDate) >= new Date();
  };

  const filteredClasses = userClasses.filter(classData => {
    const currentDate = new Date();
    const endDate = new Date(classData.endDate);
    
    if (filter === 'upcoming') {
      return endDate >= currentDate;
    } else if (filter === 'past') {
      return endDate < currentDate;
    }
    return true; 
  });

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-24 right-4 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md shadow-md flex items-start">
          <Check className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md text-red-700 flex items-start">
          <AlertTriangle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Schedule</h1>
        <p className="mt-2 text-gray-600">View and manage your swim lesson registrations.</p>
      </div>
      
      {/* Filter Controls */}
      <div className="mb-6 flex items-center">
        <label htmlFor="filter" className="mr-3 text-sm font-medium text-gray-700 ">Filter:</label>
        <select 
          id="filter" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="all">All Classes</option>
          <option value="upcoming">Upcoming Classes</option>
          <option value="past">Past Classes</option>
        </select>
      </div>

      {/* Classes List */}
      {filteredClasses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-lg">No classes found for your selected filter.</p>
          <p className="text-gray-500 mt-2">Try changing your filter options or register for new classes.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((classData) => (
            <div 
              key={`${classData.id}-${classData.swimmerId}`}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${
                !isUpcoming(classData) ? 'opacity-75' : ''
              }`}
            >
              <div className={`px-4 py-3 text-white ${isUpcoming(classData) ? 'bg-blue-500' : 'bg-gray-500'}`}>
                <h2 className="font-bold flex items-center justify-between">
                  <span>{classData.swimmerName}&#39;s Lesson</span>
                  {!isUpcoming(classData) && <span className="text-xs bg-white text-gray-600 px-2 py-1 rounded">Past</span>}
                </h2>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Date Range */}
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Dates</p>
                    <p className="text-gray-600">
                      {formatDate(classData.startDate)} - {formatDate(classData.endDate)}
                    </p>
                  </div>
                </div>
                
                {/* Time */}
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Time</p>
                    <p className="text-gray-600">{classData.time}</p>
                  </div>
                </div>
                
                {/* Days */}
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Days</p>
                    <p className="text-gray-600">{classData.meetingDays.join(', ')}</p>
                  </div>
                </div>
                
                {/* Instructor */}
                <div className="flex items-start">
                  <User className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Instructor</p>
                    <p className="text-gray-600">
                      {classData.instructor ? classData.instructor.name : 'Not assigned yet'}
                    </p>
                  </div>
                </div>
                
                {/* Actions */}
                {isUpcoming(classData) && (
                  <button
                    onClick={() => cancelRegistration(classData)}
                    className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md font-medium transition-colors shadow-sm"
                  >
                    Cancel Registration
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && selectedClass && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-red-500 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Confirm Cancellation</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="px-6 py-4">
              <p className="text-gray-700 mb-6">
                Are you sure you want to cancel {selectedClass.swimmerName}&#39;s registration for the lesson on {formatDate(selectedClass.startDate)}?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  No, Keep Registration
                </button>
                <button
                  onClick={confirmCancellation}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Yes, Cancel Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSchedule;