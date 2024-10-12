'use client';

import React, { useState } from 'react';

const CreateLessons = () => {
  const [lessons, setLessons] = useState([
    { id: 1, startDate: '2024-03-05', endDate: '2024-03-28', price: 50, meetingDays: ['Monday', 'Wednesday'], time: '3:00 PM - 4:00 PM', capacity: 10 },
    { id: 2, startDate: '2024-04-02', endDate: '2024-05-09', price: 75, meetingDays: ['Tuesday', 'Thursday'], time: '5:00 PM - 6:30 PM', capacity: 8 },
  ]);

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    price: '',
    meetingDays: [],
    time: '',
    capacity: '',
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prevState => ({
      ...prevState,
      meetingDays: prevState.meetingDays.includes(day)
        ? prevState.meetingDays.filter(d => d !== day)
        : [...prevState.meetingDays, day]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLesson = {
      id: lessons.length + 1,
      ...formData,
      price: parseFloat(formData.price),
      capacity: parseInt(formData.capacity, 10)
    };
    setLessons([...lessons, newLesson]);
    setFormData({
      startDate: '',
      endDate: '',
      price: '',
      meetingDays: [],
      time: '',
      capacity: '',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-8">Create Swim Lessons</h1>

      {/* Form for creating new lessons */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4 flex space-x-4">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
              Start Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="startDate"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
              End Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="endDate"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Price ($)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price"
            type="number"
            step="0.01"
            placeholder="Price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Meeting Days
          </label>
          <div className="flex flex-wrap -mx-2">
            {daysOfWeek.map(day => (
              <div key={day} className="px-2 mb-2">
                <button
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-3 py-1 rounded ${
                    formData.meetingDays.includes(day)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {day}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
            Time
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="time"
            type="text"
            placeholder="e.g., 3:00 PM - 4:00 PM"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capacity">
            Capacity
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="capacity"
            type="number"
            placeholder="Maximum number of participants"
            name="capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create Lesson
          </button>
        </div>
      </form>

      {/* Table of existing lessons */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Existing Lessons</h2>
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date Range
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Meeting Days
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Time
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => (
              <tr key={lesson.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {lesson.startDate} to {lesson.endDate}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  ${lesson.price}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {lesson.meetingDays.join(', ')}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {lesson.time}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {lesson.capacity}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button className="text-blue-600 hover:text-blue-900">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateLessons;