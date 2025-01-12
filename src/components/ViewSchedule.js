'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ClassSchedule from './ClassSchedule';
import EditExceptionsModal from './EditExceptionModal';

const ViewSchedule = () => {
  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignError, setAssignError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedLesson, setSelectedLesson] = useState(null);

  const fetchData = async () => {
    try {
      const [classesResponse, instructorsResponse] = await Promise.all([
        fetch('/api/auth/lessons/classes'),
        fetch('/api/auth/lessons/instructors')
      ]);

      if (!classesResponse.ok || !instructorsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const classesData = await classesResponse.json();
      const instructorsData = await instructorsResponse.json();

      setClasses(classesData);
      setInstructors(instructorsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredClasses = useMemo(() => {
    const currentDate = new Date();
    
    return classes.filter(classData => {
      const startDate = new Date(classData.startDate);
      const endDate = new Date(classData.endDate);
      
      switch (filter) {
        case 'past':
          return endDate < currentDate;
        case 'current':
          return startDate <= currentDate && endDate >= currentDate;
        case 'future':
          return startDate > currentDate;
        default:
          return true; // 'all' case
      }
    });
  }, [classes, filter]);

  const handleInstructorAssign = async (classId, swimmerId, instructorId) => {
    try {
      // First handle the instructor assignment
      const assignResponse = await fetch(`/api/auth/lessons/assign/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          swimmerId: parseInt(swimmerId),
          instructorId: instructorId ? parseInt(instructorId) : null
        }),
      });
  
      if (!assignResponse.ok) {
        const errorData = await assignResponse.json();
        throw new Error(errorData.error || 'Failed to assign instructor');
      }
  
      if (instructorId) {
        const classData = classes.find(cls => cls.id === parseInt(classId));
        const swimmer = classData.participants.find(p => p.id === parseInt(swimmerId));
        const instructor = instructors.find(i => i.id === parseInt(instructorId));
  
        try {
          const notifyResponse = await fetch('/api/auth/lessons/notify-instructor', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              instructor,
              swimmer,
              lessonDetails: {
                startDate: classData.startDate,
                endDate: classData.endDate,
                meetingDays: classData.meetingDays,
                time: classData.time,
              },
            }),
          });
  
          if (!notifyResponse.ok) {
            const errorData = await notifyResponse.json();
            console.error('Notification error details:', errorData);
            throw new Error(`Failed to send notification: ${errorData.error || 'Unknown error'}`);
          }
  
          const responseData = await notifyResponse.json();
        } catch (notifyError) {
          console.error('Error sending notification:', notifyError);
          setAssignError('Instructor assigned but notification failed to send');
        }
      }
  
      // Update UI state...
      setClasses(prevClasses => prevClasses.map(cls => {
        if (cls.id === parseInt(classId)) {
          return {
            ...cls,
            participants: cls.participants.map(p => {
              if (p.id === parseInt(swimmerId)) {
                const assignedInstructor = instructors.find(i => i.id === parseInt(instructorId));
                return {
                  ...p,
                  instructor_id: instructorId ? parseInt(instructorId) : null,
                  instructor: assignedInstructor || null
                };
              }
              return p;
            })
          };
        }
        return cls;
      }));
  
      setAssignError(null);
    } catch (err) {
      console.error('Error in handleInstructorAssign:', err);
      setAssignError(err.message);
    }
  };

  const handlePaymentStatusChange = async (classId, swimmerId, status) => {
    try {
      const response = await fetch('/api/auth/lessons/payment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: classId,
          swimmerId: swimmerId,
          status: status
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      setClasses(classes.map(cls => {
        if (cls.id === classId) {
          return {
            ...cls,
            participants: cls.participants.map(p => {
              if (p.id === swimmerId) {
                return { ...p, payment_status: status };
              }
              return p;
            })
          };
        }
        return cls;
      }));

    } catch (error) {
      console.error('Error updating payment status:', error);
      setAssignError('Failed to update payment status');
    }
  };

  const handleEditExceptionsUpdate = async (updatedLesson) => {
    try {
      setClasses(prevClasses => 
        prevClasses.map(cls => 
          cls.id === updatedLesson.id ? {
            ...cls,
            ...updatedLesson,
            startDate: updatedLesson.start_date || cls.startDate,
            endDate: updatedLesson.end_date || cls.endDate,
            meetingDays: Array.isArray(updatedLesson.meeting_days) 
              ? updatedLesson.meeting_days 
              : updatedLesson.meeting_days?.split(',') || [],
            exception_dates: updatedLesson.exception_dates || []
          } : cls
        )
      );
      setSelectedLesson(null);
      await fetchData();
    } catch (error) {
      console.error('Error updating exceptions:', error);
      setError('Failed to update exceptions');
    }
  };

  const handleRemoveSwimmer = async (classId, swimmerId) => {
    try {
      setClasses(prevClasses => prevClasses.map(cls => {
        if (cls.id === classId) {
          return {
            ...cls,
            participants: cls.participants.filter(p => p.id !== swimmerId)
          };
        }
        return cls;
      }));
    } catch (error) {
      console.error('Error removing swimmer:', error);
      setError('Failed to remove swimmer');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">View Schedule</h1>
        <div className="flex items-center space-x-4">
          <label htmlFor="filter" className="font-medium">Filter Classes:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-md p-2 bg-white"
          >
            <option value="all">All Classes</option>
            <option value="past">Past Classes</option>
            <option value="current">Current Classes</option>
            <option value="future">Future Classes</option>
          </select>
        </div>
      </div>

      {assignError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{assignError}</span>
        </div>
      )}

      <div className="space-y-4">
        {filteredClasses.map(classData => (
          <ClassSchedule 
            key={classData.id} 
            classData={classData}
            instructors={instructors}
            onInstructorAssign={handleInstructorAssign}
            onPaymentStatusChange={handlePaymentStatusChange}
            onEditExceptions={() => setSelectedLesson(classData)}
            onRemoveSwimmer={handleRemoveSwimmer}
          />
        ))}
      </div>

      <EditExceptionsModal
        isOpen={!!selectedLesson}
        onClose={() => setSelectedLesson(null)}
        lessonId={selectedLesson?.id}
        onUpdate={handleEditExceptionsUpdate} 
      />

      {filteredClasses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No classes found for the selected filter.
        </div>
      )}
    </div>
  );
};

export default ViewSchedule;