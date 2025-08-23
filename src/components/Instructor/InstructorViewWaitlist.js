'use client';

import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  AlertTriangle, 
  CheckCircle2, 
  Phone, 
  Search,
  User,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';

const InstructorViewWaitlist = () => {
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const filteredWaitlist = waitlist.filter(entry => 
    (entry.swimmer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.user_fullname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.user_email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pool-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Waitlist</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pool-blue to-brandeis-blue text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Waitlist Management
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              View and monitor waitlist entries for swim lessons
            </p>
            <div className="mt-8 flex items-center justify-center space-x-2 text-blue-200">
              <ClipboardList className="w-6 h-6" />
              <span className="text-lg">View Only - Instructor Access</span>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Stats Section */}
      <div className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="w-16 h-1 bg-gradient-to-r from-pool-blue to-brandeis-blue mx-auto mb-4"></div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Waitlist Overview
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Current status and statistics of waitlist entries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <ClipboardList className="w-8 h-8 text-blue-600" />
                </div>
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{waitlist.length}</h3>
              <p className="text-gray-600 font-medium">Total Entries</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-xl group-hover:bg-yellow-200 transition-colors">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {waitlist.filter(entry => entry.status === 'active').length}
              </h3>
              <p className="text-gray-600 font-medium">Active Entries</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {waitlist.filter(entry => entry.status === 'inactive').length}
              </h3>
              <p className="text-gray-600 font-medium">Processed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Table Section */}
      <div className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search swimmers, parents, or emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-pool-blue focus:border-pool-blue transition-all duration-200 text-sm"
              />
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
              {filteredWaitlist.length} of {waitlist.length} entries
            </div>
          </div>

          {/* Waitlist Table */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">
                Current Waitlist Entries ({filteredWaitlist.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Swimmer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Info
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredWaitlist.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8">
                            <div className="w-8 h-8 rounded-full bg-pool-blue flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {entry.swimmer_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {entry.user_email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Waiting
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {entry.user_phone_number && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="w-4 h-4 mr-1" />
                              <span>{entry.user_phone_number}</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredWaitlist.length === 0 && (
              <div className="text-center py-12">
                <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No matching entries' : 'No waitlist entries'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms.' : 'The waitlist is currently empty.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorViewWaitlist; 