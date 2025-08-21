'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Edit3, Save, X, User, MessageSquare, Calendar, Clock, Users } from 'lucide-react';

const UserSchedule = ({ classData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [preferredInstructor, setPreferredInstructor] = useState(classData.preferredInstructor?.id || '');
  const [instructorNotes, setInstructorNotes] = useState(classData.instructorNotes || '');
  const [isLoading, setIsLoading] = useState(false);

  const isUpcoming = new Date(classData.endDate) >= new Date();

  useEffect(() => {
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

    if (isEditing) {
      fetchInstructors();
    }
  }, [isEditing]);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/auth/customer/schedule/${classData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          swimmerId: classData.swimmerId,
          preferredInstructorId: preferredInstructor || null,
          instructorNotes: instructorNotes,
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        if (onUpdate) onUpdate();
        toast.success('Preferences updated successfully!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update preferences');
      }
    } catch (error) {
      console.error('Error updating class:', error);
      toast.error('Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this registration? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/auth/customer/schedule/${classData.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            swimmerId: classData.swimmerId,
          }),
        });

        if (response.ok) {
          if (onUpdate) onUpdate();
          toast.success('Registration cancelled successfully');
        } else {
          const error = await response.json();
          toast.error(error.message || 'Failed to cancel registration');
        }
      } catch (error) {
        console.error('Error cancelling registration:', error);
        toast.error('Failed to cancel registration');
      }
    }
  };

  return (
    <div className={`bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover ${
      !isUpcoming ? 'opacity-80' : ''
    }`}>
      {/* Header */}
      <div className={`px-6 py-4 text-white ${
        isUpcoming 
          ? 'bg-gradient-to-r from-pool-blue to-brandeis-blue' 
          : 'bg-gradient-to-r from-gray-500 to-gray-600'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">{classData.swimmerName}&#39;s Lesson</h3>
          {!isUpcoming && (
            <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
              Completed
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Class Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">Date Range</p>
              <p className="text-gray-900 font-medium">{classData.startDate} - {classData.endDate}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">Time</p>
              <p className="text-gray-900 font-medium">{classData.time}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">Days</p>
              <div className="flex flex-wrap gap-1">
                {classData.meetingDays.map((day, index) => (
                  <span key={index} className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-lg">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {isEditing ? (
          <div className="space-y-6">
            {/* Editing Form */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-pool-blue" />
                Edit Preferences
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Instructor</label>
                  <select
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes for Instructor</label>
                  <textarea
                    value={instructorNotes}
                    onChange={(e) => setInstructorNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900 resize-none"
                    rows="4"
                    placeholder="Any special requests, allergies, or notes for your instructor..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Settings Display */}
            <div className="space-y-4">
              {/* Assigned Instructor */}
              {classData.instructor && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-1">Assigned Instructor</p>
                    <p className="text-gray-900 font-medium">{classData.instructor.name}</p>
                  </div>
                </div>
              )}
              
              {/* Preferred Instructor */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">Preferred Instructor</p>
                  {classData.preferredInstructor ? (
                    <div>
                      <p className="text-gray-900 font-medium">{classData.preferredInstructor.name}</p>
                      {preferredInstructor && preferredInstructor !== classData.preferredInstructor.id && (
                        <p className="text-sm text-amber-600 font-medium">Change pending...</p>
                      )}
                    </div>
                  ) : preferredInstructor ? (
                    <p className="text-amber-600 font-medium">Selection pending...</p>
                  ) : (
                    <p className="text-gray-500">No preference set</p>
                  )}
                </div>
              </div>
              
              {/* Notes */}
              {classData.instructorNotes && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-2">Notes for Instructor</p>
                    <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700 max-h-24 overflow-y-auto">
                      {classData.instructorNotes}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Actions */}
            {isUpcoming && (
              <div className="pt-6 border-t border-gray-100">
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-gradient-to-r from-pool-blue to-brandeis-blue hover:from-brandeis-blue hover:to-pool-blue text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-5 h-5" />
                    Edit Preferences
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSchedule;