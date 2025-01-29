'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import UserClassSchedule from './UserSchedule';

const ViewUserSchedule = () => {
  const { data: session } = useSession();
  const [userClasses, setUserClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchUserClasses = async () => {
    try {
      const response = await fetch('/api/auth/customer/schedule');
      if (!response.ok) {
        throw new Error('Failed to fetch schedule');
      }
      const data = await response.json();
      setUserClasses(data);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUserClasses();
    }
  }, [session]);

  const handleScheduleUpdate = async () => {
    setLoading(true);
    await fetchUserClasses();
    setLoading(false);
  };

  const filteredClasses = userClasses.filter(classData => {
    const currentDate = new Date();
    const endDate = new Date(classData.endDate);
    
    if (filter === 'upcoming') {
      return endDate >= currentDate;
    } else if (filter === 'past') {
      return endDate < currentDate;
    }
    return true; 
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your schedule...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-8">My Class Schedule</h1>
      
      <div className="mb-4 flex items-center">
        <label htmlFor="filter" className="mr-2">Filter:</label>
        <select 
          id="filter" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Classes</option>
          <option value="upcoming">Upcoming Classes</option>
          <option value="past">Past Classes</option>
        </select>
      </div>

      {filteredClasses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p>No classes found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClasses.map(classData => (
            <UserClassSchedule 
              key={classData.id} 
              classData={classData} 
              onUpdate={handleScheduleUpdate} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewUserSchedule;