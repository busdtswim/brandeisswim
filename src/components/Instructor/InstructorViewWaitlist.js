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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6">
              Waitlist Management
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-2">
              View and monitor waitlist entries for swim lessons
            </p>
            <div className="mt-6 md:mt-8 flex items-center justify-center space-x-2 text-blue-200">
              <ClipboardList className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-base md:text-lg">View Only - Instructor Access</span>
            </div>
          </div>
        </div>
        
        {/* Floating Elements - Hidden on mobile to prevent overflow */}
        <div className="hidden md:block absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="hidden md:block absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Stats Section */}
      <div className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-pool-blue to-brandeis-blue mx-auto mb-4"></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Waitlist Overview
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Current status and statistics of waitlist entries
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-blue-100 rounded-lg md:rounded-xl group-hover:bg-blue-200 transition-colors">
                  <ClipboardList className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                </div>
                <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-blue-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{waitlist.length}</h3>
              <p className="text-sm md:text-base text-gray-600 font-medium">Total Entries</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-yellow-100 rounded-lg md:rounded-xl group-hover:bg-yellow-200 transition-colors">
                  <Clock className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />
                </div>
                <AlertTriangle className="w-4 h-4 md:w-6 md:h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                {waitlist.filter(entry => entry.status === 'active').length}
              </h3>
              <p className="text-sm md:text-base text-gray-600 font-medium">Active Entries</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-green-100 rounded-lg md:rounded-xl group-hover:bg-green-200 transition-colors">
                  <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                </div>
                <Users className="w-4 h-4 md:w-6 md:h-6 text-green-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                {waitlist.filter(entry => entry.status === 'inactive').length}
              </h3>
              <p className="text-sm md:text-base text-gray-600 font-medium">Processed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Table Section */}
      <div className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 h-5 w-4 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search swimmers, parents, or emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-pool-blue focus:border-pool-blue transition-all duration-200 text-sm"
              />
            </div>
            <div className="text-xs md:text-sm text-gray-500 bg-gray-100 px-3 md:px-4 py-2 rounded-lg">
              {filteredWaitlist.length} of {waitlist.length} entries
            </div>
          </div>

          {/* Waitlist Table */}
          <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-base md:text-lg font-medium text-gray-900">
                Current Waitlist Entries ({filteredWaitlist.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Swimmer
                    </th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Info
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredWaitlist.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-pool-blue flex items-center justify-center">
                              <User className="w-3 h-3 md:w-4 md:h-4 text-white" />
                            </div>
                          </div>
                          <div className="ml-2 md:ml-4">
                            <div className="text-sm md:text-base font-medium text-gray-900">
                              {entry.swimmer_name}
                            </div>
                            <div className="text-xs md:text-sm text-gray-500">
                              {entry.user_email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 md:px-2.5 md:py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="w-3 h-3 md:w-3 md:h-3 mr-1" />
                          Waiting
                        </span>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {entry.user_phone_number && (
                            <div className="flex items-center text-xs md:text-sm text-gray-500">
                              <Phone className="w-3 h-3 md:w-4 md:h-4 mr-1" />
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
              <div className="text-center py-8 md:py-12">
                <ClipboardList className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No matching entries' : 'No waitlist entries'}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
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