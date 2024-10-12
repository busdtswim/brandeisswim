'use client';

import React, { useState } from 'react';
import ClassSchedule from './ClassSchedule';

const ViewSchedule = () => {
  const [classes, setClasses] = useState([
    {
      id: 1,
      startDate: '2024-03-01',
      endDate: '2024-03-28',
      time: '3:00 PM - 4:00 PM',
      meetingDays: ['Monday', 'Wednesday'],
      capacity: 10,
      participants: [
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' },
      ]
    },
    {
      id: 2,
      startDate: '2024-04-01',
      endDate: '2024-04-30',
      time: '5:00 PM - 6:30 PM',
      meetingDays: ['Tuesday', 'Thursday'],
      capacity: 8,
      participants: [
        { name: 'Alice Johnson', email: 'alice@example.com' },
        { name: 'Bob Williams', email: 'bob@example.com' },
      ]
    },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">View Schedule</h1>
      <div className="space-y-4">
        {classes.map(classData => (
          <ClassSchedule key={classData.id} classData={classData} />
        ))}
      </div>
    </div>
  );
};

export default ViewSchedule;