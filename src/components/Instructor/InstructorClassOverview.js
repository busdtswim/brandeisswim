'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  CheckCircle,
  Clock as ClockIcon
} from 'lucide-react';
import { DateFormatter } from '@/lib/utils/formatUtils';
import CoverageIndicator from '../shared/CoverageIndicator';

const InstructorClassOverview = () => {
  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [expandedClasses, setExpandedClasses] = useState(new Set());
  const [notesModal, setNotesModal] = useState({ open: false, notes: '' });
  const [missingDatesModal, setMissingDatesModal] = useState({ open: false, dates: '', swimmer: '' });
  const [coverageData, setCoverageData] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesResponse, instructorsResponse] = await Promise.all([
        fetch('/api/auth/lessons/classes'),
        fetch('/api/auth/lessons/instructors')
      ]);

      if (!classesResponse.ok || !instructorsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const classesData = await classesResponse.json();
      const instructorsData = await instructorsResponse.json();

      setClasses(classesData);
      setInstructors(instructorsData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoverageData = async () => {
    try {
      const response = await fetch('/api/auth/instructor/coverage');
      if (response.ok) {
        const data = await response.json();
        setCoverageData(data.coverageRequests || {});
      }
    } catch (error) {
      console.error('Error fetching coverage data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCoverageData();
  }, []);

  const toggleClassExpanded = (classId) => {
    setExpandedClasses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(classId)) {
        newSet.delete(classId);
      } else {
        newSet.add(classId);
      }
      return newSet;
    });
  };

  const filteredClasses = React.useMemo(() => {
    const currentDate = new Date();
    
    return classes.filter(classData => {
      const startDate = new Date(classData.startDate);
      const endDate = new Date(classData.endDate);
      
      switch (filter) {
        case 'past':
          return endDate < currentDate;
        case 'current':
          return startDate <= currentDate && endDate >= currentDate;
        case 'future':
          return startDate > currentDate;
        default:
          return true; // 'all' case
      }
    });
  }, [classes, filter]);

  // Helper function to get coverage info for a specific swimmer
  const getSwimmerCoverage = (swimmerId, lessonId) => {
    if (!coverageData.ownRequests && !coverageData.availableRequests && !coverageData.acceptedCoverage) {
      return null;
    }

    // Check accepted coverage first
    const acceptedCoverage = coverageData.acceptedCoverage?.find(
      req => req.swimmer_id === swimmerId && req.lesson_id === lessonId
    );

    if (acceptedCoverage) {
      return {
        type: 'accepted',
        data: acceptedCoverage
      };
    }

    // Check pending requests
    const pendingRequest = coverageData.ownRequests?.find(
      req => req.swimmer_id === swimmerId && req.lesson_id === lessonId
    );

    if (pendingRequest) {
      return {
        type: 'pending',
        data: pendingRequest
      };
    }

    return null;
  };

  // Helper function to render coverage indicator
  const renderCoverageIndicator = (swimmerId, lessonId) => {
    const coverage = getSwimmerCoverage(swimmerId, lessonId);
    
    if (!coverage) {
      return <span className="text-xs text-gray-400">No coverage</span>;
    }

    if (coverage.type === 'accepted') {
      return (
        <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
          <CheckCircle className="w-3 h-3" />
          <span>Covered</span>
        </div>
      );
    }

    if (coverage.type === 'pending') {
      return (
        <div className="flex items-center space-x-1 text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
          <ClockIcon className="w-3 h-3" />
          <span>Pending</span>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Schedule</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Class Schedule</h1>
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-5 h-5" />
          <span>View Only - Instructor Access</span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter:</span>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Classes</option>
          <option value="current">Current Classes</option>
          <option value="future">Future Classes</option>
          <option value="past">Past Classes</option>
        </select>
      </div>

      {/* Classes List */}
      {filteredClasses.length > 0 ? (
        <div className="space-y-4">
          {filteredClasses.map((classData) => (
            <div key={classData.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Class Header - Now Entirely Clickable */}
              <div 
                className="px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleClassExpanded(classData.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold flex items-center">
                        {classData.meetingDays?.join(', ') || ''} Swim Class
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {DateFormatter.formatForDisplay(classData.startDate)} - {DateFormatter.formatForDisplay(classData.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{classData.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{classData.participants?.length || 0} swimmers</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {classData.meetingDays?.join(', ') || 'No days set'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 p-2 text-gray-400">
                    {expandedClasses.has(classData.id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Class Details */}
              {expandedClasses.has(classData.id) && (
                <div className="px-6 py-4 bg-gray-50">
                  <div className="space-y-4">
                    {/* Participants Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Swimmer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Age
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Proficiency
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Instructor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Coverage
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Notes
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Missing Dates
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Payment
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {classData.participants?.map((participant) => (
                            <tr key={participant.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 w-8 h-8">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                                      {participant.name?.charAt(0)?.toUpperCase() || 'S'}
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {participant.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {participant.gender}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {participant.age || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  participant.proficiency === 'beginner' ? 'bg-green-100 text-green-800' :
                                  participant.proficiency === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                  participant.proficiency === 'advanced' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {participant.proficiency || 'N/A'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                {participant.instructor ? (
                                  <span className="text-sm text-gray-900">
                                    {typeof participant.instructor === 'string' 
                                      ? participant.instructor 
                                      : participant.instructor.name || 'Unknown'
                                    }
                                  </span>
                                ) : (
                                  <span className="text-gray-400 italic text-sm">Unassigned</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <CoverageIndicator lessonId={classData.id} swimmerId={participant.id} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center w-24">
                                {participant.instructorNotes || participant.instructor_notes ? (
                                  <button
                                    className="text-blue-600 hover:underline text-sm font-medium"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNotesModal({ open: true, notes: participant.instructorNotes || participant.instructor_notes });
                                    }}
                                  >
                                    View Notes
                                  </button>
                                ) : (
                                  <span className="text-gray-400 italic text-sm">None</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center w-24">
                                {participant.missing_dates ? (
                                  <button
                                    className="text-blue-600 hover:underline text-sm font-medium"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMissingDatesModal({ open: true, dates: participant.missing_dates, swimmer: participant.name });
                                    }}
                                  >
                                    View Dates
                                  </button>
                                ) : (
                                  <span className="text-gray-400 italic text-sm">None</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="flex items-center justify-center">
                                  {participant.payment_status ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                          
                          {(!classData.participants || classData.participants.length === 0) && (
                            <tr>
                              <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                                No swimmers enrolled in this class
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
          <p className="text-gray-600">No classes match the current filter criteria.</p>
        </div>
      )}

      {/* Notes Modal */}
      {notesModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setNotesModal({ open: false, notes: '' })}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4">Notes for Instructor</h3>
            <div className="text-gray-700 whitespace-pre-line break-words max-h-60 overflow-y-auto">
              {notesModal.notes}
            </div>
          </div>
        </div>
      )}

      {/* Missing Dates Modal */}
      {missingDatesModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setMissingDatesModal({ open: false, dates: '', swimmer: '' })}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4">Missing Dates - {missingDatesModal.swimmer}</h3>
            <div className="text-gray-700 whitespace-pre-line break-words max-h-60 overflow-y-auto">
              {missingDatesModal.dates.split(',').map((date, index) => (
                <div key={index} className="py-1">
                  <span className="font-medium">{date.trim()}</span>
                </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorClassOverview; 