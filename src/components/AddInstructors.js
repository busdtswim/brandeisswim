'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  UserPlus, 
  Mail, 
  User, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Search 
} from 'lucide-react';

const AddInstructors = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  const fetchInstructors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/admin/add');
      if (response.ok) {
        const data = await response.json();
        setInstructors(data);
      } else {
        displayMessage('Failed to fetch instructors', 'error');
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      displayMessage('An error occurred while fetching instructors', 'error');
    } finally {
      setLoading(false);
    }
  }, [displayMessage]);

  const displayMessage = (text, type) => {
    setMessage({ text, type });
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      displayMessage('Please fill in all fields', 'error');
      return;
    }

    try {
      const response = await fetch('/api/auth/admin/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (response.ok) {
        const data = await response.json();
        displayMessage(`Instructor ${data.name} added successfully!`, 'success');
        setName('');
        setEmail('');
        fetchInstructors();
      } else {
        const error = await response.json();
        displayMessage(`Error: ${error.message}`, 'error');
      }
    } catch (error) {
      console.error('Error adding instructor:', error);
      displayMessage('An error occurred while adding the instructor', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      try {
        const response = await fetch(`/api/auth/admin/add/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          displayMessage('Instructor deleted successfully!', 'success');
          fetchInstructors();
        } else {
          const error = await response.json();
          displayMessage(`Error: ${error.message}`, 'error');
        }
      } catch (error) {
        console.error('Error deleting instructor:', error);
        displayMessage('An error occurred while deleting the instructor', 'error');
      }
    }
  };

  const filteredInstructors = instructors.filter(
    instructor => 
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Manage Instructors</h1>
        <p className="text-gray-600">Add, view, and manage instructors for your swim lessons.</p>
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Add Instructor Form */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-6 text-gray-900 flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-blue-600" />
              Add New Instructor
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 block w-full rounded-lg border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full rounded-lg border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="instructor@example.com"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Add Instructor
              </button>
            </form>
          </div>
        </div>
        
        {/* Instructors List */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-gray-900">Instructor List</h2>
                
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search instructors..."
                    className="pl-10 w-full sm:w-64 rounded-lg border border-gray-300 py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {instructors.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No instructors found. Add your first instructor above.</p>
              </div>
            ) : filteredInstructors.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No instructors match your search criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInstructors.map((instructor) => (
                      <tr key={instructor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {instructor.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{instructor.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500">{instructor.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDelete(instructor.id)}
                            className="text-red-600 hover:text-red-800 font-medium flex items-center ml-auto"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
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
      </div>
    </div>
  );
};

export default AddInstructors;