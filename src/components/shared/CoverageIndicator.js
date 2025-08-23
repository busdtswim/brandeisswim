'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, User, X } from 'lucide-react';

const CoverageIndicator = ({ lessonId, swimmerId }) => {
  const [coverageData, setCoverageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchCoverageData();
  }, [lessonId, swimmerId]);

  const fetchCoverageData = async () => {
    try {
      setLoading(true);
      // Fetch coverage data for this specific swimmer
      const response = await fetch(`/api/auth/admin/coverage/swimmer/${swimmerId}`);
      if (response.ok) {
        const data = await response.json();
        setCoverageData(data.coverageRequests || []);
      }
    } catch (error) {
      console.error('Error fetching coverage data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400"></div>
      </div>
    );
  }

  if (!coverageData || coverageData.length === 0) {
    return (
      <div className="text-xs text-gray-400">No coverage</div>
    );
  }

  // Find coverage requests for this specific swimmer
  const activeCoverage = coverageData.filter(req => req.status === 'accepted');
  const pendingCoverage = coverageData.filter(req => req.status === 'pending');

  if (activeCoverage.length === 0 && pendingCoverage.length === 0) {
    return (
      <div className="text-xs text-gray-400">No coverage</div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get unique dates that have coverage
  const getCoverageSummary = () => {
    if (activeCoverage.length > 0) {
      const dates = [...new Set(activeCoverage.map(req => req.request_date))];
      if (dates.length === 1) {
        return `Covered ${formatDate(dates[0])}`;
      } else {
        return `${activeCoverage.length} dates covered`;
      }
    } else if (pendingCoverage.length > 0) {
      return `${pendingCoverage.length} pending`;
    }
    return '';
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-center">
        {activeCoverage.length > 0 && (
          <button
            onClick={() => setShowPopup(true)}
            className="flex items-center space-x-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full hover:bg-green-200 transition-colors"
            title={getCoverageSummary()}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>{activeCoverage.length}</span>
          </button>
        )}
        
        {pendingCoverage.length > 0 && activeCoverage.length === 0 && (
          <button
            onClick={() => setShowPopup(true)}
            className="flex items-center space-x-1 text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full hover:bg-yellow-200 transition-colors"
            title={`${pendingCoverage.length} pending coverage request${pendingCoverage.length > 1 ? 's' : ''}`}
          >
            <Clock className="w-3 h-3" />
            <span>{pendingCoverage.length}</span>
          </button>
        )}
      </div>

      {/* Full-screen popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Coverage Details</h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Active Coverage */}
              {activeCoverage.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-green-800 font-medium text-center mb-2">ACTIVE COVERAGE</h4>
                  {activeCoverage.map((coverage, index) => (
                    <div key={coverage.id} className="text-center space-y-2">
                      <div className="text-gray-900 font-medium">
                        {new Date(coverage.request_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-green-700">
                        <User className="h-4 w-4" />
                        <span className="text-sm">
                          {coverage.covering_instructor_name} is covering for {coverage.requesting_instructor_name}
                        </span>
                      </div>
                      {coverage.reason && (
                        <div className="text-green-700 text-sm text-center">
                          Reason: {coverage.reason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Pending Coverage */}
              {pendingCoverage.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="text-yellow-800 font-medium text-center mb-2">PENDING REQUESTS</h4>
                  {pendingCoverage.map((coverage, index) => (
                    <div key={coverage.id} className="text-center space-y-2">
                      <div className="text-gray-900 font-medium">
                        {new Date(coverage.request_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-yellow-700">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          {coverage.requesting_instructor_name} needs coverage
                        </span>
                      </div>
                      {coverage.reason && (
                        <div className="text-yellow-700 text-sm text-center">
                          Reason: {coverage.reason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverageIndicator; 