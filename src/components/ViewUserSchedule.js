'use client';

import React, { useState, useEffect } from 'react';
import UserClassSchedule from './UserSchedule';

const ViewUserSchedule = () => {
  const [userClasses, setUserClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'

  // Simulating an API call to get user's classes
  useEffect(() => {
    const fetchUserClasses = async () => {
      // In a real application, this would be an API call
      const mockUserClasses = [
        {
          id: 1,
          startDate: '2024-03-01',
          endDate: '2024-03-28',
          time: '3:00 PM - 4:00 PM',
          meetingDays: ['Monday', 'Wednesday'],
        },
        {
          id: 2,
          startDate: '2024-04-01',
          endDate: '2024-04-30',
          time: '4:30 PM - 6:00 PM',
          meetingDays: ['Tuesday', 'Thursday'],
        },
      ];

      setUserClasses(mockUserClasses);
      setLoading(false);
    };

    fetchUserClasses();
  }, []);

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
    return <div>Loading your schedule...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-8">My Class Schedule</h1>
      
      <div className="mb-4">
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
        <p>No classes found.</p>
      ) : (
        <div className="space-y-4">
          {filteredClasses.map(classData => (
            <UserClassSchedule key={classData.id} classData={classData} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewUserSchedule;