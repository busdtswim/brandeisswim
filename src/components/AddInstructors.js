'use client';

import React, { useState, useEffect } from 'react';

const AddInstructors = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/auth/admin/add');
      if (response.ok) {
        const data = await response.json();
        setInstructors(data);
      } else {
        setMessage('Failed to fetch instructors');
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      setMessage('An error occurred while fetching instructors.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

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
        setMessage(`Instructor ${data.name} added successfully!`);
        setName('');
        setEmail('');
        fetchInstructors();
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error adding instructor:', error);
      setMessage('An error occurred while adding the instructor.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      try {
        const response = await fetch(`/api/auth/admin/add/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setMessage('Instructor deleted successfully!');
          fetchInstructors();
        } else {
          const error = await response.json();
          setMessage(`Error: ${error.message}`);
        }
      } catch (error) {
        console.error('Error deleting instructor:', error);
        setMessage('An error occurred while deleting the instructor.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-2xl font-bold mb-4">Manage Instructors</h1>
      <form onSubmit={editingId ? handleUpdate : handleSubmit} className="max-w-md mb-8">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Instructor
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setName('');
              setEmail('');
            }}
            className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        )}
      </form>
      {message && (
        <p className={`mt-4 ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
      <h2 className="text-xl font-bold mt-8 mb-4">Instructor List</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-3 px-4 border-b text-center">Name</th>
            <th className="py-3 px-4 border-b text-center">Email</th>
            <th className="py-3 px-4 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((instructor) => (
            <tr key={instructor.id} className="hover:bg-gray-50">
              <td className="py-3 px-4 border-b text-center">{instructor.name}</td>
              <td className="py-3 px-4 border-b text-center">{instructor.email}</td>
              <td className="py-3 px-4 border-b text-center">
                <button
                  onClick={() => handleDelete(instructor.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded transition duration-150 ease-in-out"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddInstructors;