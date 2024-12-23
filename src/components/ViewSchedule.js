'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ClassSchedule from './ClassSchedule';

const ViewSchedule = () => {
  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignError, setAssignError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
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
      const response = await fetch(`/api/auth/lessons/assign/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          swimmerId: parseInt(swimmerId),
          instructorId: instructorId ? parseInt(instructorId) : null
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: 'Failed to parse error response'
        }));
        throw new Error(errorData.error || 'Failed to assign instructor');
      }
  
      const updatedAssignment = await response.json();
  
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
      console.error('Error assigning instructor:', err);
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
          />
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No classes found for the selected filter.
        </div>
      )}
    </div>
  );
};

export default ViewSchedule;