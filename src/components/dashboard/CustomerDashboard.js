'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User, Key, Users, Check, AlertTriangle, Eye, EyeOff, Plus, Calendar, Shield, Trash2, AlertCircle } from 'lucide-react';
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
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newSwimmer, setNewSwimmer] = useState({
    name: '',
    birthday: '',
    gender: '',
    proficiency: ''
  });
  const [oldPassword, setOldPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [swimmerToDelete, setSwimmerToDelete] = useState(null);

  const validatePassword = (pwd) => {
    // At least 8 chars, one uppercase, one lowercase, one number, one special char
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(pwd);
  };

  // Handle swimmer deletion
  const handleDeleteSwimmer = async (swimmerId) => {
    try {
      const res = await fetch(`/api/auth/customer/swimmers/${swimmerId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        const result = await res.json();
        // Remove the swimmer from the local state
        setSwimmers(swimmers.filter(swimmer => swimmer.id !== swimmerId));
        showSuccessMessage(`Swimmer deleted successfully. Removed ${result.deletedLessonRegistrations} lesson registrations and ${result.deletedWaitlistEntries} waitlist entries.`);
        setSwimmerToDelete(null);
        setShowDeleteConfirm(false);
      } else {
        const error = await res.json();
        showErrorMessage(error.error || 'Failed to delete swimmer');
      }
    } catch (error) {
      showErrorMessage('Failed to delete swimmer');
    }
  };

  // Show delete confirmation modal
  const confirmDeleteSwimmer = (swimmer) => {
    setSwimmerToDelete(swimmer);
    setShowDeleteConfirm(true);
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
          setEmail(profileData.email || '');
          setFullName(profileData.fullname || '');
          setPhoneNumber(profileData.phone_number || '');
          setSwimmers(swimmersData);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchData();
    }
  }, [session]);

  // Show success message
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // Show error message
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
    
    // Basic validation
    if (!email.trim()) {
      showErrorMessage('Email is required');
      return;
    }
    if (!fullName.trim()) {
      showErrorMessage('Full name is required');
      return;
    }
    if (!phoneNumber.trim()) {
      showErrorMessage('Phone number is required');
      return;
    }
    
    try {
      const res = await fetch('/api/auth/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          fullName,
          phoneNumber
        }),
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setUserData(updatedProfile);
        
        // Update local state with the new values
        setEmail(updatedProfile.email);
        setFullName(updatedProfile.fullname);
        setPhoneNumber(updatedProfile.phone_number);
        
        showSuccessMessage('Profile updated successfully!');
      } else {
        const errorData = await res.json();
        showErrorMessage(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
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

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      const res = await fetch('/api/auth/customer/delete-account', {
        method: 'DELETE',
      });

      if (res.ok) {
        const result = await res.json();
        toast.success(`Account deleted successfully. ${result.deletedSwimmers} swimmers removed.`);
        
        // Sign out the user and redirect to home page
        setTimeout(() => {
          signOut({ callbackUrl: '/' });
        }, 2000);
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to delete account');
      }
    } catch (error) {
      toast.error('Failed to delete account');
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pool-blue mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <p className="font-medium">Error loading user data</p>
          </div>
          <p>Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Key },
    { id: 'swimmers', label: 'Swimmers', icon: Users },
    { id: 'account', label: 'Account', icon: Trash2 },
  ];

  return (
    <div className="py-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-24 right-4 z-50 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl shadow-lg flex items-start">
          <Check className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <p className="font-medium">{successMessage}</p>
        </div>
      )}
      
      {/* Error Message */}
      {showError && (
        <div className="fixed top-24 right-4 z-50 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-lg flex items-start">
          <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Delete Swimmer Confirmation Modal */}
      {showDeleteConfirm && swimmerToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">Delete Swimmer</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{swimmerToDelete.name}</span>?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> This action will permanently delete:
                </p>
                <ul className="text-sm text-red-700 mt-2 space-y-1 list-disc list-inside">
                  <li>All lesson registrations for this swimmer</li>
                  <li>All waitlist entries for this swimmer</li>
                  <li>All swimmer data and preferences</li>
                  <li>This action cannot be undone</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSwimmerToDelete(null);
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSwimmer(swimmerToDelete.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
              >
                Delete Swimmer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Welcome back, <span className="gradient-text">{userData.fullname}</span>!
        </h1>
        <p className="text-lg md:text-xl text-gray-600">Manage your account and swimmers from your personal dashboard.</p>
      </div>
      
      {/* Tabs */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
          <nav className="flex flex-col sm:flex-row gap-2" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center sm:justify-start px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 w-full sm:w-auto ${
                    isActive
                      ? 'bg-gradient-to-r from-pool-blue to-brandeis-blue text-white shadow-lg transform scale-[1.02]'
                      : 'text-gray-600 hover:text-brandeis-blue hover:bg-gradient-to-r hover:from-pool-blue/10 hover:to-brandeis-blue/10'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-2 ${isActive ? 'text-white' : ''}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Content Sections */}
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === 'profile' && (
          <div className="p-6 md:p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pool-blue to-brandeis-blue rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Profile Information</h2>
              </div>
              <p className="text-gray-600">Update your personal information and contact details.</p>
            </div>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-2xl">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 md:py-4 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900"
                  />
                </div>
                
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    readOnly={true}
                    className="w-full px-4 py-3 md:py-4 rounded-xl border border-gray-500 text-gray-900 bg-gray-200"
                  />
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 md:py-4 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-pool-blue to-brandeis-blue hover:from-brandeis-blue hover:to-pool-blue text-white px-8 py-3 md:py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Update Profile
                </button>
              </div>
              
              {/* Helpful note about email changes */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Important Note:</p>
                    <p>If you change your email address, you may need to refresh the page for all changes to take effect properly. If you encounter any issues, simply refresh the page or sign out and sign back in.</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {activeTab === 'security' && (
          <div className="p-6 md:p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Security Settings</h2>
              </div>
              <p className="text-gray-600">Keep your account secure by updating your password regularly.</p>
            </div>
            
            <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-2xl">
              <div>
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3 md:py-4 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900"
                  autoComplete="current-password"
                />
                <div className="mt-2">
                  <a href="/forgot-password" className="text-sm text-pool-blue hover:text-brandeis-blue transition-colors duration-200 font-medium">
                    Forgot your password?
                  </a>
                </div>
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 md:py-4 pr-12 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
                </p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 md:py-4 pr-12 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white px-8 py-3 md:py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}
        
        {activeTab === 'swimmers' && (
          <div className="p-6 md:p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Swimmers</h2>
              </div>
              <p className="text-gray-600">Add and manage swimmer information for your family members.</p>
            </div>
            
            {/* Existing Swimmers */}
            {swimmers.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                  <Users className="w-6 h-6 text-pool-blue" />
                  Current Swimmers ({swimmers.length})
                </h3>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {swimmers.map((swimmer) => {
                    const birthDate = new Date(swimmer.birthdate);
                    const birthdateString = `${(birthDate.getUTCMonth() + 1).toString().padStart(2, '0')}/${birthDate.getUTCDate().toString().padStart(2, '0')}/${birthDate.getUTCFullYear()}`;
                    
                    let proficiencyConfig = {
                      'no experience': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
                      'beginner': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
                      'intermediate': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
                      'advanced': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' }
                    };
                    
                    const config = proficiencyConfig[swimmer.proficiency] || proficiencyConfig['no experience'];

                    return (
                      <div key={swimmer.id} className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover">
                        <div className="bg-gradient-to-r from-pool-blue to-brandeis-blue px-6 py-4">
                          <h4 className="font-bold text-lg text-white">{swimmer.name}</h4>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Birthday:
                            </span>
                            <span className="text-sm font-medium text-gray-900">{birthdateString}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Gender:</span>
                            <span className="text-sm font-medium text-gray-900 capitalize">{swimmer.gender}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Proficiency:</span>
                            <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${config.bg} ${config.text} ${config.border}`}>
                              {swimmer.proficiency || 'Not specified'}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 pt-0 flex justify-end gap-2">
                          <button
                            onClick={() => confirmDeleteSwimmer(swimmer)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 hover:bg-red-600"
                            title="Delete swimmer"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add New Swimmer Form */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-200">
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Plus className="w-6 h-6 text-green-600" />
                Add New Swimmer
              </h3>
              <form onSubmit={handleAddSwimmer} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="swimmerName" className="block text-sm font-medium text-gray-700 mb-2">
                      Swimmer Name
                    </label>
                    <input
                      id="swimmerName"
                      name="name"
                      value={newSwimmer.name}
                      onChange={(e) => setNewSwimmer({ ...newSwimmer, name: e.target.value })}
                      className="w-full px-4 py-3 md:py-4 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900"
                      placeholder="Enter swimmer's full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="swimmerBirthday" className="block text-sm font-medium text-gray-700 mb-2">
                      Birthday
                    </label>
                    <input
                      id="swimmerBirthday"
                      name="birthday"
                      type="date"
                      value={newSwimmer.birthday}
                      onChange={(e) => setNewSwimmer({ ...newSwimmer, birthday: e.target.value })}
                      className="w-full px-4 py-3 md:py-4 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="swimmerGender" className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      id="swimmerGender"
                      name="gender"
                      value={newSwimmer.gender}
                      onChange={(e) => setNewSwimmer({ ...newSwimmer, gender: e.target.value })}
                      className="w-full px-4 py-3 md:py-4 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="swimmerProficiency" className="block text-sm font-medium text-gray-700 mb-2">
                      Proficiency Level
                    </label>
                    <select
                      id="swimmerProficiency"
                      name="proficiency"
                      value={newSwimmer.proficiency}
                      onChange={(e) => setNewSwimmer({ ...newSwimmer, proficiency: e.target.value })}
                      className="w-full px-4 py-3 md:py-4 rounded-xl border border-gray-200 focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 text-gray-900"
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
                
                <div className="pt-4">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white px-8 py-3 md:py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Swimmer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {activeTab === 'account' && (
          <div className="p-6 md:p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Account Management</h2>
              </div>
              <p className="text-gray-600">Manage your account settings and data.</p>
            </div>
            
            {/* Account Deletion Section */}
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-red-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-red-800 mb-2">Delete Account</h3>
                  <p className="text-red-700 text-sm md:text-base">
                    This action will permanently delete your account and all associated data including:
                  </p>
                  <ul className="text-red-700 text-sm md:text-base mt-2 space-y-1 list-disc list-inside">
                    <li>Your profile information</li>
                    <li>All swimmers associated with your account</li>
                    <li>All lesson registrations and schedules</li>
                    <li>All waitlist entries</li>
                    <li>This action cannot be undone</li>
                  </ul>
                </div>
              </div>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 md:py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete My Account
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-red-200">
                    <p className="text-red-800 font-medium mb-3">
                      Are you sure you want to delete your account? This action cannot be undone.
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 md:py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Yes, Delete My Account
                    </button>
                    
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 md:py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernCustomerDashboard;