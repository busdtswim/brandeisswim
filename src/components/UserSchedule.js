'use client';

import React from 'react';

const UserSchedule = ({ classData }) => {
  return (
    <div className="bg-white shadow-md rounded-lg mb-4 overflow-hidden">
      <div className="bg-blue-500 text-white p-4">
        <h3 className="text-lg font-semibold">{classData.meetingDays.join(', ')} lesson</h3>
      </div>
      <div className="p-4">
        <p><strong>Date Range:</strong> {classData.startDate} - {classData.endDate}</p>
        <p><strong>Time:</strong> {classData.time}</p>
        <p><strong>Days:</strong> {classData.meetingDays.join(', ')}</p>
      </div>
    </div>
  );
};

export default UserSchedule;