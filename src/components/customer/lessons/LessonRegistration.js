'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, XCircle, AlertTriangle, Check, Filter, User, MessageSquare, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { generateLessonDates, filterFutureDates, isRegistrationAllowed } from '@/lib/utils/lessonDateUtils';
import MultiSelectDropdown from '@/components/ui/MultiSelectDropdown';

const LessonRegistration = () => {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [filter, setFilter] = useState('all');
  const [swimmers, setSwimmers] = useState([]);
  const [selectedSwimmer, setSelectedSwimmer] = useState('');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [preferredInstructor, setPreferredInstructor] = useState('');
  const [instructorNotes, setInstructorNotes] = useState('');
  const [selectedMissingDates, setSelectedMissingDates] = useState([]);
  const [waitlistActive, setWaitlistActive] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [waitlistMessage, setWaitlistMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessons();
    fetchInstructors();
    checkWaitlistStatus();
  }, []);

  const checkWaitlistStatus = async () => {
    try {
      const response = await fetch('/api/auth/waitlist/status');
      if (response.ok) {
        const data = await response.json();
        setWaitlistActive(data.isActive);
      }
    } catch (error) {
      console.error('Error checking waitlist status:', error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/auth/lessons/instructors');
      if (response.ok) {
        const data = await response.json();
        setInstructors(data);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const fetchSwimmers = async () => {
    try {
      const response = await fetch('/api/auth/customer/swimmers');
      if (response.ok) {
        const data = await response.json();
        setSwimmers(data);
        if (data.length > 0) {
          setSelectedSwimmer(data[0].id.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching swimmers:', error);
    }
  };

  const fetchLessons = async () => {
    try {
      const response = await fetch('/api/auth/lessons/classes');
      if (response.ok) {
        const data = await response.json();
        setLessons(data);
        await fetchSwimmers();
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = lessons;
    
    if (filter === 'upcoming') {
      const currentDate = new Date();
      filtered = lessons.filter(lesson => {
        if (!lesson.startDate) return false;
        return new Date(lesson.startDate) > currentDate;
      });
    } else if (filter === 'available') {
      filtered = lessons.filter(lesson => {
        const registered = lesson.participants ? lesson.participants.length : 0;
        const capacity = lesson.capacity || 1;
        return registered < capacity;
      });
    }
    
    setFilteredLessons(filtered);
  }, [lessons, filter]);

  const allLessonsFull = lessons.every(lesson => lesson.registered >= lesson.max_slots);

  const handleRegisterClick = (lesson) => {
    setSelectedLesson(lesson);
    setSelectedMissingDates([]); // Reset missing dates selection
    
    // Generate lesson dates for missing dates selection
    if (lesson.meetingDays && lesson.startDate && lesson.endDate) {
      // Convert dates to MM/DD/YYYY format if they're not already
      const startDate = formatDateForAPI(lesson.startDate);
      const endDate = formatDateForAPI(lesson.endDate);
      const lessonDates = generateLessonDates(lesson.meetingDays, startDate, endDate);
      // Only show future dates for selection
      const futureDates = filterFutureDates(lessonDates);
      // Store the available dates for selection (we'll use this in the UI)
      lesson.availableLessonDates = futureDates;
    }
  };

  const handleRegister = async () => {
    if (!selectedSwimmer) {
      toast.error('Please select a swimmer');
      return;
    }

    try {
      const response = await fetch('/api/auth/lesson-register/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: selectedLesson.id,
          swimmerId: selectedSwimmer,
          preferredInstructorId: preferredInstructor || null,
          instructorNotes: instructorNotes,
          missingDates: selectedMissingDates.length > 0 ? selectedMissingDates.join(',') : null,
        }),
      });

      if (response.ok) {
        toast.success('Successfully registered for the lesson!');
        fetchLessons();
        setSelectedLesson(null);
        setPreferredInstructor('');
        setInstructorNotes('');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to register for lesson');
      }
    } catch (error) {
      console.error('Error registering for lesson:', error);
      toast.error('Failed to register for lesson');
    }
  };

  const handleJoinWaitlistClick = () => {
    setShowWaitlistModal(true);
  };

  const handleJoinWaitlist = async () => {
    if (!selectedSwimmer) {
      toast.error('Please select a swimmer');
      return;
    }

    try {
      const response = await fetch('/api/auth/waitlist/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          swimmerId: selectedSwimmer,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setWaitlistMessage(data.message);
        toast.success('Successfully joined the waitlist!');
      } else {
        const error = await response.json();
        setWaitlistMessage(`Failed to join waitlist: ${error.error}`);
        toast.error(error.error || 'Failed to join waitlist');
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      setWaitlistMessage('Failed to join waitlist. Please try again.');
      toast.error('Failed to join waitlist');
    } finally {
      setShowWaitlistModal(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${getMonthName(month)} ${day}, ${year}`;
  };

  const getMonthName = (monthNum) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[monthNum - 1] || '';
  };
  
  // Replace the existing formatTime function with this one
  const formatTime = (timeString) => {
    if (!timeString) return 'TBD';
    
    // If the time is in HH:MM format (24-hour)
    if (typeof timeString === 'string' && /^\d{1,2}:\d{2}$/.test(timeString)) {
      const [hours, minutes] = timeString.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return 'Invalid Time';
      
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
    
    // If it's already in 12-hour format with AM/PM
    if (typeof timeString === 'string' && /\d{1,2}:\d{2}\s?[AP]M/i.test(timeString)) {
      return timeString;
    }
    
    // Try using Date constructor as fallback
    try {
      const options = { hour: '2-digit', minute: '2-digit' };
      const date = new Date(timeString);
      if (isNaN(date.getTime())) return 'Invalid Time';
      return date.toLocaleTimeString([], options);
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid Time';
    }
  };

  const closeModal = () => {
    setSelectedLesson(null);
    setPreferredInstructor('');
    setInstructorNotes('');
    setSelectedMissingDates([]);
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const availableCount = lessons.filter(lesson => {
    const registered = lesson.participants ? lesson.participants.length : 0;
    const capacity = lesson.capacity || 1;
    return registered < capacity;
  }).length;
  
  const upcomingCount = lessons.filter(lesson => {
    if (!lesson.startDate) return false;
    const startDate = new Date(lesson.startDate);
    return !isNaN(startDate.getTime()) && startDate > new Date();
  }).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Available <span className="gradient-text">Swim Lessons</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600">Browse and register for our upcoming swimming lessons.</p>
      </div>

      {/* Alert Messages */}
      {waitlistMessage && (
        <div className={`mb-8 p-6 rounded-2xl flex items-start gap-3 ${
          waitlistMessage.includes('Failed') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {waitlistMessage.includes('Failed') ? (
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          ) : (
            <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-medium">{waitlistMessage}</p>
          </div>
        </div>
      )}

      {/* Filter and Actions Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8">
        <div className="space-y-4">
          {/* Filter Label and Buttons */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Filter by:</label>
            </div>
            
            {/* Filter Buttons - Stack on mobile, flex on larger screens */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {[
                { value: 'all', label: 'All Lessons', count: lessons.length },
                { value: 'upcoming', label: 'Upcoming', count: upcomingCount },
                { value: 'available', label: 'Available', count: availableCount }
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
          
          {/* Waitlist button */}
          {waitlistActive && (
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={handleJoinWaitlistClick}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Join Waitlist
              </button>
            </div>
          )}
        </div>
      </div>

      {/* All lessons full message */}
      {allLessonsFull && waitlistActive && (
        <div className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-orange-800 mb-2">All lessons are currently full.</p>
              <p className="text-orange-700">Please consider joining our waitlist. We&#39;ll contact you if a spot becomes available.</p>
            </div>
          </div>
        </div>
      )}

      {/* Lessons Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pool-blue mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Loading available lessons...</p>
          </div>
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No lessons found</h3>
          <p className="text-gray-600 mb-6">No lessons match your current filter selection.</p>
          <p className="text-sm text-gray-500">Try changing your filter options or check back later for new lessons.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => {
            const registered = lesson.participants ? lesson.participants.length : 0;
            const maxSlots = lesson.capacity || 1;
            const isFull = registered >= maxSlots;
            const fillPercentage = (registered / maxSlots) * 100;
            const registrationAllowed = isRegistrationAllowed(lesson);
            
            return (
              <div 
                key={lesson.id} 
                className={`bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover ${
                  isFull ? 'opacity-80' : ''
                }`}
              >
                <div className={`px-6 py-4 text-white ${
                  isFull 
                    ? 'bg-gradient-to-r from-gray-500 to-gray-600' 
                    : 'bg-gradient-to-r from-pool-blue to-brandeis-blue'
                }`}>
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-lg">
                      {lesson.meetingDays && lesson.meetingDays.length > 0 ? lesson.meetingDays.join(', ') : 'Swimming'} Class
                    </h2>
                    {isFull && (
                      <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                        Full
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Lesson Details */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-700 mb-1">Date Range</p>
                        <p className="text-gray-900 font-medium">
                         {formatDate(lesson.startDate)} - {formatDate(lesson.endDate)}
                       </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-700 mb-1">Time</p>
                                               <p className="text-gray-900 font-medium">
                         {lesson.time || 'TBD'}
                       </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-700 mb-2">Availability</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                             <span className="font-medium text-gray-900">
                               {registered}/{maxSlots} spots filled
                             </span>
                            <span className="text-gray-500">{Math.round(fillPercentage)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full transition-all duration-300 ${
                                fillPercentage >= 100 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                                fillPercentage >= 80 ? 'bg-gradient-to-r from-orange-400 to-red-400' :
                                'bg-gradient-to-r from-green-400 to-blue-500'
                              }`}
                              style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleRegisterClick(lesson)}
                      disabled={isFull || !registrationAllowed}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-center transition-all duration-200 ${
                        isFull || !registrationAllowed
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-pool-blue to-brandeis-blue hover:from-brandeis-blue hover:to-pool-blue text-white transform hover:scale-[1.02] hover:shadow-lg'
                      }`}
                    >
                      {!registrationAllowed ? 'Registration Closed' : (isFull ? 'Class Full' : 'Register Now')}
                    </button>
                    
                    {(isFull || !registrationAllowed) && waitlistActive && (
                      <button
                        onClick={() => handleJoinWaitlistClick()}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white py-3 px-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                      >
                        Join Waitlist
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Registration Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-pool-blue to-brandeis-blue px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Register for Swim Lesson</h3>
              <button 
                onClick={closeModal}
                className="text-white/80 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-white/10"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="px-6 py-6">
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pool-blue" />
                  Lesson Details
                </h4>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 rounded-2xl space-y-2 text-sm border border-gray-200">
                   <p><span className="font-medium text-gray-700">Days:</span> {selectedLesson.meetingDays && selectedLesson.meetingDays.length > 0 ? selectedLesson.meetingDays.join(', ') : 'TBD'}</p>
                   <p><span className="font-medium text-gray-700">Dates:</span> {formatDate(selectedLesson.startDate)} - {formatDate(selectedLesson.endDate)}</p>
                   <p><span className="font-medium text-gray-700">Time:</span> {selectedLesson.time || 'TBD'}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="swimmer">
                    Select Swimmer
                  </label>
                  {swimmers.length === 0 ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-700 text-sm font-medium">No swimmers found. Please add a swimmer to your account first.</p>
                    </div>
                  ) : (
                    <select
                      id="swimmer"
                      value={selectedSwimmer}
                      onChange={(e) => setSelectedSwimmer(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900"
                    >
                      {swimmers.map((swimmer) => (
                        <option key={swimmer.id} value={swimmer.id}>
                          {swimmer.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="instructor">
                    Preferred Instructor (Optional)
                  </label>
                  <select
                    id="instructor"
                    value={preferredInstructor}
                    onChange={(e) => setPreferredInstructor(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900"
                  >
                    <option value="">No preference</option>
                    {instructors.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="notes">
                    Notes for Instructor (Optional)
                  </label>
                  <textarea
                    id="notes"
                    value={instructorNotes}
                    onChange={(e) => setInstructorNotes(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900 resize-none"
                    placeholder="Any special requests, allergies, or information for your instructor..."
                  ></textarea>
                </div>

                {/* Missing Dates Selection */}
                {selectedLesson?.availableLessonDates && selectedLesson.availableLessonDates.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      Dates You&#39;ll Miss (Optional)
                    </label>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-3">
                      <p className="text-sm text-amber-700 mb-3">
                        Select any lesson dates when {swimmers.find(s => s.id.toString() === selectedSwimmer)?.name || 'your swimmer'} will be absent. 
                        <span className="font-semibold"> These selections are permanent and help us accommodate waitlist swimmers.</span>
                      </p>
                      <MultiSelectDropdown
                        placeholder="Select dates you'll miss..."
                        options={selectedLesson.availableLessonDates.map(date => ({ value: date, label: date }))}
                        value={selectedMissingDates}
                        onChange={setSelectedMissingDates}
                        className="text-sm"
                      />
                      
                      {selectedMissingDates.length > 0 && (
                        <div className="mt-3 p-2 bg-amber-100 rounded-lg">
                          <p className="text-xs text-amber-800 font-medium">
                            Selected: {selectedMissingDates.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
              <button
                onClick={handleRegister}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                disabled={swimmers.length === 0}
              >
                Confirm Registration
              </button>
              <button
                onClick={closeModal}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Waitlist Modal */}
      {showWaitlistModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Join Waitlist</h3>
              <button 
                onClick={() => setShowWaitlistModal(false)}
                className="text-white/80 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-white/10"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="px-6 py-6">
              <div className="mb-6">
                <p className="text-gray-600 leading-relaxed">
                  Join our waitlist to be notified when space becomes available in one of our swim lessons. We&#39;ll contact you as soon as a spot opens up.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="waitlist-swimmer">
                  Select Swimmer
                </label>
                {swimmers.length === 0 ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-sm font-medium">No swimmers found. Please add a swimmer to your account first.</p>
                  </div>
                ) : (
                  <select
                    id="waitlist-swimmer"
                    value={selectedSwimmer}
                    onChange={(e) => setSelectedSwimmer(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 text-gray-900"
                  >
                    {swimmers.map((swimmer) => (
                      <option key={swimmer.id} value={swimmer.id}>
                        {swimmer.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-red-50/30 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
              <button
                onClick={handleJoinWaitlist}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                disabled={swimmers.length === 0}
              >
                Join Waitlist
              </button>
              <button
                onClick={() => setShowWaitlistModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonRegistration;