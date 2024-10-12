'use client';

import React, { useState, useEffect } from 'react';

const LessonRegistration = () => {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [filter, setFilter] = useState('all');

  // Simulating fetching lessons from an API
  useEffect(() => {
    // In a real application, this would be an API call
    const fetchLessons = async () => {
      const mockLessons = [
        { id: 1, startDate: '2024-03-05', endDate: '2024-03-28', price: 50, meetingDays: ['Monday', 'Wednesday'], time: '3:00 PM - 4:00 PM', capacity: 10, registered: 5 },
        { id: 2, startDate: '2024-04-02', endDate: '2024-05-09', price: 75, meetingDays: ['Tuesday', 'Thursday'], time: '5:00 PM - 6:30 PM', capacity: 8, registered: 3 },
        // Add more mock lessons as needed
      ];
      setLessons(mockLessons);
      setFilteredLessons(mockLessons);
    };

    fetchLessons();
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    if (filter === 'upcoming') {
      setFilteredLessons(lessons.filter(lesson => new Date(lesson.startDate) > currentDate));
    } else if (filter === 'available') {
      setFilteredLessons(lessons.filter(lesson => lesson.registered < lesson.capacity));
    } else {
      setFilteredLessons(lessons);
    }
  }, [filter, lessons]);

  const handleRegister = (lessonId) => {
    // In a real application, this would send a request to your backend
    console.log(`Registering for lesson ${lessonId}`);
    // You might want to show a confirmation modal here
  };

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-8">Available Swim Lessons</h1>

      <div className="mb-4">
        <label htmlFor="filter" className="mr-2">Filter Lessons:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Lessons</option>
          <option value="upcoming">Upcoming Lessons</option>
          <option value="available">Available Lessons</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLessons.map((lesson) => (
          <div key={lesson.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Swim Lesson</h2>
            <p><strong>Dates:</strong> {lesson.startDate} to {lesson.endDate}</p>
            <p><strong>Time:</strong> {lesson.time}</p>
            <p><strong>Days:</strong> {lesson.meetingDays.join(', ')}</p>
            <p><strong>Price:</strong> ${lesson.price}</p>
            <p><strong>Availability:</strong> {lesson.registered}/{lesson.capacity} registered</p>
            <button
              onClick={() => handleRegister(lesson.id)}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={lesson.registered >= lesson.capacity}
            >
              {lesson.registered >= lesson.capacity ? 'Full' : 'Register'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonRegistration;