'use client';

import React, { useState } from 'react';

const ClassSchedule = ({ classData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white shadow-md rounded-lg mb-4 overflow-hidden text-black">
      <div 
        className="bg-blue-500 text-white p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold">{classData.meetingDays.join(', ')} Swim</h3>
        <span>{isExpanded ? '▲' : '▼'}</span>
      </div>
      {isExpanded && (
        <div className="p-4">
          <p><strong>Date Range:</strong> {classData.startDate} - {classData.endDate}</p>
          <p><strong>Time:</strong> {classData.time}</p>
          <p><strong>Days:</strong> {classData.meetingDays.join(', ')}</p>
          <p><strong>Capacity:</strong> {classData.participants.length}/{classData.capacity}</p>
          <h4 className="font-semibold mt-4 mb-2">Participants:</h4>
          <ul className="list-disc pl-5">
            {classData.participants.map((participant, index) => (
              <li key={index}>{participant.name} - {participant.email}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClassSchedule;