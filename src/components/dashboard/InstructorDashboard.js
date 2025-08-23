'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  User, 
  Calendar, 
  ClipboardList, 
  Search,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2
} from 'lucide-react';

const InstructorDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('user');
  const [sortColumn, setSortColumn] = useState('fullname');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [expandedUsers, setExpandedUsers] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSwimmers: 0,
    activeClasses: 0,
    waitlistEntries: 0
  });
  const [coverageStats, setCoverageStats] = useState({
    total_requests: 0,
    pending_requests: 0,
    accepted_requests: 0,
    covering_for_others: 0
  });

  useEffect(() => {
    // Check if user needs to change password
    if (session?.user?.must_change_password) {
      router.push(`/change-password/${session.user.one_time_login_token || 'expired'}`);
      return;
    }
  }, [session, router]);

  useEffect(() => {
    fetchUsers();
    fetchStats();
    fetchCoverageStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/auth/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalUsers: data.totalUsers,
          totalSwimmers: data.totalSwimmers,
          activeClasses: data.activeClasses,
          waitlistEntries: data.waitlistEntries
        });
      } else {
        console.error('Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchCoverageStats = async () => {
    try {
      const response = await fetch('/api/auth/instructor/coverage');
      if (response.ok) {
        const data = await response.json();
        setCoverageStats(data.stats || {});
      } else {
        console.error('Failed to fetch coverage statistics');
      }
    } catch (error) {
      console.error('Error fetching coverage statistics:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort logic (same as admin dashboard)
  const filteredUsers = users.filter(user => {
    if (filterType === 'admin') return user.role === 'admin';
    if (filterType === 'customer') return user.role === 'customer';
    if (filterType === 'instructor') return user.role === 'instructor';
    return user.role !== 'admin'; // Show customers and instructors by default
  }).filter(user => 
    user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.swimmers?.some(swimmer => 
      swimmer.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue = a[sortColumn] || '';
    let bValue = b[sortColumn] || '';
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Check if user needs to change password
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pool-blue"></div>
      </div>
    );
  }

  if (session?.user?.must_change_password) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pool-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to password change...</p>
        </div>
      </div>
    );
  }

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const toggleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const toggleUserExpansion = (userId) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

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
      <div className="relative overflow-hidden bg-gradient-to-br from-pool-blue to-brandeis-blue text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6">
              Instructor Dashboard
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-2">
              Manage your classes, view schedules, and handle coverage requests with ease
            </p>
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link 
                href="/instructor/view-schedule"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 hover:bg-white/20"
              >
                View Schedule
              </Link>
              <Link 
                href="/instructor/coverage"
                className="bg-pool-blue hover:bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Manage Coverage
              </Link>
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
              Your Overview
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Key metrics and insights about your classes and students
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-blue-100 rounded-lg md:rounded-xl group-hover:bg-blue-200 transition-colors">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                </div>
                <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-blue-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{stats.totalUsers}</h3>
              <p className="text-sm md:text-base text-gray-600 font-medium">Total Users</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-cyan-100 rounded-lg md:rounded-xl group-hover:bg-cyan-200 transition-colors">
                  <User className="w-6 h-6 md:w-8 md:h-8 text-cyan-600" />
                </div>
                <Award className="w-4 h-4 md:w-6 md:h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{stats.totalSwimmers}</h3>
              <p className="text-sm md:text-base text-gray-600 font-medium">Total Swimmers</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-purple-100 rounded-lg md:rounded-xl group-hover:bg-purple-200 transition-colors">
                  <Calendar className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                </div>
                <Clock className="w-4 h-4 md:w-6 md:h-6 text-purple-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{stats.activeClasses}</h3>
              <p className="text-sm md:text-base text-gray-600 font-medium">Active Classes</p>
            </div>

            <div className="bg-gradient-to-br from-pool-blue/10 to-brandeis-blue/10 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-pool-blue/20 rounded-lg md:rounded-xl group-hover:bg-pool-blue/30 transition-colors">
                  <ClipboardList className="w-6 h-6 md:w-8 md:h-8 text-pool-blue" />
                </div>
                <CheckCircle2 className="w-4 h-4 md:w-6 md:h-6 text-pool-blue/60" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{stats.waitlistEntries}</h3>
              <p className="text-sm md:text-base text-gray-600 font-medium">Waitlist Entries</p>
            </div>
          </div>

          {/* Coverage Stats */}
          <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl shadow-sm border border-gray-200 p-4 md:p-6 lg:p-8">
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Coverage Management</h3>
              <p className="text-sm md:text-base text-gray-600">Current status of your coverage requests and assignments</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center p-3 md:p-4 bg-red-50 rounded-lg md:rounded-xl">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-red-600 mb-1">{coverageStats.total_requests}</h4>
                <p className="text-xs md:text-sm text-red-700 font-medium">Total Requests</p>
              </div>
              
              <div className="text-center p-3 md:p-4 bg-yellow-50 rounded-lg md:rounded-xl">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-yellow-600 mb-1">{coverageStats.pending_requests}</h4>
                <p className="text-xs md:text-sm text-yellow-700 font-medium">Pending</p>
              </div>
              
              <div className="text-center p-3 md:p-4 bg-green-50 rounded-lg md:rounded-xl">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-green-600 mb-1">{coverageStats.accepted_requests}</h4>
                <p className="text-xs md:text-sm text-green-700 font-medium">Accepted</p>
              </div>
              
              <div className="text-center p-3 md:p-4 bg-blue-50 rounded-lg md:rounded-xl">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-blue-600 mb-1">{coverageStats.covering_for_others}</h4>
                <p className="text-xs md:text-sm text-blue-700 font-medium">Covering Others</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-pool-blue to-brandeis-blue mx-auto mb-4"></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Access your most important tools and information quickly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Link href="/instructor/view-schedule" className="group">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full">
                <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
                  <div className="p-2 md:p-3 bg-blue-100 rounded-lg md:rounded-xl group-hover:bg-blue-200 transition-colors">
                    <Calendar className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">View Schedule</h3>
                    <p className="text-sm md:text-base text-gray-600">Check lesson schedules and instructor assignments</p>
                  </div>
                </div>
                <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                  <span className="text-sm md:text-base">Access Schedule</span>
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/instructor/waitlist" className="group">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full">
                <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
                  <div className="p-2 md:p-3 bg-cyan-100 rounded-lg md:rounded-xl group-hover:bg-cyan-200 transition-colors">
                    <ClipboardList className="w-6 h-6 md:w-8 md:h-8 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-cyan-600 transition-colors">View Waitlist</h3>
                    <p className="text-sm md:text-base text-gray-600">Check waitlist status and requests</p>
                  </div>
                </div>
                <div className="flex items-center text-cyan-600 font-medium group-hover:text-cyan-700 transition-colors">
                  <span className="text-sm md:text-base">Check Waitlist</span>
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/instructor/coverage" className="group">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full">
                <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
                  <div className="p-2 md:p-3 bg-purple-100 rounded-lg md:rounded-xl group-hover:bg-purple-200 transition-colors">
                    <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Coverage Management</h3>
                    <p className="text-sm md:text-base text-gray-600">Request and manage lesson coverage</p>
                  </div>
                </div>
                <div className="flex items-center text-purple-600 font-medium group-hover:text-purple-700 transition-colors">
                  <span className="text-sm md:text-base">Manage Coverage</span>
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Users and Swimmers Section */}
      <div className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 md:p-6 lg:p-8 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Users & Swimmers</h2>
                  <p className="text-sm md:text-base text-gray-600">View and search through user and swimmer information</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users or swimmers..."
                      className="pl-10 w-full sm:w-64 rounded-lg md:rounded-xl border border-gray-300 py-2 md:py-3 px-3 md:px-4 text-sm focus:outline-none focus:ring-2 focus:ring-pool-blue focus:border-pool-blue transition-all duration-200"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Table content (same structure as admin dashboard but without action buttons) */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => toggleSort('fullname')}
                        className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                      >
                        <span>Name</span>
                        {sortColumn === 'fullname' && (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => toggleSort('email')}
                        className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                      >
                        <span>Email</span>
                        {sortColumn === 'email' && (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Swimmers
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.map((user) => (
                    <React.Fragment key={user.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900 text-sm md:text-base">{user.fullname || 'N/A'}</div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <div className="text-gray-500 text-sm md:text-base">{user.email}</div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <div className="text-gray-500 text-sm md:text-base">{user.phone_number || 'N/A'}</div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          {user.swimmers && user.swimmers.length > 0 ? (
                            <button
                              onClick={() => toggleUserExpansion(user.id)}
                              className="flex items-center text-pool-blue hover:text-brandeis-blue transition-colors"
                            >
                              <span className="mr-1 text-sm md:text-base">{user.swimmers.length} swimmer{user.swimmers.length !== 1 ? 's' : ''}</span>
                              {expandedUsers.has(user.id) ? 
                                <ChevronUp className="w-4 h-4" /> : 
                                <ChevronRight className="w-4 h-4" />
                              }
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm md:text-base">No swimmers</span>
                          )}
                        </td>
                      </tr>
                      
                      {/* Expanded swimmer details */}
                      {expandedUsers.has(user.id) && user.swimmers && user.swimmers.length > 0 && (
                        <tr>
                          <td colSpan="5" className="px-3 md:px-6 py-2 bg-gray-50">
                            <div className="space-y-2">
                              {user.swimmers.map((swimmer, index) => (
                                <div key={index} className="flex items-center justify-between p-2 md:p-3 bg-white rounded-lg md:rounded-xl border border-gray-200">
                                  <div className="flex items-center space-x-2 md:space-x-4">
                                    <div className="flex-shrink-0 h-6 w-6 md:h-8 md:w-8 rounded-full bg-pool-blue/20 flex items-center justify-center">
                                      <span className="text-pool-blue font-medium text-xs md:text-sm">
                                        {swimmer.name ? swimmer.name.charAt(0).toUpperCase() : 'S'}
                                      </span>
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900 text-sm md:text-base">{swimmer.name}</div>
                                      <div className="text-xs md:text-sm text-gray-500">
                                        {swimmer.proficiency && `${swimmer.proficiency} • `}
                                        {swimmer.gender && `${swimmer.gender} • `}
                                        {swimmer.birthdate && `Born: ${swimmer.birthdate}`}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-3 md:px-6 py-3 md:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs md:text-sm text-gray-700">Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-pool-blue focus:border-pool-blue"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                  </select>
                  <span className="text-xs md:text-sm text-gray-700">entries</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  
                  <span className="text-xs md:text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard; 