'use client';

import React, { useState, useEffect } from 'react';
import ClassSchedule from './ClassSchedule';

const ViewSchedule = () => {
  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignError, setAssignError] = useState(null);

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

  const handleInstructorAssign = async (classId, instructorId) => {
    try {
      const response = await fetch(`/api/auth/lessons/assign/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instructorId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to assign instructor');
      }
  
      // Find the full instructor object
      const assignedInstructor = instructors.find(instructor => instructor.id === parseInt(instructorId));
  
      // Update local state
      setClasses(classes.map(cls => 
        cls.id === parseInt(classId)
          ? { 
              ...cls, 
              instructor_id: parseInt(instructorId),
              instructor: assignedInstructor || null // Update the instructor object
            }
          : cls
      ));
  
      // Clear any previous error
      setAssignError(null);
    } catch (err) {
      console.error('Error assigning instructor:', err);
      setAssignError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-8">View Schedule</h1>
      {assignError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{assignError}</span>
        </div>
      )}
      <div className="space-y-4">
        {classes.map(classData => (
          <ClassSchedule 
            key={classData.id} 
            classData={classData} 
            instructors={instructors}
            onInstructorAssign={handleInstructorAssign}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewSchedule;