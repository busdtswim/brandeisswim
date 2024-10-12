import React, { useState } from 'react';

const fakeUser = {
  swimmerName: "John Doe",
  email: "john.doe@example.com",
  birthday: "1990-01-15",
  parentName: "Jane Doe",
  swimmerGender: "Male",
  phoneNumber: "123-456-7890",
  preferredDays: ["Monday", "Wednesday", "Friday"],
  proficiency: "Intermediate"
};

const CustomerDashboard = ({ user = fakeUser }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newSwimmer, setNewSwimmer] = useState({
    name: '',
    birthday: '',
    gender: '',
  });

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handleNewSwimmerChange = (e) => setNewSwimmer({ ...newSwimmer, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (update email, password, or add new swimmer)
    console.log('Form submitted');
  };

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.swimmerName}!</h1>
      
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
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="email" className="w-24 font-medium">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="flex-grow border rounded p-2"
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="w-24 font-medium">Name:</span>
              <span>{user.swimmerName}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="w-24 font-medium">Birthday:</span>
              <span>{user.birthday}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="w-24 font-medium">Parent:</span>
              <span>{user.parentName}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="w-24 font-medium">Gender:</span>
              <span>{user.swimmerGender}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="w-24 font-medium">Phone:</span>
              <span>{user.phoneNumber}</span>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Update Profile
          </button>
        </div>
      )}
      
      {activeTab === 'security' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="newPassword" className="w-32 font-medium">New Password:</label>
              <input
                id="newPassword"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="flex-grow border rounded p-2"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label htmlFor="confirmPassword" className="w-32 font-medium">Confirm Password:</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="flex-grow border rounded p-2"
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Change Password
          </button>
        </div>
      )}
      
      {activeTab === 'swimmers' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Swimmers</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="swimmerName" className="w-24 font-medium">Name:</label>
              <input
                id="swimmerName"
                name="name"
                value={newSwimmer.name}
                onChange={handleNewSwimmerChange}
                className="flex-grow border rounded p-2"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label htmlFor="swimmerBirthday" className="w-24 font-medium">Birthday:</label>
              <input
                id="swimmerBirthday"
                name="birthday"
                type="date"
                value={newSwimmer.birthday}
                onChange={handleNewSwimmerChange}
                className="flex-grow border rounded p-2"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label htmlFor="swimmerGender" className="w-24 font-medium">Gender:</label>
              <input
                id="swimmerGender"
                name="gender"
                value={newSwimmer.gender}
                onChange={handleNewSwimmerChange}
                className="flex-grow border rounded p-2"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Add Swimmer
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;