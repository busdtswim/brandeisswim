'use client';

import React, { useState } from 'react';
import { DateTime } from 'luxon';
import { X, Calendar, Plus, AlertTriangle } from 'lucide-react';

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
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        <Calendar className="w-4 h-4 inline mr-1 text-gray-500" /> Exception Dates (No Classes)
      </label>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow relative">
          <input
            type="date"
            value={newDate}
            onChange={(e) => {
              setNewDate(e.target.value);
              setError('');
            }}
            className={`w-full rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newDate}
          className={`
            flex items-center justify-center rounded-lg py-2 px-4 text-sm font-medium transition-colors
            ${!newDate 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'}
          `}
        >
          <Plus className="w-4 h-4 mr-1" /> Add Exception
        </button>
      </div>
      
      {error && (
        <div className="flex items-center text-sm text-red-600">
          <AlertTriangle className="w-4 h-4 mr-1" />
          <p>{error}</p>
        </div>
      )}
      
      {/* Exception date tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        {exceptions.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No exception dates added yet</p>
        ) : (
          exceptions.map((date) => {
            const displayDate = DateTime.fromISO(date, { zone: NY_TIMEZONE })
              .toLocaleString(DateTime.DATE_SHORT);
            return (
              <div
                key={date}
                className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                <span>{displayDate}</span>
                <button
                  type="button"
                  onClick={() => onRemove(date)}
                  className="text-blue-500 hover:text-blue-700 p-0.5 rounded-full hover:bg-blue-100"
                  aria-label="Remove date"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ExceptionDates;