'use client';

import React, { useState, useEffect } from 'react';

const ViewWaitlist = () => {
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const fetchWaitlist = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/admin/waitlist');
      if (!response.ok) {
        throw new Error('Failed to fetch waitlist');
      }
      const data = await response.json();
      setWaitlist(data);
    } catch (err) {
      console.error('Error fetching waitlist:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const handleRemoveFromWaitlist = async (id) => {
    try {
      const response = await fetch(`/api/auth/admin/waitlist/${id}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to remove from waitlist');
      }

      setMessage('Swimmer removed from waitlist successfully');
      // Refresh the waitlist
      fetchWaitlist();
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error removing from waitlist:', err);
      setError(err.message);
    }
  };

  const handleClearWaitlist = async () => {
    if (window.confirm('Are you sure you want to clear the entire waitlist? This will mark all entries as inactive.')) {
      try {
        const response = await fetch('/api/auth/admin/waitlist', {
          method: 'PUT',
        });

        if (!response.ok) {
          throw new Error('Failed to clear waitlist');
        }

        const data = await response.json();
        setMessage(`Waitlist cleared successfully. ${data.count} entries were updated.`);
        
        // Refresh the waitlist
        fetchWaitlist();
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } catch (err) {
        console.error('Error clearing waitlist:', err);
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading waitlist...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-4">Swim Lesson Waitlist</h1>
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleClearWaitlist}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            disabled={waitlist.length === 0}
          >
            Clear Waitlist
          </button>
        </div>

        {waitlist.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No swimmers on the waitlist</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Position</th>
                  <th className="px-4 py-2 text-left">Swimmer Name</th>
                  <th className="px-4 py-2 text-left">Parent/Guardian</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Registration Date</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {waitlist.map((entry) => (
                  <tr key={entry.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{entry.position}</td>
                    <td className="px-4 py-2">{entry.swimmers.name}</td>
                    <td className="px-4 py-2">{entry.swimmers.users?.fullname || 'N/A'}</td>
                    <td className="px-4 py-2">{entry.swimmers.users?.email || 'N/A'}</td>
                    <td className="px-4 py-2">{entry.swimmers.users?.phone_number || 'N/A'}</td>
                    <td className="px-4 py-2">{new Date(entry.registration_date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleRemoveFromWaitlist(entry.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewWaitlist;