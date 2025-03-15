'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, XCircle, AlertTriangle, Check } from 'lucide-react';

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

  useEffect(() => {
    const currentDate = new Date();
    if (filter === 'upcoming') {
      setFilteredLessons(lessons.filter(lesson => new Date(lesson.start_date) > currentDate));
    } else if (filter === 'available') {
      setFilteredLessons(lessons.filter(lesson => lesson.registered < lesson.max_slots));
    } else {
      setFilteredLessons(lessons);
    }
  }, [filter, lessons]);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/lesson-register/slots');
      if (response.ok) {
        const data = await response.json();
        setLessons(data);
        setFilteredLessons(data);
      } else {
        console.error('Failed to fetch lessons');
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSwimmers = async () => {
    try {
      const response = await fetch('/api/auth/lesson-register/swimmers');
      if (response.ok) {
        const data = await response.json();
        setSwimmers(data);
        if (data.length > 0) {
          setSelectedSwimmer(data[0].id);
        }
      } else {
        console.error('Failed to fetch swimmers');
      }
    } catch (error) {
      console.error('Error fetching swimmers:', error);
    }
  };

  const handleRegisterClick = async (lesson) => {
    setSelectedLesson(lesson);
    await fetchSwimmers();
  };

  const handleJoinWaitlistClick = async () => {
    setShowWaitlistModal(true);
    await fetchSwimmers();
  };

  const handleJoinWaitlist = async () => {
    if (!selectedSwimmer) {
      alert('Please select a swimmer');
      return;
    }

    try {
      const response = await fetch('/api/auth/waitlist/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          swimmerId: selectedSwimmer
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setWaitlistMessage(`Successfully added to waitlist`);
        setShowWaitlistModal(false);
      } else {
        const errorData = await response.json();
        setWaitlistMessage(`Failed to join waitlist: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      setWaitlistMessage('An error occurred while joining the waitlist. Please try again.');
    }
  };

  const handleRegister = async () => {
    if (!selectedSwimmer || !selectedLesson) {
      alert('Please select a swimmer');
      return;
    }

    try {
      const response = await fetch('/api/auth/lesson-register/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          swimmerId: selectedSwimmer,
          lessonId: selectedLesson.id,
          preferredInstructorId: preferredInstructor || null,
          instructorNotes: instructorNotes.trim() || null,
        }),
      });

      if (response.ok) {
        const updatedLesson = await response.json();
        setLessons(lessons.map(lesson => 
          lesson.id === updatedLesson.id ? updatedLesson : lesson
        ));
        alert('Registration successful!');
        setSelectedLesson(null);
        setPreferredInstructor('');
        setInstructorNotes('');
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration. Please try again.');
    }
  };

  // Count how many lessons are full
  const fullLessonsCount = lessons.filter(lesson => lesson.registered >= lesson.max_slots).length;
  const allLessonsFull = fullLessonsCount === lessons.length && lessons.length > 0;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(timeString).toLocaleTimeString([], options);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Available Swim Lessons</h2>
        <p className="mt-2 text-lg text-gray-600">Browse and register for our upcoming swimming lessons.</p>
      </div>

      {/* Alert Messages */}
      {waitlistMessage && (
        <div className={`mb-8 p-4 rounded-lg flex items-center ${
          waitlistMessage.includes('Failed') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {waitlistMessage.includes('Failed') ? (
            <AlertTriangle className="mr-3 h-5 w-5 text-red-400" />
          ) : (
            <Check className="mr-3 h-5 w-5 text-green-400" />
          )}
          <span>{waitlistMessage}</span>
        </div>
      )}

      {/* Filter and Actions Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div>
              <label htmlFor="filter" className="block text-sm font-medium text-black mb-1">Filter Lessons:</label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full sm:w-auto text-black bg-white border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Lessons</option>
                <option value="upcoming">Upcoming Lessons</option>
                <option value="available">Available Lessons</option>
              </select>
            </div>
          </div>
          
          {/* Waitlist button */}
          {waitlistActive && (
            <button
              onClick={handleJoinWaitlistClick}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Join Waitlist
            </button>
          )}
        </div>
      </div>

      {/* All lessons full message */}
      {allLessonsFull && waitlistActive && (
        <div className="mb-8 bg-orange-50 border-l-4 border-orange-400 p-4 rounded-md">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-orange-400 mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-orange-800">All lessons are currently full.</p>
              <p className="text-orange-700 mt-1">Please consider joining our waitlist. We&#39;ll contact you if a spot becomes available.</p>
            </div>
          </div>
        </div>
      )}

      {/* Lessons Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-lg">No lessons found for your selected filter.</p>
          <p className="text-gray-500 mt-2">Try changing your filter options or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <div 
              key={lesson.id} 
              className={`bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-all hover:shadow-md ${
                lesson.registered >= lesson.max_slots ? 'opacity-75' : ''
              }`}
            >
              <div className="bg-blue-500 px-4 py-3 text-white">
                <h2 className="font-bold">
                  {lesson.meeting_days.split(',').join(', ')} Swim Class
                </h2>
              </div>
              
              <div className="p-5">
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Date Range</p>
                      <p className="text-gray-600">
                        {formatDate(lesson.start_date)} - {formatDate(lesson.end_date)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Time</p>
                      <p className="text-gray-600">
                        {formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Availability</p>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-blue-600">
                              {lesson.registered}/{lesson.max_slots} Spots Filled
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                          <div 
                            style={{ width: `${(lesson.registered / lesson.max_slots) * 100}%` }} 
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleRegisterClick(lesson)}
                  disabled={lesson.registered >= lesson.max_slots}
                  className={`w-full py-2.5 px-4 rounded-md font-medium text-center transition-colors ${
                    lesson.registered >= lesson.max_slots
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm'
                  }`}
                >
                  {lesson.registered >= lesson.max_slots ? 'Class Full' : 'Register'}
                </button>
                
                {lesson.registered >= lesson.max_slots && waitlistActive && (
                  <button
                    onClick={() => handleJoinWaitlistClick()}
                    className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-4 rounded-md font-medium transition-colors shadow-sm"
                  >
                    Join Waitlist
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Registration Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-blue-500 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Register for Swim Lesson</h3>
              <button 
                onClick={() => {
                  setSelectedLesson(null);
                  setPreferredInstructor('');
                  setInstructorNotes('');
                }}
                className="text-white hover:text-gray-200"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-2">Lesson Details:</h4>
                <div className="bg-gray-50 p-3 rounded-md space-y-1 text-sm">
                  <p><span className="font-medium">Days:</span> {selectedLesson.meeting_days.split(',').join(', ')}</p>
                  <p><span className="font-medium">Dates:</span> {formatDate(selectedLesson.start_date)} - {formatDate(selectedLesson.end_date)}</p>
                  <p><span className="font-medium">Time:</span> {formatTime(selectedLesson.start_time)} - {formatTime(selectedLesson.end_time)}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="swimmer">
                    Select Swimmer
                  </label>
                  {swimmers.length === 0 ? (
                    <p className="text-red-500 text-sm">No swimmers found. Please add a swimmer to your account first.</p>
                  ) : (
                    <select
                      id="swimmer"
                      value={selectedSwimmer}
                      onChange={(e) => setSelectedSwimmer(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border py-2 px-3"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="instructor">
                    Preferred Instructor (Optional)
                  </label>
                  <select
                    id="instructor"
                    value={preferredInstructor}
                    onChange={(e) => setPreferredInstructor(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border py-2 px-3"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
                    Notes for Instructor (Optional)
                  </label>
                  <textarea
                    id="notes"
                    value={instructorNotes}
                    onChange={(e) => setInstructorNotes(e.target.value)}
                    rows="3"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border py-2 px-3"
                    placeholder="Any special requests or information..."
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-2">
              <button
                onClick={handleRegister}
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={swimmers.length === 0}
              >
                Confirm Registration
              </button>
              <button
                onClick={() => {
                  setSelectedLesson(null);
                  setPreferredInstructor('');
                  setInstructorNotes('');
                }}
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md border border-gray-300 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Waitlist Modal */}
      {showWaitlistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-orange-500 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Join Waitlist</h3>
              <button 
                onClick={() => setShowWaitlistModal(false)}
                className="text-white hover:text-gray-200"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="px-6 py-4">
              <p className="text-gray-600 mb-6">
                Join our waitlist to be notified when space becomes available in one of our swim lessons.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="waitlist-swimmer">
                  Select Swimmer
                </label>
                {swimmers.length === 0 ? (
                  <p className="text-red-500 text-sm">No swimmers found. Please add a swimmer to your account first.</p>
                ) : (
                  <select
                    id="waitlist-swimmer"
                    value={selectedSwimmer}
                    onChange={(e) => setSelectedSwimmer(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 border py-2 px-3"
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
            
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-2">
              <button
                onClick={handleJoinWaitlist}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                disabled={swimmers.length === 0}
              >
                Join Waitlist
              </button>
              <button
                onClick={() => setShowWaitlistModal(false)}
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md border border-gray-300 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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