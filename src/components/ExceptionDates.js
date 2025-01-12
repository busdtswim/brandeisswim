// src/components/ExceptionDates.js
'use client';

import React, { useState } from 'react';

const ExceptionDates = ({ exceptions = [], onAdd, onRemove }) => {
  const [newDate, setNewDate] = useState('');

  const handleAdd = () => {
    if (newDate && !exceptions.includes(newDate)) {
      onAdd(newDate);
      setNewDate('');
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Exception Dates (No Classes)
      </label>
      <div className="flex items-center mb-2">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="shadow appearance-none border rounded w-64 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Exception
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {exceptions.map((date) => (
          <div
            key={date}
            className="bg-gray-100 px-3 py-1 rounded-full flex items-center space-x-2"
          >
            <span>{new Date(date).toLocaleDateString()}</span>
            <button
              type="button"
              onClick={() => onRemove(date)}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExceptionDates;