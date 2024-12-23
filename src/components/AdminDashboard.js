'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Users, Book } from 'lucide-react';
import AdminActionModal from './AdminActionModal';

const AdminDashboard = () => {
  const [swimmers, setSwimmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedSwimmer, setSelectedSwimmer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSwimmers = async () => {
      try {
        const response = await fetch('/api/auth/admin/swimmers');
        if (response.ok) {
          const data = await response.json();
          setSwimmers(data);
        } else {
          console.error('Failed to fetch swimmers');
        }
      } catch (error) {
        console.error('Error fetching swimmers:', error);
      }
    };

    fetchSwimmers();
  }, []);

  const handleDelete = async (swimmerId) => {
    if (confirm('Are you sure you want to delete this swimmer?')) {
      try {
        const response = await fetch(`/api/auth/admin/swimmers/${swimmerId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setSwimmers(swimmers.filter(s => s.id !== swimmerId));
          setIsModalOpen(false);
        }
      } catch (error) {
        console.error('Error deleting swimmer:', error);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user and all associated swimmers?')) {
      try {
        const response = await fetch(`/api/auth/admin/users/${userId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setSwimmers(swimmers.filter(s => s.user_id !== userId));
          setIsModalOpen(false);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleBanUser = async (userId) => {
    try {
      const response = await fetch(`/api/auth/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_banned: true })
      });
      
      if (response.ok) {
        alert('User has been banned');
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const filteredSwimmers = useMemo(() => {
    return swimmers
      .filter(swimmer => 
        swimmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        swimmer.proficiency.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [swimmers, searchTerm, sortColumn, sortDirection]);

  const paginatedSwimmers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSwimmers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSwimmers, currentPage, itemsPerPage]);

  const pageCount = Math.ceil(filteredSwimmers.length / itemsPerPage);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
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
            <p className="text-2xl font-bold">{swimmers.length}</p>
            <p className="text-gray-500">Total Swimmers</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <Book className="text-orange-500 mr-4" size={48} />
          <div>
            <p className="text-2xl font-bold">{swimmers.reduce((sum, swimmer) => sum + (swimmer.total_lessons || 0), 0)}</p>
            <p className="text-gray-500">Total Lessons Booked</p>
          </div>
        </div>
      </div>
      
      {/* Swimmers Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-4 border-b border-gray-200 flex items-center">
          <input
            type="text"
            placeholder="Search swimmers..."
            className="flex-grow px-3 py-2 border rounded-md mr-4"
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
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">
                <button onClick={() => handleSort('name')} className="font-semibold text-gray-600 hover:text-gray-900">
                  Name
                </button>
              </th>
              <th className="px-4 py-2 text-left">
                <button onClick={() => handleSort('age')} className="font-semibold text-gray-600 hover:text-gray-900">
                  Age
                </button>
              </th>
              <th className="px-4 py-2 text-left">
                <button onClick={() => handleSort('gender')} className="font-semibold text-gray-600 hover:text-gray-900">
                  Gender
                </button>
              </th>
              <th className="px-4 py-2 text-left">
                <button onClick={() => handleSort('proficiency')} className="font-semibold text-gray-600 hover:text-gray-900">
                  Proficiency
                </button>
              </th>
              <th className="px-4 py-2 text-left">
                <button onClick={() => handleSort('total_lessons')} className="font-semibold text-gray-600 hover:text-gray-900">
                  Total Lessons
                </button>
              </th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSwimmers.map(swimmer => (
              <tr key={swimmer.id}>
                <td className="px-4 py-2">{swimmer.name}</td>
                <td className="px-4 py-2">{swimmer.age || 'N/A'}</td>
                <td className="px-4 py-2">{swimmer.gender}</td>
                <td className="px-4 py-2">{swimmer.proficiency}</td>
                <td className="px-4 py-2">{swimmer.total_lessons || 0}</td>
                <td className="px-4 py-2">
                  <button 
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      setSelectedSwimmer(swimmer);
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredSwimmers.length)} of {filteredSwimmers.length} results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Previous
              </button>
              {[...Array(pageCount)].map((_, i) => (
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
                onClick={() => setCurrentPage(page => Math.min(pageCount, page + 1))}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      <AdminActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDelete}
        onDeleteUser={handleDeleteUser}
        onBanUser={handleBanUser}
        swimmer={selectedSwimmer}
      />
    </div>
  );
};

export default AdminDashboard;