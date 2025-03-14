'use client';

import React, { useState, useEffect } from 'react';

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

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-8">Available Swim Lessons</h1>

      {waitlistMessage && (
        <div className={`mb-6 p-4 rounded ${
          waitlistMessage.includes('Failed') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {waitlistMessage}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <label htmlFor="filter" className="mr-2">Filter Lessons:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded p-2 mr-4"
          >
            <option value="all">All Lessons</option>
            <option value="upcoming">Upcoming Lessons</option>
            <option value="available">Available Lessons</option>
          </select>
        </div>
        
        {/* Waitlist button */}
        {waitlistActive && (
          <button
            onClick={handleJoinWaitlistClick}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          >
            Join Waitlist
          </button>
        )}
      </div>

      {/* All lessons full message */}
      {allLessonsFull && waitlistActive && (
        <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p className="font-bold">All lessons are currently full.</p>
          <p>Please consider joining our waitlist. We'll contact you if a spot becomes available.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLessons.map((lesson) => (
          <div key={lesson.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Swim Lesson</h2>
            <p><strong>Dates:</strong> {new Date(lesson.start_date).toLocaleDateString()} to {new Date(lesson.end_date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {new Date(lesson.start_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} - {new Date(lesson.end_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>
            <p><strong>Days:</strong> {lesson.meeting_days}</p>
            <p><strong>Availability:</strong> {lesson.registered}/{lesson.max_slots} registered</p>
            <button
              onClick={() => handleRegisterClick(lesson)}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={lesson.registered >= lesson.max_slots}
            >
              {lesson.registered >= lesson.max_slots ? 'Full' : 'Register'}
            </button>
          </div>
        ))}
      </div>

      {selectedLesson && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Select Swimmer</h3>
              
              <div className="mt-4">
                <select
                  value={selectedSwimmer}
                  onChange={(e) => setSelectedSwimmer(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {swimmers.map((swimmer) => (
                    <option key={swimmer.id} value={swimmer.id}>
                      {swimmer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Preferred Instructor (Optional)
                </label>
                <select
                  value={preferredInstructor}
                  onChange={(e) => setPreferredInstructor(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                >
                  <option value="">No preference</option>
                  {instructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Notes for Instructor (Optional)
                </label>
                <textarea
                  value={instructorNotes}
                  onChange={(e) => setInstructorNotes(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                  rows="3"
                  placeholder="Any special requests or notes..."
                />
              </div>

              <div className="mt-6 space-y-2">
                <button
                  onClick={handleRegister}
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Confirm Registration
                </button>
                <button
                  onClick={() => {
                    setSelectedLesson(null);
                    setPreferredInstructor('');
                    setInstructorNotes('');
                  }}
                  className="w-full bg-gray-300 text-black p-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Waitlist modal */}
      {showWaitlistModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Join Waitlist</h3>
              
              <p className="text-sm text-gray-500 mt-2">
                Add yourself to the waitlist for swimming lessons. We'll contact you if a spot becomes available.
              </p>
              
              <div className="mt-4">
                <select
                  value={selectedSwimmer}
                  onChange={(e) => setSelectedSwimmer(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {swimmers.map((swimmer) => (
                    <option key={swimmer.id} value={swimmer.id}>
                      {swimmer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 space-y-2">
                <button
                  onClick={handleJoinWaitlist}
                  className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                >
                  Confirm Join Waitlist
                </button>
                <button
                  onClick={() => {
                    setShowWaitlistModal(false);
                  }}
                  className="w-full bg-gray-300 text-black p-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonRegistration;