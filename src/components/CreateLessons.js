'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ExceptionDates from './ExceptionDates';
import { DateFormatter } from '@/utils/formatUtils';
import { 
  CalendarPlus, 
  CalendarDays, 
  Clock, 
  Users, 
  Calendar, 
  ClipboardList, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Plus 
} from 'lucide-react';

const CreateLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    meeting_days: [],
    start_time: '',
    end_time: '',
    max_slots: '',
    exception_dates: []
  });
  const [waitlistExists, setWaitlistExists] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchLessons();
    checkWaitlistStatus();
  }, []);

  const displayMessage = (text, type) => {
    setMessage({ text, type });
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 5000);
  };

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/admin/create');
      if (response.ok) {
        const data = await response.json();
        setLessons(data);
      } else {
        console.error('Failed to fetch lessons');
        displayMessage('Failed to fetch lessons', 'error');
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
      displayMessage('Error fetching lessons: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkWaitlistStatus = async () => {
    try {
      const response = await fetch('/api/auth/waitlist/status');
      if (response.ok) {
        const data = await response.json();
        setWaitlistExists(data.isActive);
      }
    } catch (error) {
      console.error('Error checking waitlist status:', error);
    }
  };

  const handleCreateWaitlist = async () => {
    try {
      const response = await fetch('/api/auth/admin/waitlist', {
        method: 'POST',
      });

      if (response.ok) {
        setWaitlistExists(true);
        displayMessage('Waitlist created successfully!', 'success');
      } else {
        const error = await response.json();
        displayMessage(`Error: ${error.message || 'Failed to create waitlist'}`, 'error');
      }
    } catch (error) {
      console.error('Error creating waitlist:', error);
      displayMessage('Error: Failed to create waitlist', 'error');
    }
  };

  const handleDelete = async (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson? This will remove all swimmers and instructor assignments.')) {
      try {
        const response = await fetch(`/api/auth/admin/lessons/${lessonId}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          setLessons(lessons.filter(lesson => lesson.id !== lessonId));
          displayMessage('Lesson deleted successfully', 'success');
        } else {
          const error = await response.json();
          console.error('Failed to delete lesson:', error);
          displayMessage('Failed to delete lesson', 'error');
        }
      } catch (error) {
        console.error('Error deleting lesson:', error);
        displayMessage('Error deleting lesson: ' + error.message, 'error');
      }
    }
  };

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
      meeting_days: prevState.meeting_days.includes(day)
        ? prevState.meeting_days.filter(d => d !== day)
        : [...prevState.meeting_days, day]
    }));
  };

  const handleAddException = (date) => {
    setFormData(prev => ({
      ...prev,
      exception_dates: [...prev.exception_dates, date]
    }));
  };

  const handleRemoveException = (date) => {
    setFormData(prev => ({
      ...prev,
      exception_dates: prev.exception_dates.filter(d => d !== date)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.meeting_days.length === 0) {
      displayMessage('Please select at least one meeting day', 'error');
      return;
    }

    if (!formData.max_slots || parseInt(formData.max_slots) <= 0) {
      displayMessage('Please enter a valid number of slots', 'error');
      return;
    }

    const newLesson = {
      ...formData,
      start_date: formData.start_date,
      end_date: formData.end_date,
      meeting_days: formData.meeting_days.join(','),
      max_slots: parseInt(formData.max_slots, 10),
      exception_dates: formData.exception_dates.length > 0 
        ? formData.exception_dates.join(',')
        : null
    };
  
    try {
      const response = await fetch('/api/auth/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLesson),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to create lesson');
      }
  
      await fetchLessons();
      displayMessage('Lesson created successfully!', 'success');
      
      setFormData({
        start_date: '',
        end_date: '',
        meeting_days: [],
        start_time: '',
        end_time: '',
        max_slots: '',
        exception_dates: []
      });
    } catch (error) {
      console.error('Error creating lesson:', error);
      displayMessage(error.message, 'error');
    }
  };

  const formatDate = (dateString) => {
    try {
      return DateFormatter.formatForDisplay(dateString);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create Swim Lessons</h1>
        <p className="text-gray-600">Set up new lessons and manage the waitlist.</p>
      </div>
      
      {/* Notification message */}
      {showMessage && (
        <div className={`mb-6 p-4 rounded-lg flex items-start ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border-l-4 border-green-500' 
            : 'bg-red-50 text-red-800 border-l-4 border-red-500'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 mr-3 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 mr-3 mt-0.5" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      {/* Waitlist Action Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <ClipboardList className="w-5 h-5 mr-2 text-blue-600" />
              Waitlist Management
            </h2>
            <p className="text-gray-600">
              {waitlistExists 
                ? "The waitlist is currently active. Students can join when classes are full." 
                : "Create a waitlist for students to join when classes are full."}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreateWaitlist}
              disabled={waitlistExists}
              className={`px-4 py-2 rounded-lg font-medium ${
                waitlistExists 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {waitlistExists ? 'Waitlist Active' : 'Create Waitlist'}
            </button>
            {waitlistExists && (
              <Link 
                href="/admin/waitlist" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium inline-flex items-center"
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                View Waitlist
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Create Lesson Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center">
              <CalendarPlus className="w-5 h-5 mr-2 text-blue-600" />
              Create New Lesson
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="start_date">
                    <Calendar className="w-4 h-4 inline mr-1 text-gray-500" /> Start Date
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    id="start_date"
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="end_date">
                    <Calendar className="w-4 h-4 inline mr-1 text-gray-500" /> End Date
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    id="end_date"
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <CalendarDays className="w-4 h-4 inline mr-1 text-gray-500" /> Meeting Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        formData.meeting_days.includes(day)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              
              <ExceptionDates
                exceptions={formData.exception_dates}
                onAdd={handleAddException}
                onRemove={handleRemoveException}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="start_time">
                    <Clock className="w-4 h-4 inline mr-1 text-gray-500" /> Start Time
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    id="start_time"
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="end_time">
                    <Clock className="w-4 h-4 inline mr-1 text-gray-500" /> End Time
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    id="end_time"
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="max_slots">
                  <Users className="w-4 h-4 inline mr-1 text-gray-500" /> Maximum Capacity
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  id="max_slots"
                  type="number"
                  min="1"
                  placeholder="Enter maximum number of participants"
                  name="max_slots"
                  value={formData.max_slots}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Lesson
              </button>
            </form>
          </div>
        </div>
        
        {/* Existing Lessons Table */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
                Existing Lessons
              </h2>
            </div>

            {lessons.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No lessons have been created yet.</p>
                <p className="mt-2">Use the form to create your first lesson.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Range
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Meeting Days
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lessons.map((lesson) => (
                      <tr key={lesson.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(lesson.start_date)} - {formatDate(lesson.end_date)}
                          </div>
                          {lesson.exception_dates && (
                            <div className="text-xs text-red-600 mt-1">
                              Exceptions: {DateFormatter.formatExceptionDates(lesson.exception_dates) || 'None'}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {lesson.meeting_days}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {lesson.start_time} - {lesson.end_time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {lesson.max_slots}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button 
                            onClick={() => handleDelete(lesson.id)}
                            className="text-red-600 hover:text-red-800 flex items-center ml-auto"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            <span className="font-medium">Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLessons;