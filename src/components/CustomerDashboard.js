'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { calculateAge } from '@/utils/dateUtils';

const CustomerDashboard = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [swimmers, setSwimmers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newSwimmer, setNewSwimmer] = useState({
    name: '',
    birthday: '',
    gender: '',
    proficiency: ''
  });

  // Fetch user data and swimmers on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, swimmersRes] = await Promise.all([
          fetch('/api/auth/customer/profile'),
          fetch('/api/auth/customer/swimmers')
        ]);

        if (profileRes.ok && swimmersRes.ok) {
          const profileData = await profileRes.json();
          const swimmersData = await swimmersRes.json();
          
          setUserData(profileData);
          setEmail(profileData.email);
          setSwimmers(swimmersData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setUserData(updatedProfile);
        alert('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/auth/customer/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setPassword('');
        setConfirmPassword('');
        alert('Password updated successfully');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password');
    }
  };

  // Handle adding new swimmer
  const handleAddSwimmer = async (e) => {
    e.preventDefault();
    try {
      if (!newSwimmer.birthday) {
        alert('Please select a birthday');
        return;
      }
  
      // Create a new date in UTC to avoid timezone issues
      const birthDate = new Date(newSwimmer.birthday);
      if (isNaN(birthDate.getTime())) {
        alert('Please enter a valid birthday');
        return;
      }
  
      // Format date as YYYY-MM-DD to avoid timezone issues
      const formattedDate = birthDate.toISOString().split('T')[0];
  
      const res = await fetch('/api/auth/customer/swimmers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSwimmer.name,
          birthday: formattedDate,
          gender: newSwimmer.gender,
          proficiency: newSwimmer.proficiency
        }),
      });
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to add swimmer');
      }
  
      const newSwimmerData = await res.json();
      
      // Transform the response data to match our frontend structure
      const transformedSwimmer = {
        ...newSwimmerData,
        birthday: newSwimmerData.birthdate // Map the database field to our frontend field
      };
      
      setSwimmers([...swimmers, transformedSwimmer]);
      setNewSwimmer({
        name: '',
        birthday: '',
        gender: '',
        proficiency: ''
      });
      alert('Swimmer added successfully');
    } catch (error) {
      console.error('Error adding swimmer:', error);
      alert(error.message || 'Failed to add swimmer');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Error loading user data</div>;
  }

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-3xl font-bold mb-6">Welcome, {userData.fullname}!</h1>
      
      <div className="mb-4">
        <div className="flex border-b border-gray-200">
          {['profile', 'security', 'swimmers'].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {activeTab === 'profile' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="email" className="w-24 font-medium">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow border rounded p-2"
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="w-24 font-medium">Name:</span>
              <span>{userData.fullname}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="w-24 font-medium">Phone:</span>
              <span>{userData.phone_number}</span>
            </div>
            <button
              type="submit"
              className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Update Profile
            </button>
          </form>
        </div>
      )}
      
      {activeTab === 'security' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="newPassword" className="w-32 font-medium">New Password:</label>
              <input
                id="newPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-grow border rounded p-2"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label htmlFor="confirmPassword" className="w-32 font-medium">Confirm Password:</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-grow border rounded p-2"
              />
            </div>
            <button
              type="submit"
              className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Change Password
            </button>
          </form>
        </div>
      )}
      {activeTab === 'swimmers' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Swimmers</h2>
          
          {/* Existing Swimmers */}
          {swimmers.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Current Swimmers</h3>
              <div className="space-y-4">
              {swimmers.map((swimmer) => {
                // Handle both birthdate and birthday fields for backward compatibility
                const birthdateStr = swimmer.birthdate || swimmer.birthday;
                const isValidDate = birthdateStr && !isNaN(new Date(birthdateStr).getTime());
                const birthdate = isValidDate ? new Date(birthdateStr) : null;
                
                // Ensure UTC date to avoid timezone issues
                if (birthdate) {
                  birthdate.setMinutes(birthdate.getMinutes() + birthdate.getTimezoneOffset());
                }

                const birthdayDisplay = birthdate 
                  ? birthdate.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      timeZone: 'UTC'
                    })
                  : 'Not provided';
                
                const age = birthdate ? calculateAge(birthdate) : null;

                return (
                  <div key={swimmer.id} className="border rounded p-4">
                    <p><strong>Name:</strong> {swimmer.name}</p>
                    <p>
                      <strong>Birthday:</strong>{' '}
                      {birthdayDisplay}
                      {age !== null && ` (${age} years old)`}
                    </p>
                    <p><strong>Gender:</strong> {swimmer.gender}</p>
                    <p><strong>Proficiency:</strong> {swimmer.proficiency || 'Not specified'}</p>
                  </div>
                );
              })}
              </div>
            </div>
          )}

          {/* Add New Swimmer Form */}
          <div>
            <h3 className="text-lg font-medium mb-4">Add New Swimmer</h3>
            <form onSubmit={handleAddSwimmer} className="space-y-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="swimmerName" className="w-24 font-medium">Name:</label>
                <input
                  id="swimmerName"
                  name="name"
                  value={newSwimmer.name}
                  onChange={(e) => setNewSwimmer({ ...newSwimmer, name: e.target.value })}
                  className="flex-grow border rounded p-2"
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <label htmlFor="swimmerBirthday" className="w-24 font-medium">Birthday:</label>
                <input
                  id="swimmerBirthday"
                  name="birthday"
                  type="date"
                  value={newSwimmer.birthday}
                  onChange={(e) => setNewSwimmer({ ...newSwimmer, birthday: e.target.value })}
                  className="flex-grow border rounded p-2"
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <label htmlFor="swimmerGender" className="w-24 font-medium">Gender:</label>
                <select
                  id="swimmerGender"
                  name="gender"
                  value={newSwimmer.gender}
                  onChange={(e) => setNewSwimmer({ ...newSwimmer, gender: e.target.value })}
                  className="flex-grow border rounded p-2"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex items-center space-x-4">
                <label htmlFor="swimmerProficiency" className="w-24 font-medium">Proficiency:</label>
                <select
                  id="swimmerProficiency"
                  name="proficiency"
                  value={newSwimmer.proficiency}
                  onChange={(e) => setNewSwimmer({ ...newSwimmer, proficiency: e.target.value })}
                  className="flex-grow border rounded p-2"
                  required
                >
                  <option value="">Select proficiency</option>
                  <option value="no experience">No Experience</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Add Swimmer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;