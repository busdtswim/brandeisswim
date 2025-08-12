'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  User, 
  Calendar, 
  ClipboardList, 
  Search,
  UserX,
  UserMinus,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  CalendarPlus,
  UserPlus
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
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

  useEffect(() => {
    fetchUsers();
    fetchStats();
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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        // Update stats after fetching users
        setStats(prev => ({
          ...prev,
          totalUsers: data.length,
          totalSwimmers: data.reduce((sum, user) => sum + user.swimmers.length, 0)
        }));
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserExpanded = (userId) => {
    setExpandedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredUsers = React.useMemo(() => {
    return users.filter(user => {
      if (filterType === 'user') {
        return (
          user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone_number?.includes(searchTerm)
        );
      } else {
        return user.swimmers.some(swimmer =>
          swimmer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          swimmer.proficiency?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }).sort((a, b) => {
      const aValue = a[sortColumn] || '';
      const bValue = b[sortColumn] || '';
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [users, searchTerm, filterType, sortColumn, sortDirection]);

  const paginatedUsers = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleDeleteSwimmer = async (swimmer) => {
    if (confirm('Are you sure you want to delete this swimmer?')) {
      try {
        const response = await fetch(`/api/auth/admin/swimmers/${swimmer.id}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete swimmer');
        }
  
        setUsers(prevUsers => 
          prevUsers.map(user => ({
            ...user,
            swimmers: user.swimmers.filter(s => s.id !== swimmer.id)
          }))
        );
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalSwimmers: prev.totalSwimmers - 1
        }));
      } catch (error) {
        console.error('Error deleting swimmer:', error);
        toast.error(error.message || 'Failed to delete swimmer. Please try again.');
      }
    }
  };
  
  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user and all associated swimmers?')) {
      try {
        const response = await fetch(`/api/auth/admin/users/${userId}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete user');
        }
        
        const userToDelete = users.find(user => user.id === userId);
        const swimmersCount = userToDelete?.swimmers.length || 0;
        
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalUsers: prev.totalUsers - 1,
          totalSwimmers: prev.totalSwimmers - swimmersCount
        }));
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error(error.message || 'Failed to delete user. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, swimmers, lessons, and more from your admin dashboard.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50 mr-4">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Swimmers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSwimmers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-50 mr-4">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Active Classes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeClasses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-50 mr-4">
              <ClipboardList className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Waitlist Entries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.waitlistEntries}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6">Manage Users</h2>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center mb-4">
            <div className="w-full md:w-1/2 lg:w-1/3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={filterType === 'user' ? "Search users..." : "Search swimmers..."}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="user">Filter Users</option>
                <option value="swimmer">Filter Swimmers</option>
              </select>
              
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('fullname')} className="flex items-center">
                    <span>Full Name</span>
                    <span className="ml-1">
                      {sortColumn === 'fullname' ? (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      ) : null}
                    </span>
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('email')} className="flex items-center">
                    <span>Email</span>
                    <span className="ml-1">
                      {sortColumn === 'email' ? (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      ) : null}
                    </span>
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('phone_number')} className="flex items-center">
                    <span>Phone</span>
                    <span className="ml-1">
                      {sortColumn === 'phone_number' ? (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      ) : null}
                    </span>
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Swimmers
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No users found matching your search criteria
                  </td>
                </tr>
              ) : (
                paginatedUsers.map(user => (
                  <React.Fragment key={user.id}>
                    <tr className={`hover:bg-gray-50 ${expandedUsers.has(user.id) ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{user.fullname}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">{user.phone_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleUserExpanded(user.id)}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <span className="font-medium">{user.swimmers.length}</span>
                          <span className="ml-1.5 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {user.swimmers.length === 1 ? 'Swimmer' : 'Swimmers'}
                          </span>
                          {expandedUsers.has(user.id) ? (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronRight className="ml-1 h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 inline-flex items-center font-medium"
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                    {expandedUsers.has(user.id) && (
                      <tr>
                        <td colSpan="5" className="px-6 py-3 bg-blue-50">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border rounded-lg bg-white">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                  </th>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Age
                                  </th>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Gender
                                  </th>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Proficiency
                                  </th>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Lessons
                                  </th>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {user.swimmers.length === 0 ? (
                                  <tr>
                                    <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                                      No swimmers found for this user
                                    </td>
                                  </tr>
                                ) : (
                                  user.swimmers.map(swimmer => (
                                    <tr key={swimmer.id} className="hover:bg-gray-50">
                                      <td className="px-4 py-2 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{swimmer.name}</div>
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap text-gray-500">
                                        {swimmer.age || 'N/A'}
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap text-gray-500 capitalize">
                                        {swimmer.gender}
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          swimmer.proficiency === 'beginner' ? 'bg-blue-100 text-blue-800' :
                                          swimmer.proficiency === 'intermediate' ? 'bg-green-100 text-green-800' :
                                          swimmer.proficiency === 'advanced' ? 'bg-purple-100 text-purple-800' :
                                          'bg-gray-100 text-gray-800'
                                        }`}>
                                          {swimmer.proficiency || 'N/A'}
                                        </span>
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap text-gray-500">
                                        {swimmer.total_lessons || 0}
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap">
                                        <button
                                          onClick={() => handleDeleteSwimmer(swimmer)}
                                          className="text-red-600 hover:text-red-800 inline-flex items-center text-sm font-medium"
                                        >
                                          <UserMinus className="h-4 w-4 mr-1" />
                                          Delete
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
              </span>{' '}
              of <span className="font-medium">{filteredUsers.length}</span> users
            </div>
            
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
                  ${currentPage === 1 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'}`}
              >
                Previous
              </button>
              
              {totalPages <= 5 ? (
                [...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
                      ${currentPage === i + 1 
                        ? 'bg-blue-50 text-blue-600 border border-blue-300 z-10' 
                        : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'}`}
                  >
                    {i + 1}
                  </button>
                ))
              ) : (
                <>
                  {/* First page */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
                      ${currentPage === 1 
                        ? 'bg-blue-50 text-blue-600 border border-blue-300 z-10' 
                        : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'}`}
                  >
                    1
                  </button>
                  
                  {/* Ellipsis if needed */}
                  {currentPage > 3 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                      ...
                    </span>
                  )}
                  
                  {/* Current page and adjacent pages */}
                  {[...Array(5)].map((_, i) => {
                    const pageNum = Math.max(2, currentPage - 1) + i;
                    if (pageNum > 1 && pageNum < totalPages) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
                            ${currentPage === pageNum 
                              ? 'bg-blue-50 text-blue-600 border border-blue-300 z-10' 
                              : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}
                  
                  {/* Ellipsis if needed */}
                  {currentPage < totalPages - 2 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                      ...
                    </span>
                  )}
                  
                  {/* Last page */}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
                      ${currentPage === totalPages 
                        ? 'bg-blue-50 text-blue-600 border border-blue-300 z-10' 
                        : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'}`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
                  ${currentPage === totalPages 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;