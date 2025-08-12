'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Key, Users, Check, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ModernCustomerDashboard = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [swimmers, setSwimmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  
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
  const [oldPassword, setOldPassword] = useState('');

  const validatePassword = (pwd) => {
    // At least 8 chars, one uppercase, one lowercase, one number, one special char
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(pwd);
  };

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
        showErrorMessage('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 3000);
  };

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
        showSuccessMessage('Profile updated successfully');
      } else {
        showErrorMessage('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showErrorMessage('Failed to update profile');
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!oldPassword) {
      toast.error('Please enter your old password');
      return;
    }
    if (!validatePassword(password)) {
      toast.error('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const res = await fetch('/api/auth/customer/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, password }),
      });
      if (res.ok) {
        setOldPassword('');
        setPassword('');
        setConfirmPassword('');
        toast.success('Password updated successfully');
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    }
  };

  // Handle adding new swimmer
  const handleAddSwimmer = async (e) => {
    e.preventDefault();
    try {
      if (!newSwimmer.birthday) {
        showErrorMessage('Please select a birthday');
        return;
      }
  
      // Create a new date in UTC to avoid timezone issues
      const birthDate = new Date(newSwimmer.birthday);
      if (isNaN(birthDate.getTime())) {
        showErrorMessage('Please enter a valid birthday');
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
      showSuccessMessage('Swimmer added successfully');
    } catch (error) {
      console.error('Error adding swimmer:', error);
      showErrorMessage(error.message || 'Failed to add swimmer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md text-red-700">
          <p className="font-medium">Error loading user data</p>
          <p>Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-24 right-4 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md shadow-md flex items-start">
          <Check className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}
      
      {/* Error Message */}
      {showError && (
        <div className="fixed top-24 right-4 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md shadow-md flex items-start">
          <AlertTriangle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome, {userData.fullname}!</h1>
        <p className="mt-2 text-gray-600">Manage your account and swimmers from your personal dashboard.</p>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`
              pb-3 px-1 border-b-2 font-medium text-sm flex items-center
              ${activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <User className="w-5 h-5 mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`
              pb-3 px-1 border-b-2 font-medium text-sm flex items-center
              ${activeTab === 'security'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <Key className="w-5 h-5 mr-2" />
            Security
          </button>
          <button
            onClick={() => setActiveTab('swimmers')}
            className={`
              pb-3 px-1 border-b-2 font-medium text-sm flex items-center
              ${activeTab === 'swimmers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <Users className="w-5 h-5 mr-2" />
            Swimmers
          </button>
        </nav>
      </div>
      
      {/* Content Sections */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {activeTab === 'profile' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Profile Information</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-md">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="w-full rounded-md border border-gray-200 py-2 px-3 text-gray-700 bg-gray-50">
                  {userData.fullname}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="w-full rounded-md border border-gray-200 py-2 px-3 text-gray-700 bg-gray-50">
                  {userData.phone_number || 'Not provided'}
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        )}
        
        {activeTab === 'security' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Security Settings</h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-md">
              <div>
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Old Password
                </label>
                <input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoComplete="current-password"
                />
                <div className="mt-1 text-xs text-blue-600">
                  <a href="/forgot-password" className="underline hover:text-blue-800">Forgot password?</a>
                </div>
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}
        
        {activeTab === 'swimmers' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Manage Swimmers</h2>
            
            {/* Existing Swimmers */}
            {swimmers.length > 0 && (
              <div className="mb-10">
                <h3 className="text-lg font-medium mb-4 text-gray-800">Current Swimmers</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {swimmers.map((swimmer) => {
                    const birthDate = new Date(swimmer.birthdate);
                    const birthdateString = `${(birthDate.getUTCMonth() + 1).toString().padStart(2, '0')}/${birthDate.getUTCDate().toString().padStart(2, '0')}/${birthDate.getUTCFullYear()}`;
                    
                    let proficiencyColor = 'bg-gray-100';
                    if (swimmer.proficiency === 'beginner') proficiencyColor = 'bg-blue-100 text-blue-800';
                    if (swimmer.proficiency === 'intermediate') proficiencyColor = 'bg-green-100 text-green-800';
                    if (swimmer.proficiency === 'advanced') proficiencyColor = 'bg-purple-100 text-purple-800';

                    return (
                      <div key={swimmer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-blue-500 px-4 py-2 text-white">
                          <h4 className="font-medium text-lg">{swimmer.name}</h4>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Birthday:</span>
                            <span className="text-sm font-medium">{birthdateString}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Gender:</span>
                            <span className="text-sm font-medium capitalize">{swimmer.gender}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Proficiency:</span>
                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${proficiencyColor}`}>
                              {swimmer.proficiency || 'Not specified'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add New Swimmer Form */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-medium mb-4 text-gray-800">Add New Swimmer</h3>
              <form onSubmit={handleAddSwimmer} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="swimmerName" className="block text-sm font-medium text-gray-700 mb-1">
                      Swimmer Name
                    </label>
                    <input
                      id="swimmerName"
                      name="name"
                      value={newSwimmer.name}
                      onChange={(e) => setNewSwimmer({ ...newSwimmer, name: e.target.value })}
                      className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="swimmerBirthday" className="block text-sm font-medium text-gray-700 mb-1">
                      Birthday
                    </label>
                    <input
                      id="swimmerBirthday"
                      name="birthday"
                      type="date"
                      value={newSwimmer.birthday}
                      onChange={(e) => setNewSwimmer({ ...newSwimmer, birthday: e.target.value })}
                      className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="swimmerGender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      id="swimmerGender"
                      name="gender"
                      value={newSwimmer.gender}
                      onChange={(e) => setNewSwimmer({ ...newSwimmer, gender: e.target.value })}
                      className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="swimmerProficiency" className="block text-sm font-medium text-gray-700 mb-1">
                      Proficiency Level
                    </label>
                    <select
                      id="swimmerProficiency"
                      name="proficiency"
                      value={newSwimmer.proficiency}
                      onChange={(e) => setNewSwimmer({ ...newSwimmer, proficiency: e.target.value })}
                      className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select proficiency</option>
                      <option value="no experience">No Experience</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 inline-flex items-center"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Add Swimmer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernCustomerDashboard;