'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, AlertCircle, Users, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import CreateCoverageRequest from './CreateCoverageRequest';
import CoverageRequestsList from './CoverageRequestsList';

const CoverageDashboard = () => {
  const [coverageData, setCoverageData] = useState({
    ownRequests: [],
    availableRequests: [],
    acceptedCoverage: []
  });
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchCoverageData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/instructor/coverage');
      if (response.ok) {
        const data = await response.json();
        
        // Set coverage data directly (ownRequests, availableRequests, acceptedCoverage)
        setCoverageData(data.coverageRequests || {
          ownRequests: [],
          availableRequests: [],
          acceptedCoverage: []
        });
        
        // Set stats separately
        setStats(data.stats || {});
      } else {
        const error = await response.json();
        setMessage({ text: `Error: ${error.error}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching coverage data:', error);
      setMessage({ text: 'Failed to fetch coverage data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoverageData();
  }, []);

  const handleRefresh = () => {
    fetchCoverageData();
  };

  const displayMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 8000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pool-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pool-blue to-brandeis-blue text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6">
              Coverage Management
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-2">
              Request coverage for your lessons or volunteer to cover for others
            </p>
            <div className="mt-6 md:mt-8">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 hover:bg-white/20"
              >
                <Calendar className="w-5 h-5 md:w-6 md:h-6 mr-2 inline" />
                Request Coverage
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements - Hidden on mobile to prevent overflow */}
        <div className="hidden md:block absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="hidden md:block absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 md:-mt-8 relative z-10 mb-6 md:mb-8">
          <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl flex items-start shadow-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-red-500 mt-0.5 flex-shrink-0" />
            )}
            <span className="text-xs md:text-sm font-medium">{message.text}</span>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-pool-blue to-brandeis-blue mx-auto mb-4"></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Coverage Overview
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Current status of your coverage requests and assignments
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-red-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-red-100 rounded-lg md:rounded-xl group-hover:bg-red-200 transition-colors">
                  <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
                </div>
                <Users className="w-4 h-4 md:w-6 md:h-6 text-red-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{stats.total_requests || 0}</h3>
              <p className="text-sm md:text-base text-gray-600 font-medium">Total Requests</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-yellow-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-yellow-100 rounded-lg md:rounded-xl group-hover:bg-yellow-200 transition-colors">
                  <Clock className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />
                </div>
                <AlertTriangle className="w-4 h-4 md:w-6 md:h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{stats.pending_requests || 0}</h3>
              <p className="text-sm md:text-base text-gray-600 font-medium">Pending Requests</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-green-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-green-100 rounded-lg md:rounded-xl group-hover:bg-green-200 transition-colors">
                  <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                </div>
                <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-green-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{stats.accepted_requests || 0}</h3>
              <p className="text-sm md:text-base text-gray-600 font-medium">Accepted Requests</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-blue-100 rounded-lg md:rounded-xl group-hover:bg-blue-200 transition-colors">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                </div>
                <Calendar className="w-4 h-4 md:w-6 md:h-6 text-blue-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{stats.covering_for_others || 0}</h3>
              <p className="text-sm md:text-base text-gray-600 font-medium">Covering Others</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Requests List */}
      <div className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CoverageRequestsList 
            coverageData={coverageData} 
            onRefresh={handleRefresh}
          />
        </div>
      </div>

      {/* Create Coverage Request Modal */}
      {showCreateModal && (
        <CreateCoverageRequest
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            handleRefresh();
            displayMessage('Coverage request created successfully!', 'success');
          }}
          onError={(error) => {
            displayMessage(error, 'error');
          }}
        />
      )}
    </div>
  );
};

export default CoverageDashboard; 