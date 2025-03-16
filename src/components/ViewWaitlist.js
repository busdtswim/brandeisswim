'use client';

import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Mail, 
  Phone, 
  Search 
} from 'lucide-react';

const ViewWaitlist = () => {
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showMessage, setShowMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchWaitlist = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/admin/waitlist');
      if (!response.ok) {
        throw new Error('Failed to fetch waitlist');
      }
      const data = await response.json();
      setWaitlist(data);
      setError(null);
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

  const displayMessage = (text, type) => {
    setMessage({ text, type });
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 5000);
  };

  const handleRemoveFromWaitlist = async (id) => {
    try {
      const response = await fetch(`/api/auth/admin/waitlist/${id}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to remove from waitlist');
      }

      displayMessage('Swimmer removed from waitlist successfully', 'success');
      fetchWaitlist();
    } catch (err) {
      console.error('Error removing from waitlist:', err);
      displayMessage(err.message || 'Failed to remove from waitlist', 'error');
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
        displayMessage(`Waitlist cleared successfully. ${data.count} entries were updated.`, 'success');
        fetchWaitlist();
      } catch (err) {
        console.error('Error clearing waitlist:', err);
        displayMessage(err.message || 'Failed to clear waitlist', 'error');
      }
    }
  };

  const filteredWaitlist = waitlist.filter(entry => 
    entry.swimmers.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.swimmers.users?.fullname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.swimmers.users?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="py-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Swim Lesson Waitlist</h1>
        <p className="text-gray-600">Manage and review swimmers who are waiting for available slots.</p>
      </div>
      
      {/* Notification message */}
      {showMessage && (
        <div className={`mb-6 p-4 rounded-lg flex items-start ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border-l-4 border-green-500' 
            : 'bg-red-50 text-red-800 border-l-4 border-red-500'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 mr-3 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 mr-3 mt-0.5" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      {/* Error display */}
      {error && !showMessage && (
        <div className="mb-6 p-4 rounded-lg flex items-start bg-red-50 text-red-800 border-l-4 border-red-500">
          <AlertTriangle className="w-5 h-5 mr-3 mt-0.5" />
          <div>
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Waitlist Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <ClipboardList className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Current Waitlist</h2>
              <span className="ml-2 px-2.5 py-0.5 text-sm rounded-full bg-blue-100 text-blue-800 font-medium">
                {waitlist.length} {waitlist.length === 1 ? 'Entry' : 'Entries'}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search waitlist..."
                  className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Clear button */}
              <button
                onClick={handleClearWaitlist}
                disabled={waitlist.length === 0}
                className={`
                  flex items-center px-4 py-2 rounded-lg text-sm font-medium 
                  ${waitlist.length === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                  }
                `}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Waitlist
              </button>
            </div>
          </div>
        </div>
        
        {waitlist.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No swimmers on the waitlist.</p>
          </div>
        ) : filteredWaitlist.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No entries match your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Swimmer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent/Guardian
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWaitlist.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        #{entry.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{entry.swimmers.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{entry.swimmers.users?.fullname || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-gray-500">
                          <Mail className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="truncate max-w-xs">{entry.swimmers.users?.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Phone className="w-4 h-4 mr-1 text-gray-400" />
                          <span>{entry.swimmers.users?.phone_number || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                        <span>{formatDate(entry.registration_date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleRemoveFromWaitlist(entry.id)}
                        className="text-red-600 hover:text-red-800 font-medium flex items-center ml-auto"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
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