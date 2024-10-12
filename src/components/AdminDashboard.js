'use client';
import React, { useState, useMemo } from 'react';
import { Users, ShoppingCart, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const [customers, setCustomers] = useState([
    {
      id: '0',
      name: 'riley',
      email: 'rileyp@gmail.com',
      lessonsBooked: 5,
      spent: '$290.66',
      isActive: true,
    },
    {
      id: '1',
      name: 'eric xiao',
      email: 'ericxiao@gmail.com',
      lessonsBooked: 1,
      spent: '$29.66',
      isActive: false,
    },
    // Add more customer data here...
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredCustomers = useMemo(() => {
    return customers
      .filter(customer => 
        (customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (activeFilter === 'all' || 
        (activeFilter === 'active' && customer.isActive) ||
        (activeFilter === 'inactive' && !customer.isActive))
      )
      .sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [customers, searchTerm, sortColumn, sortDirection, activeFilter]);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  const pageCount = Math.ceil(filteredCustomers.length / itemsPerPage);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <Users className="text-blue-500 mr-4" size={48} />
          <div>
            <p className="text-2xl font-bold">8,282</p>
            <p className="text-gray-500">Total Users</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <ShoppingCart className="text-orange-500 mr-4" size={48} />
          <div>
            <p className="text-2xl font-bold">200,521</p>
            <p className="text-gray-500">Swim Lessons Bought</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <DollarSign className="text-green-500 mr-4" size={48} />
          <div>
            <p className="text-2xl font-bold">$1,234,567</p>
            <p className="text-gray-500">Total Revenue</p>
          </div>
        </div>
      </div>
      
      {/* Customer Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-4 border-b border-gray-200 flex items-center">
          <input
            type="text"
            placeholder="Search customers..."
            className="flex-grow px-3 py-2 border rounded-md mr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-3 py-2 border rounded-md mr-2"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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
                  <button onClick={() => handleSort('email')} className="font-semibold text-gray-600 hover:text-gray-900">
                    Email
                  </button>
                </th>
                <th className="px-4 py-2 text-left">
                  <button onClick={() => handleSort('lessonsBooked')} className="font-semibold text-gray-600 hover:text-gray-900">
                    Lessons Booked
                  </button>
                </th>
                <th className="px-4 py-2 text-left">
                  <button onClick={() => handleSort('spent')} className="font-semibold text-gray-600 hover:text-gray-900">
                    Spent
                  </button>
                </th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map(customer => (
                <tr key={customer.id}>
                  <td className="px-4 py-2">{customer.name}</td>
                  <td className="px-4 py-2">{customer.email}</td>
                  <td className="px-4 py-2">{customer.lessonsBooked}</td>
                  <td className="px-4 py-2">{customer.spent}</td>
                  <td className="px-4 py-2">
                    <button className="text-blue-500 hover:text-blue-700">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} results
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
    </div>
  );
};

export default AdminDashboard;