'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Users, Book, ChevronDown, ChevronUp } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('user');
  const [sortColumn, setSortColumn] = useState('fullname');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [expandedUsers, setExpandedUsers] = useState(new Set());

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/auth/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
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

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (filterType === 'user') {
        return (
          user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone_number.includes(searchTerm)
        );
      } else {
        return user.swimmers.some(swimmer =>
          swimmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          swimmer.proficiency.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }).sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [users, searchTerm, filterType, sortColumn, sortDirection]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

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
      } catch (error) {
        console.error('Error deleting swimmer:', error);
        alert(error.message || 'Failed to delete swimmer. Please try again.');
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
  
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(error.message || 'Failed to delete user. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <Users className="text-blue-500 mr-4" size={48} />
          <div>
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="text-gray-500">Total Users</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <Book className="text-orange-500 mr-4" size={48} />
          <div>
            <p className="text-2xl font-bold">
              {users.reduce((sum, user) => sum + user.swimmers.length, 0)}
            </p>
            <p className="text-gray-500">Total Swimmers</p>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-4 border-b border-gray-200 flex items-center gap-4">
          <select
            className="px-3 py-2 border rounded-md"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="user">Filter Users</option>
            <option value="swimmer">Filter Swimmers</option>
          </select>
          <input
            type="text"
            placeholder={filterType === 'user' ? "Search users..." : "Search swimmers..."}
            className="flex-grow px-3 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-3 py-2 border rounded-md"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">
                  <button onClick={() => handleSort('fullname')} className="font-semibold text-gray-600 hover:text-gray-900">
                    Full Name
                  </button>
                </th>
                <th className="px-4 py-2 text-left">
                  <button onClick={() => handleSort('email')} className="font-semibold text-gray-600 hover:text-gray-900">
                    Email
                  </button>
                </th>
                <th className="px-4 py-2 text-left">
                  <button onClick={() => handleSort('phone_number')} className="font-semibold text-gray-600 hover:text-gray-900">
                    Phone Number
                  </button>
                </th>
                <th className="px-4 py-2 text-left">Swimmers</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(user => (
                <React.Fragment key={user.id}>
                  <tr className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{user.fullname}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.phone_number}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => toggleUserExpanded(user.id)}
                        className="flex items-center text-blue-500 hover:text-blue-700"
                      >
                        {user.swimmers.length} Swimmers
                        {expandedUsers.has(user.id) ? 
                          <ChevronUp className="ml-1" size={16} /> : 
                          <ChevronDown className="ml-1" size={16} />
                        }
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => {
                          handleDeleteUser(user.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete User
                      </button>
                    </td>
                  </tr>
                  {expandedUsers.has(user.id) && (
                    <tr>
                      <td colSpan="5" className="bg-gray-50 px-8 py-4">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Age</th>
                                <th className="px-4 py-2 text-left">Gender</th>
                                <th className="px-4 py-2 text-left">Proficiency</th>
                                <th className="px-4 py-2 text-left">Total Lessons</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {user.swimmers.map(swimmer => (
                                <tr key={swimmer.id} className="border-t">
                                  <td className="px-4 py-2">{swimmer.name}</td>
                                  <td className="px-4 py-2">{swimmer.age || 'N/A'}</td>
                                  <td className="px-4 py-2">{swimmer.gender}</td>
                                  <td className="px-4 py-2">{swimmer.proficiency}</td>
                                  <td className="px-4 py-2">{swimmer.total_lessons}</td>
                                  <td className="px-4 py-2">
                                  <td className="px-4 py-2">
                                    <button
                                      className="text-red-500 hover:text-red-700"
                                      onClick={() => {
                                        handleDeleteSwimmer(swimmer);
                                      }}
                                    >
                                      Delete Swimmer
                                    </button>
                                  </td>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Previous
              </button>
              {[...Array(Math.ceil(filteredUsers.length / itemsPerPage))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === i + 1 ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(page => Math.min(Math.ceil(filteredUsers.length / itemsPerPage), page + 1))}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;