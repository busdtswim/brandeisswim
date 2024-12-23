// src/components/AdminActionModal.js
'use client';

import React from 'react';

const AdminActionModal = ({ isOpen, onClose, onDelete, onDeleteUser, onBanUser, swimmer }) => {
  if (!isOpen || !swimmer) return null;

  const handleDeleteSwimmer = async () => {
    if (confirm('Are you sure you want to delete this swimmer?')) {
      try {
        const response = await fetch(`/api/auth/admin/swimmers/${swimmer.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete swimmer');
        }

        onDelete(swimmer.id);
        onClose();
      } catch (error) {
        console.error('Error deleting swimmer:', error);
        alert(error.message || 'Failed to delete swimmer. Please try again.');
      }
    }
  };

  const handleDeleteUser = async () => {
    if (!swimmer?.user_id) {
      alert('No user ID found for this swimmer');
      return;
    }

    if (confirm('Are you sure you want to delete this user and all associated swimmers?')) {
      try {
        const response = await fetch(`/api/auth/admin/users/${swimmer.user_id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete user');
        }

        onDeleteUser(swimmer.user_id);
        onClose();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(error.message || 'Failed to delete user. Please try again.');
      }
    }
  };

  const handleBanUser = async () => {
    if (!swimmer?.user_id) {
      alert('No user ID found for this swimmer');
      return;
    }

    if (confirm('Are you sure you want to ban this user?')) {
      try {
        const response = await fetch(`/api/auth/admin/users/${swimmer.user_id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ is_banned: true }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to ban user');
        }

        onBanUser(swimmer.user_id);
        onClose();
      } catch (error) {
        console.error('Error banning user:', error);
        alert(error.message || 'Failed to ban user. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Manage Swimmer: {swimmer.name}</h2>
        
        <div className="space-y-4">
          <button
            onClick={handleDeleteSwimmer}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
          >
            Delete Swimmer
          </button>

          <button
            onClick={handleDeleteUser}
            className="w-full bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800 transition-colors"
          >
            Delete User (All Swimmers)
          </button>

          <button
            onClick={handleBanUser}
            className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors"
          >
            Ban User
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminActionModal;