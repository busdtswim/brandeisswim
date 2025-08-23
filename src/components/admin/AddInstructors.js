'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  UserPlus, 
  Mail, 
  User, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Search,
  Users,
  Shield,
  Award,
  TrendingUp
} from 'lucide-react';

const AddInstructors = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  // Define displayMessage before it's used in other functions
  const displayMessage = useCallback((text, type) => {
    setMessage({ text, type });
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 5000);
  }, []);

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
        displayMessage(`Instructor ${data.name} added successfully! Login credentials will be sent when assigned to their first lesson.`, 'success');
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

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pool-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brandeis-blue to-pool-blue text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6">
              Manage Instructors
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-2">
              Add new swimming instructors and manage existing staff members
            </p>
            <div className="mt-6 md:mt-8 flex items-center justify-center space-x-2 text-blue-200">
              <Shield className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-base md:text-lg">Administrative Access</span>
            </div>
          </div>
        </div>
        
        {/* Floating Elements - Hidden on mobile to prevent overflow */}
        <div className="hidden md:block absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="hidden md:block absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Message Display */}
      {showMessage && message.text && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 md:-mt-8 relative z-10 mb-6 md:mb-8">
          <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl flex items-start shadow-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-red-500 mt-0.5 flex-shrink-0" />
            )}
            <span className="text-xs md:text-sm font-medium">{message.text}</span>
          </div>
        </div>
      )}

      {/* Add Instructor Form Section */}
      <div className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-brandeis-blue to-pool-blue mx-auto mb-4"></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Add New Instructor
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Create new instructor accounts to expand your teaching team
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/10 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                    Instructor Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 h-5 w-4 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-pool-blue focus:border-pool-blue transition-all duration-200 text-sm"
                      placeholder="Enter instructor's full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 h-5 w-4 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-pool-blue focus:border-pool-blue transition-all duration-200 text-sm"
                      placeholder="Enter instructor's email address"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-brandeis-blue to-pool-blue hover:from-pool-blue hover:to-brandeis-blue text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <UserPlus className="w-5 h-5 md:w-6 md:h-6 mr-2 inline" />
                  Add Instructor
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Current Instructors Section */}
      <div className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 md:p-6 lg:p-8 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Current Instructors</h2>
                  <p className="text-sm md:text-base text-gray-600">Manage your existing instructor team</p>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search instructors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64 rounded-lg md:rounded-xl border border-gray-300 py-2 md:py-3 px-3 md:px-4 text-sm focus:outline-none focus:ring-2 focus:ring-pool-blue focus:border-pool-blue transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInstructors.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-3 md:px-6 py-8 md:py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <Users className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mb-3 md:mb-4" />
                          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No instructors found</h3>
                          <p className="text-sm md:text-base text-gray-600">
                            {searchTerm ? 'Try adjusting your search terms.' : 'Add your first instructor to get started.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredInstructors.map((instructor) => (
                      <tr key={instructor.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-pool-blue flex items-center justify-center">
                                <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                              </div>
                            </div>
                            <div className="ml-3 md:ml-4">
                              <div className="text-sm md:text-base font-medium text-gray-900">
                                {instructor.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <div className="text-sm md:text-base text-gray-500">{instructor.email}</div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(instructor.id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-1 md:p-2 rounded-lg hover:bg-red-50"
                            title="Delete instructor"
                          >
                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInstructors;