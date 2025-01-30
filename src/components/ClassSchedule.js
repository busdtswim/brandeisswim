'use client';

import React, { useState, useEffect } from 'react';
import { hasScheduleConflict } from '@/utils/timeUtils';
import { DateFormatter } from '@/utils/formatUtils';

const ClassSchedule = ({ 
  classData, 
  instructors, 
  onInstructorAssign, 
  onPaymentStatusChange,
  onEditExceptions,
  onRemoveSwimmer 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');
  const [participants, setParticipants] = useState(classData.participants);

  useEffect(() => {
    const updatedClassData = { ...classData };
  
    if (updatedClassData.meetingDays && !Array.isArray(updatedClassData.meetingDays)) {
      updatedClassData.meetingDays = updatedClassData.meetingDays.split(',');
    }
  
    if (updatedClassData.exception_dates) {
      if (typeof updatedClassData.exception_dates === 'string') {
        updatedClassData.exception_dates = updatedClassData.exception_dates.split(',').filter(date => date.trim());
      } else if (!Array.isArray(updatedClassData.exception_dates)) {
        updatedClassData.exception_dates = [];
      }
    } else {
      updatedClassData.exception_dates = [];
    }
    
    setParticipants(updatedClassData.participants || []);
  }, [classData]);

  const handleInstructorAssign = async (lessonId, participantId, newInstructorId) => {
    try {
      setError('');

      if (!newInstructorId) {
        await onInstructorAssign(lessonId, participantId, null);
        return;
      }

      const response = await fetch('/api/auth/lessons/classes');
      if (!response.ok) {
        throw new Error('Failed to fetch lessons data');
      }

      const allLessons = await response.json();
      
      const hasConflict = allLessons.some(otherLesson => {
        if (otherLesson.id === lessonId) return false;
        
        const hasInstructorInOtherLesson = otherLesson.participants.some(
          p => p.instructor_id === parseInt(newInstructorId)
        );

        if (!hasInstructorInOtherLesson) return false;

        return hasScheduleConflict(classData, otherLesson);
      });

      if (hasConflict) {
        setError('This instructor has a scheduling conflict during this time slot.');
        return;
      }

      await onInstructorAssign(lessonId, participantId, newInstructorId);
      
      setParticipants(prevParticipants => 
        prevParticipants.map(p => 
          p.id === participantId 
            ? { ...p, instructor_id: parseInt(newInstructorId) }
            : p
        )
      );
    } catch (error) {
      console.error('Error assigning instructor:', error);
      setError('Failed to assign instructor. Please try again.');
    }
  };

  const handlePaymentStatusChange = async (lessonId, participantId, status) => {
    try {
      await onPaymentStatusChange(lessonId, participantId, status);
      
      setParticipants(prevParticipants => 
        prevParticipants.map(p => 
          p.id === participantId 
            ? { ...p, payment_status: status }
            : p
        )
      );
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError('Failed to update payment status');
    }
  };

  const handleRemoveSwimmer = async (lessonId, swimmerId) => {
    if (window.confirm('Are you sure you want to remove this swimmer from the lesson?')) {
      try {
        const response = await fetch('/api/auth/lessons/remove-swimmer', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lessonId, swimmerId }),
        });

        if (!response.ok) {
          throw new Error('Failed to remove swimmer');
        }

        onRemoveSwimmer(lessonId, swimmerId);
        setError('');
      } catch (error) {
        console.error('Error removing swimmer:', error);
        setError('Failed to remove swimmer from lesson');
      }
    }
  };

return (
  <div className="bg-white shadow-md rounded-lg mb-4 overflow-hidden text-black">
    <div 
      className="bg-blue-500 text-white p-4 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)} 
    >
      <div className="flex items-center"> 
        <h3 className="text-lg font-semibold">
          {classData.meetingDays?.join(', ') || ''} Swim Class
        </h3>
        <p className="text-sm opacity-90 ml-4">
          {DateFormatter.formatFullDate(classData.startDate)} - {DateFormatter.formatFullDate(classData.endDate)}
        </p>
      </div>
      <span className="float-right mt-[-24px]">{isExpanded ? '▲' : '▼'}</span> 
    </div>
    
    {isExpanded && (
      <div className="p-4">
        <div className="mb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p><strong>Time:</strong> {classData.time}</p>
              <p><strong>Days:</strong> {classData.meetingDays?.join(', ') || ''}</p>
              <p><strong>Capacity:</strong> {participants?.length || 0}/{classData.capacity}</p>
              {classData.exception_dates && Array.isArray(classData.exception_dates) && classData.exception_dates.length > 0 && (
                <p className="text-red-600">
                  <strong>No Classes On:</strong> {DateFormatter.formatExceptionDates(classData.exception_dates)}
                </p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditExceptions(classData);
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
            >
              Edit Exceptions
            </button>
          </div>
        </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Swimmer</th>
                  <th className="px-4 py-2 text-left">Age</th>
                  <th className="px-4 py-2 text-left">Proficiency</th>
                  <th className="px-4 py-2 text-left">Preferred Instructor</th>
                  <th className="px-4 py-2 text-left">Instructor</th>
                  <th className="px-4 py-2 text-center">Payment</th>
                  <th className="px-4 py-2 text-left">Remove Swimmer</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr key={participant.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{participant.name}</td>
                    <td className="px-4 py-2">{participant.age}</td>
                    <td className="px-4 py-2">{participant.proficiency}</td>
                    <td className="px-4 py-2">
                      {participant.preferred_instructor ? (
                        <span>
                          {participant.preferred_instructor.name}
                        </span>
                      ) : (
                        <span className="text-gray-500">No preference</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={participant.instructor_id || ''}
                        onChange={(e) => handleInstructorAssign(
                          classData.id,
                          participant.id,
                          e.target.value
                        )}
                        className="w-full border rounded p-1"
                      >
                        <option value="">Select instructor</option>
                        {instructors.map((instructor) => (
                          <option 
                            key={instructor.id} 
                            value={instructor.id}
                          >
                            {instructor.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={participant.payment_status || false}
                        onChange={(e) => handlePaymentStatusChange(
                          classData.id,
                          participant.id,
                          e.target.checked
                        )}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleRemoveSwimmer(classData.id, participant.id)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSchedule;