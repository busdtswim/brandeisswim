'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, Clock, User, AlertTriangle, Check, X, Filter, Search, Users } from 'lucide-react';

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
              <div 
                key={`${classData.id}-${classData.swimmerId}`}
                className={`bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover ${
                  !upcoming ? 'opacity-80' : ''
                }`}
              >
                <div className={`px-6 py-4 text-white ${
                  upcoming 
                    ? 'bg-gradient-to-r from-pool-blue to-brandeis-blue' 
                    : 'bg-gradient-to-r from-gray-500 to-gray-600'
                }`}>
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
                  {classData.instructor && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-700 mb-1">Instructor</p>
                        <p className="text-gray-900 font-medium">{classData.instructor.name}</p>
                      </div>
                    </div>
                  )}

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

                  {/* Notes */}
                  {classData.instructorNotes && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
                      <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700 max-h-20 overflow-y-auto">
                        {classData.instructorNotes}
                      </div>
                    </div>
                  )}
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