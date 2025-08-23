'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, Clock, User, AlertTriangle, Check, X, Filter, Users, Trash2, Edit3, Save } from 'lucide-react';
import MissingDatesManager from './MissingDatesManager';
import { generateLessonDates } from '@/lib/utils/lessonDateUtils';

const ViewSchedule = () => {
  const { data: session } = useSession();
  const [userClasses, setUserClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingNotes, setEditingNotes] = useState(null);
  const [notesText, setNotesText] = useState('');

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

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // Handle removing swimmer from lesson
  const handleRemoveFromLesson = async (lessonId, swimmerId) => {
    if (!confirm('Are you sure you want to remove this swimmer from the lesson? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/auth/customer/schedule/remove-swimmer', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonId, swimmerId }),
      });

      if (response.ok) {
        showSuccessMessage('Swimmer removed from lesson successfully');
        await fetchUserClasses(); // Refresh the schedule
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to remove swimmer from lesson');
      }
    } catch (error) {
      alert('Failed to remove swimmer from lesson');
    }
  };

  // Handle updating notes
  const handleUpdateNotes = async (lessonId, swimmerId, notes) => {
    try {
      const response = await fetch('/api/auth/customer/schedule/update-notes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonId, swimmerId, notes }),
      });

      if (response.ok) {
        showSuccessMessage('Instructor notes updated successfully');
        setEditingNotes(null);
        setNotesText('');
        await fetchUserClasses(); // Refresh the schedule
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update notes');
      }
    } catch (error) {
      alert('Failed to update notes');
    }
  };

  // Start editing notes
  const startEditingNotes = (classData) => {
    setEditingNotes(`${classData.id}-${classData.swimmerId}`);
    setNotesText(classData.instructorNotes || '');
  };

  // Cancel editing notes
  const cancelEditingNotes = () => {
    setEditingNotes(null);
    setNotesText('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isUpcoming = (classData) => {
    const endDate = new Date(classData.endDate);
    const currentDate = new Date();
    return endDate >= currentDate;
  };

  const filteredClasses = userClasses.filter((classData) => {
    const endDate = new Date(classData.endDate);
    const currentDate = new Date();
    
    if (filter === 'upcoming') {
      return endDate >= currentDate;
    } else if (filter === 'past') {
      return endDate < currentDate;
    }
    return true; 
  });

  const upcomingCount = userClasses.filter(classData => isUpcoming(classData)).length;
  const pastCount = userClasses.filter(classData => !isUpcoming(classData)).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pool-blue mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-24 right-4 z-50 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl shadow-lg flex items-start">
          <Check className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <p className="font-medium">{successMessage}</p>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-medium">Error Loading Schedule</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          My Schedule
        </h1>
        <p className="text-lg md:text-xl text-gray-600">View and manage your swim lesson registrations.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pool-blue to-brandeis-blue rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{userClasses.length}</p>
              <p className="text-sm text-gray-600">Total Classes</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{upcomingCount}</p>
              <p className="text-sm text-gray-600">Upcoming</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{pastCount}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter Controls */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Filter by:</label>
            </div>
            
            {/* Filter Buttons - Stack on mobile, flex on larger screens */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {[
                { value: 'all', label: 'All Classes', count: userClasses.length },
                { value: 'upcoming', label: 'Upcoming', count: upcomingCount },
                { value: 'past', label: 'Past', count: pastCount }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`w-full sm:w-auto px-4 py-3 sm:py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                    filter === option.value
                      ? 'bg-gradient-to-r from-pool-blue to-brandeis-blue text-white shadow-lg transform scale-[1.02]'
                      : 'text-gray-600 hover:text-brandeis-blue hover:bg-gradient-to-r hover:from-pool-blue/10 hover:to-brandeis-blue/10 border border-gray-200'
                  }`}
                >
                  {option.label} ({option.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Classes List */}
      {filteredClasses.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No classes found</h3>
          <p className="text-gray-600 mb-6">No classes match your current filter selection.</p>
          <p className="text-sm text-gray-500">Try changing your filter options or register for new classes.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredClasses.map((classData) => {
            const upcoming = isUpcoming(classData);
            return (
              <div key={`${classData.id}-${classData.swimmerId}`} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-lg">{classData.swimmerName}&#39;s Lesson</h2>
                    {!upcoming && (
                      <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Date Range */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700 mb-1">Lesson Dates</p>
                      <p className="text-gray-900 font-medium">
                        {formatDate(classData.startDate)} - {formatDate(classData.endDate)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Time */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700 mb-1">Time</p>
                      <p className="text-gray-900 font-medium">{classData.time}</p>
                    </div>
                  </div>
                  
                  {/* Days */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700 mb-1">Meeting Days</p>
                      <div className="flex flex-wrap gap-1">
                        {classData.meetingDays.map((day, index) => (
                          <span key={index} className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-lg">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700 mb-1">Instructor</p>
                      {classData.instructor ? (
                        <div className="flex items-center gap-2">
                          <p className="text-gray-900 font-medium">{classData.instructor.name}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic text-sm">Instructor not assigned yet</p>
                      )}
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Payment Status</span>
                      <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                        classData.paymentConfirmed 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {classData.paymentConfirmed ? 'Confirmed' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Instructor Notes */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">Instructor Notes</p>
                      {editingNotes === `${classData.id}-${classData.swimmerId}` ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateNotes(classData.id, classData.swimmerId, notesText)}
                            className="text-green-600 hover:text-green-700 p-1"
                            title="Save notes"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditingNotes}
                            className="text-gray-600 hover:text-gray-700 p-1"
                            title="Cancel editing"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditingNotes(classData)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="Edit instructor notes"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    {editingNotes === `${classData.id}-${classData.swimmerId}` ? (
                      <textarea
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                        placeholder="Add instructor notes here..."
                        className="w-full p-3 border border-gray-200 rounded-xl focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-sm"
                        rows={3}
                      />
                    ) : (
                      <div className={`bg-gray-50 rounded-xl p-3 text-sm text-gray-700 min-h-[3rem] ${
                        classData.instructorNotes ? '' : 'text-gray-500 italic'
                      }`}>
                        {classData.instructorNotes || 'No instructor notes added yet. Click the edit button to add notes.'}
                      </div>
                    )}
                  </div>

                  {/* Missing Dates Management */}
                  {upcoming && (
                    <div className="pt-4 border-t border-gray-100">
                      <MissingDatesManager
                        lessonId={classData.id}
                        swimmerId={classData.swimmerId}
                        swimmerName={classData.swimmerName}
                        lessonDetails={`${classData.meetingDays.join(', ')} at ${classData.time} - ${formatDate(classData.startDate)} to ${formatDate(classData.endDate)}`}
                        lessonDates={generateLessonDates(classData.meetingDays, classData.startDate, classData.endDate)}
                        onUpdate={fetchUserClasses}
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleRemoveFromLesson(classData.id, classData.swimmerId)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                        title="Remove swimmer from this lesson"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Remove from Lesson</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewSchedule;