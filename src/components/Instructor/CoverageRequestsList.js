'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
} from 'lucide-react';

const CoverageRequestsList = ({ coverageData, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [expandedRequests, setExpandedRequests] = useState(new Set());

  const toggleExpanded = (requestId) => {
    const newExpanded = new Set(expandedRequests);
    if (newExpanded.has(requestId)) {
      newExpanded.delete(requestId);
    } else {
      newExpanded.add(requestId);
    }
    setExpandedRequests(newExpanded);
  };

  const handleAction = async (requestId, action) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/instructor/coverage/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        onRefresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to process request');
      }
    } catch (error) {
      console.error('Error processing coverage request:', error);
      alert('Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  if (!coverageData) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>Loading coverage data...</p>
      </div>
    );
  }

  const { ownRequests, availableRequests, acceptedCoverage, acceptedRequestedCoverage } = coverageData;

  return (
    <div className="space-y-6">
      {/* Own Pending Requests */}
      {ownRequests && ownRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">My Pending Requests</h3>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {ownRequests.map((request) => (
              <div key={request.id} className="border-b border-gray-200 last:border-b-0">
                {/* Clickable Row Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpanded(request.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(request.request_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            {request.start_time && request.end_time ? (
                              `${request.start_time} - ${request.end_time}`
                            ) : (
                              'Time not specified'
                            )}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Swimmer:</span> {request.swimmer_name || 'Unknown'}
                            {request.proficiency && ` • ${request.proficiency}`}
                          </p>
                          {request.reason && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Reason:</span> {request.reason}
                            </p>
                          )}
                          
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(request.id, 'delete');
                        }}
                        disabled={loading}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                      >
                        Delete Request
                      </button>
                      <div className="text-gray-400">
                        {expandedRequests.has(request.id) ? '−' : '+'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedRequests.has(request.id) && (
                  <div className="px-4 pb-4 bg-gray-50">
                    <div className="pt-2 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Created:</span>
                        <span>{new Date(request.created_at).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>
                      {request.notes && (
                        <div className="flex items-start space-x-2">
                          <span className="font-medium">Notes:</span>
                          <span>{request.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Requests to Volunteer For */}
      {availableRequests && availableRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Available Requests to Cover</h3>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {availableRequests.map((request) => (
              <div key={request.id} className="border-b border-gray-200 last:border-b-0">
                {/* Clickable Row Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpanded(request.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(request.request_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            {request.start_time && request.end_time ? (
                              `${request.start_time} - ${request.end_time}`
                            ) : (
                              'Time not specified'
                            )}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Swimmer:</span> {request.swimmer_name || 'Unknown'}
                            {request.proficiency && ` • ${request.proficiency}`}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Requested by:</span> {request.requesting_instructor_name}
                          </p>
                          {request.reason && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Reason:</span> {request.reason}
                            </p>
                          )}
                          
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(request.id, 'accept');
                        }}
                        disabled={loading}
                        className="px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                      >
                        Accept Coverage
                      </button>
                      <div className="text-gray-400">
                        {expandedRequests.has(request.id) ? '−' : '+'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedRequests.has(request.id) && (
                  <div className="px-4 pb-4 bg-gray-50">
                    <div className="pt-2 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Requested:</span>
                        <span>{new Date(request.created_at).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>
                      {request.notes && (
                        <div className="flex items-start space-x-2">
                          <span className="font-medium">Notes:</span>
                          <span>{request.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accepted Coverage (Your Responsibility) */}
      {acceptedCoverage && acceptedCoverage.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Coverage You Are Providing</h3>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {acceptedCoverage.map((request) => (
              <div key={request.id} className="border-b border-gray-200 last:border-b-0">
                {/* Clickable Row Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpanded(request.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(request.request_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            {request.start_time && request.end_time ? (
                              `${request.start_time} - ${request.end_time}`
                            ) : (
                              'Time not specified'
                            )}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Swimmer:</span> {request.swimmer_name || 'Unknown'}
                            {request.proficiency && ` • ${request.proficiency}`}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {request.covering_instructor_id === request.requesting_instructor_id ? (
                              <span className="font-medium">Status:</span>
                            ) : request.covering_instructor_id ? (
                              <span className="font-medium">Covering for:</span>
                            ) : (
                              <span className="font-medium">Requested by:</span>
                            )}
                            {' '}
                            {request.requesting_instructor_name}
                          </p>
                          {request.covering_instructor_id && request.covering_instructor_id !== request.requesting_instructor_id && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Covered by:</span> {request.covering_instructor_name || 'Unknown'}
                            </p>
                          )}
                          {request.reason && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Reason:</span> {request.reason}
                            </p>
                          )}
                          <p className="text-xs text-orange-600 mt-2 font-medium">
                            ⚠️ You are responsible for this coverage. If you need to give it up, 
                            you will become the requesting instructor and others can pick it up.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(request.id, 'reRequest');
                        }}
                        disabled={loading}
                        className="px-3 py-1 text-sm text-orange-600 hover:text-orange-800 hover:bg-orange-50 transition-colors"
                      >
                        Give Up & Re-request
                      </button>
                      <div className="text-gray-400">
                        {expandedRequests.has(request.id) ? '−' : '+'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedRequests.has(request.id) && (
                  <div className="px-4 pb-4 bg-gray-50">
                    <div className="pt-2 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Accepted:</span>
                        <span>{new Date(request.updated_at || request.created_at).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>
                      {request.notes && (
                        <div className="flex items-start space-x-2">
                          <span className="font-medium">Notes:</span>
                          <span>{request.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accepted Coverage (Your Responsibility) */}
      {acceptedRequestedCoverage && acceptedRequestedCoverage.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Accepted Coverage Requests</h3>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {acceptedRequestedCoverage.map((request) => (
              <div key={request.id} className="border-b border-gray-200 last:border-b-0">
                {/* Clickable Row Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpanded(request.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(request.request_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            {request.start_time && request.end_time ? (
                              `${request.start_time} - ${request.end_time}`
                            ) : (
                              'Time not specified'
                            )}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Swimmer:</span> {request.swimmer_name || 'Unknown'}
                            {request.proficiency && ` • ${request.proficiency}`}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {request.covering_instructor_id === request.requesting_instructor_id ? (
                              <span className="font-medium">Status:</span>
                            ) : request.covering_instructor_id ? (
                              <span className="font-medium">Covering for:</span>
                            ) : (
                              <span className="font-medium">Requested by:</span>
                            )}
                            {' '}
                            {request.requesting_instructor_name}
                          </p>
                          {request.covering_instructor_id && request.covering_instructor_id !== request.requesting_instructor_id && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Covered by:</span> {request.covering_instructor_name || 'Unknown'}
                            </p>
                          )}
                          {request.reason && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Reason:</span> {request.reason}
                            </p>
                          )}
                          <p className="text-xs text-green-600 mt-2 font-medium">
                            ✅ Your coverage request has been accepted by {request.covering_instructor_name || 'another instructor'}.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* No re-request button for requesting instructor */}
                      <span className="text-sm text-green-600 font-medium">
                        Accepted by: {request.covering_instructor_name || 'Unknown'}
                      </span>
                      <div className="text-gray-400">
                        {expandedRequests.has(request.id) ? '−' : '+'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedRequests.has(request.id) && (
                  <div className="px-4 pb-4 bg-gray-50">
                    <div className="pt-2 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Accepted:</span>
                        <span>{new Date(request.updated_at || request.created_at).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>
                      {request.notes && (
                        <div className="flex items-start space-x-2">
                          <span className="font-medium">Notes:</span>
                          <span>{request.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Coverage Data */}
      {(!ownRequests || ownRequests.length === 0) && 
       (!availableRequests || availableRequests.length === 0) && 
       (!acceptedCoverage || acceptedCoverage.length === 0) && 
       (!acceptedRequestedCoverage || acceptedRequestedCoverage.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No coverage requests found</p>
          <p className="text-sm mt-2">Create a request or volunteer to cover for others</p>
        </div>
      )}
    </div>
  );
};

export default CoverageRequestsList; 