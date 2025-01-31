// src/components/ExceptionDates.js
'use client';

import React, { useState } from 'react';
import { DateTime } from 'luxon';

const NY_TIMEZONE = 'America/New_York';

const ExceptionDates = ({ exceptions = [], onAdd, onRemove }) => {
  const [newDate, setNewDate] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!newDate) {
      setError('Please select a date');
      return;
    }

    try {
      const dt = DateTime.fromISO(newDate, { zone: NY_TIMEZONE });

      if (!dt.isValid) {
        setError('Invalid date format');
        return;
      }

      const formattedDate = dt.toISODate();

      if (!exceptions.includes(formattedDate)) {
        onAdd(formattedDate);
        setNewDate('');
        setError('');
      } else {
        setError('This date has already been added');
      }
    } catch (err) {
      console.error('Date processing error:', err, 'Input value:', newDate);
      setError('Error processing date');
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
          onChange={(e) => {
            console.log('Input value:', e.target.value); // Debug log
            setNewDate(e.target.value);
            setError('');
          }}
          className={`shadow appearance-none border rounded w-64 py-2 px-3 
            text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2
            ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 
            disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!newDate}
        >
          Add Exception
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        {exceptions.map((date) => {
          const displayDate = DateTime.fromISO(date, { zone: NY_TIMEZONE })
            .toLocaleString(DateTime.DATE_SHORT);
          return (
            <div
              key={date}
              className="bg-gray-100 px-3 py-1 rounded-full flex items-center space-x-2"
            >
              <span>{displayDate}</span>
              <button
                type="button"
                onClick={() => onRemove(date)}
                className="text-red-500 hover:text-red-700 font-bold"
                aria-label="Remove date"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExceptionDates;