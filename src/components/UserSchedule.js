'use client';

import React from 'react';

const UserSchedule = ({ classData }) => {
  const isUpcoming = new Date(classData.endDate) >= new Date();

  return (
    <div className="bg-white shadow-md rounded-lg mb-4 overflow-hidden">
      <div className={`p-4 ${isUpcoming ? 'bg-blue-500' : 'bg-gray-500'} text-white`}>
        <h3 className="text-lg font-semibold">{classData.swimmerName}'s {classData.meetingDays.join(', ')} Lesson</h3>
      </div>
      <div className="p-4 space-y-2">
        <p>
          <span className="font-semibold">Date Range:</span> 
          {new Date(classData.startDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })} - {new Date(classData.endDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
        <p><span className="font-semibold">Time:</span> {classData.time}</p>
        <p><span className="font-semibold">Days:</span> {classData.meetingDays.join(', ')}</p>
        {classData.instructor && (
          <p>
            <span className="font-semibold">Instructor:</span> {classData.instructor.name}
          </p>
        )}
        <div className={`mt-2 inline-block px-2 py-1 rounded text-sm ${
          isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {isUpcoming ? 'Upcoming' : 'Past'} Class
        </div>
      </div>
    </div>
  );
};

export default UserSchedule;