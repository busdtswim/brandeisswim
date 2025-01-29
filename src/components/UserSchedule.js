'use client';

import React, { useState, useEffect } from 'react';

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
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update preferences');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) {
      return;
    }

    setIsLoading(true);
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
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to cancel registration');
      }
    } catch (error) {
      console.error('Error cancelling registration:', error);
      alert('Failed to cancel registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg mb-4 overflow-hidden">
      <div className={`p-4 ${isUpcoming ? 'bg-blue-500' : 'bg-gray-500'} text-white`}>
        <h3 className="text-lg font-semibold">{classData.swimmerName}&apos;s {classData.meetingDays.join(', ')} Lesson</h3>
      </div>
      <div className="p-4 space-y-2">
        <p><span className="font-semibold">Date Range:</span> {classData.startDate} - {classData.endDate}</p>
        <p><span className="font-semibold">Time:</span> {classData.time}</p>
        <p><span className="font-semibold">Days:</span> {classData.meetingDays.join(', ')}</p>
        
        {isEditing ? (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Preferred Instructor</label>
              <select
                value={preferredInstructor}
                onChange={(e) => setPreferredInstructor(e.target.value)}
                className="w-full p-2 border rounded"
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
              <label className="block text-sm font-medium mb-1">Notes for Instructor</label>
              <textarea
                value={instructorNotes}
                onChange={(e) => setInstructorNotes(e.target.value)}
                className="w-full p-2 border rounded"
                rows="3"
                placeholder="Any special requests or notes..."
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            {classData.instructor && (
              <p className="break-all">
                <span className="font-semibold">Assigned Instructor:</span> {classData.instructor.name}
              </p>
            )}
            {classData.preferredInstructor ? (
              <p className="break-all">
                <span className="font-semibold">Preferred Instructor:</span> {classData.preferredInstructor.name}
                {preferredInstructor && preferredInstructor !== classData.preferredInstructor.id && (
                  <span className="text-gray-500"> (pending change)</span>
                )}
              </p>
            ) : preferredInstructor ? (
              <p>
                <span className="font-semibold">Preferred Instructor:</span> 
                <span className="text-gray-500">Selection pending...</span>
              </p>
            ) : (
              <p>
                <span className="font-semibold">Preferred Instructor:</span> No preference set
              </p>
            )}
            {classData.instructorNotes && (
              <div>
                <span className="font-semibold">Notes:</span>
                <div className="mt-1 max-h-24 overflow-y-auto break-all bg-gray-50 p-2 rounded">
                  {classData.instructorNotes}
                </div>
              </div>
            )}
            
            {isUpcoming && (
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit Preferences
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel Registration
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSchedule;