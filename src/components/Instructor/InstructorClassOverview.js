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
  Clock as ClockIcon,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { DateFormatter } from '@/lib/utils/formatUtils';
import CoverageIndicator from '../shared/CoverageIndicator';

const InstructorClassOverview = () => {
  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('future');
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
    currentDate.setHours(0, 0, 0, 0);
    
    return classes.filter(classData => {
      const startDate = new Date(classData.startDate);
      const endDate = new Date(classData.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      switch (filter) {
        case 'past':
          // Archived lessons: end date has passed
          return endDate < currentDate;
        case 'current':
          // Lessons currently running
          return startDate <= currentDate && endDate >= currentDate;
        case 'future':
          // Upcoming lessons that haven't started
          return startDate > currentDate && endDate >= currentDate;
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pool-blue"></div>
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pool-blue to-brandeis-blue text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6">
              Class Schedule
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-2">
              View and manage your class schedules and instructor assignments
            </p>
            <div className="mt-6 md:mt-8 flex items-center justify-center space-x-2 text-blue-200">
              <Calendar className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-base md:text-lg">View Only - Instructor Access</span>
            </div>
          </div>
        </div>
        
        {/* Floating Elements - Hidden on mobile to prevent overflow */}
        <div className="hidden md:block absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="hidden md:block absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Stats Section */}
      <div className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-pool-blue to-brandeis-blue mx-auto mb-4"></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Schedule Overview
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Current status and statistics of your classes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-blue-100 rounded-lg md:rounded-xl group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                </div>
                <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-blue-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{classes.length}</h3>
              <p className="text-sm md:text-base text-gray-600 font-medium">Total Classes</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-green-100 rounded-lg md:rounded-xl group-hover:bg-green-200 transition-colors">
                  <Calendar className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                </div>
                <Clock className="w-4 h-4 md:w-6 md:h-6 text-green-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                {classes.filter(c => {
                  const startDate = new Date(c.startDate);
                  const endDate = new Date(c.endDate);
                  const currentDate = new Date();
                  return startDate <= currentDate && endDate >= currentDate;
                }).length}
              </h3>
              <p className="text-sm md:text-base text-gray-600 font-medium">Current Classes</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-purple-100 rounded-lg md:rounded-xl group-hover:bg-purple-200 transition-colors">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                </div>
                <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-purple-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                {classes.reduce((total, c) => total + (c.participants?.length || 0), 0)}
              </h3>
              <p className="text-sm md:text-base text-gray-600 font-medium">Total Swimmers</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-orange-100 rounded-lg md:rounded-xl group-hover:bg-orange-200 transition-colors">
                  <Clock className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
                </div>
                <Calendar className="w-4 h-4 md:w-6 md:h-6 text-orange-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                {classes.filter(c => {
                  const startDate = new Date(c.startDate);
                  const currentDate = new Date();
                  return startDate > currentDate;
                }).length}
              </h3>
              <p className="text-sm md:text-base text-gray-600 font-medium">Future Classes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Classes Section */}
      <div className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                <span className="text-xs md:text-sm font-medium text-gray-700">Filter:</span>
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-pool-blue focus:border-pool-blue transition-all duration-200"
              >
                <option value="all">All Classes</option>
                <option value="current">Current Classes</option>
                <option value="future">Future Classes</option>
                <option value="past">Past Classes</option>
              </select>
            </div>
            
            <div className="text-xs md:text-sm text-gray-500 bg-gray-100 px-3 md:px-4 py-2 rounded-lg">
              {filteredClasses.length} of {classes.length} classes
            </div>
          </div>

          {/* Classes List */}
          {filteredClasses.length > 0 ? (
            <div className="space-y-4 md:space-y-6">
              {filteredClasses.map((classData) => (
                <div key={classData.id} className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                  {/* Class Header - Now Entirely Clickable */}
                  <div 
                    className="px-4 md:px-6 py-4 md:py-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-all duration-200"
                    onClick={() => toggleClassExpanded(classData.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-semibold flex items-center text-gray-900 mb-2 md:mb-3">
                          {classData.meetingDays?.join(', ') || ''} Swim Class
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
                          <div className="flex items-center space-x-1 md:space-x-2">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4 text-pool-blue" />
                            <span className="truncate">
                              {DateFormatter.formatForDisplay(classData.startDate)} - {DateFormatter.formatForDisplay(classData.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 md:space-x-2">
                            <Clock className="w-3 h-3 md:w-4 md:h-4 text-pool-blue" />
                            <span>{classData.time}</span>
                          </div>
                          <div className="flex items-center space-x-1 md:space-x-2">
                            <Users className="w-3 h-3 md:w-4 md:h-4 text-pool-blue" />
                            <span>{classData.participants?.length || 0} swimmers</span>
                          </div>
                          <div className="flex items-center space-x-1 md:space-x-2">
                            <span className="text-xs px-2 md:px-3 py-1 rounded-full bg-pool-blue/10 text-pool-blue font-medium truncate">
                              {classData.meetingDays?.join(', ') || 'No days set'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-2 md:ml-4 p-2 text-gray-400 hover:text-pool-blue transition-colors">
                        {expandedClasses.has(classData.id) ? (
                          <ChevronUp className="w-5 h-5 md:w-6 md:h-6" />
                        ) : (
                          <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Class Details */}
                  {expandedClasses.has(classData.id) && (
                    <div className="px-4 md:px-6 py-4 md:py-6 bg-gray-50">
                      <div className="space-y-4 md:space-y-6">
                        {/* Participants Table */}
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Swimmer
                                </th>
                                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Age
                                </th>
                                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Proficiency
                                </th>
                                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Instructor
                                </th>
                                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Coverage
                                </th>
                                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Notes
                                </th>
                                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Missing Dates
                                </th>
                                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Payment
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {classData.participants?.map((participant) => (
                                <tr key={participant.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8">
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-pool-blue flex items-center justify-center text-white text-xs md:text-sm font-medium">
                                          {participant.name?.charAt(0)?.toUpperCase() || 'S'}
                                        </div>
                                      </div>
                                      <div className="ml-2 md:ml-4">
                                        <div className="text-xs md:text-sm font-medium text-gray-900">
                                          {participant.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {participant.gender}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                                    {participant.age || 'N/A'}
                                  </td>
                                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      participant.proficiency === 'beginner' ? 'bg-green-100 text-green-800' :
                                      participant.proficiency === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                      participant.proficiency === 'advanced' ? 'bg-red-100 text-red-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {participant.proficiency || 'N/A'}
                                    </span>
                                  </td>
                                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-center">
                                    {participant.instructor ? (
                                      <span className="text-xs md:text-sm text-gray-900">
                                        {typeof participant.instructor === 'string' 
                                          ? participant.instructor 
                                          : participant.instructor.name || 'Unknown'
                                        }
                                      </span>
                                    ) : (
                                      <span className="text-gray-400 italic text-xs md:text-sm">Unassigned</span>
                                    )}
                                  </td>
                                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-center">
                                    <CoverageIndicator lessonId={classData.id} swimmerId={participant.id} />
                                  </td>
                                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-center w-20 md:w-24">
                                    {participant.instructorNotes || participant.instructor_notes ? (
                                      <button
                                        className="text-pool-blue hover:text-brandeis-blue transition-colors text-xs md:text-sm font-medium"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setNotesModal({ open: true, notes: participant.instructorNotes || participant.instructor_notes });
                                        }}
                                      >
                                        View Notes
                                      </button>
                                    ) : (
                                      <span className="text-gray-400 italic text-xs md:text-sm">None</span>
                                    )}
                                  </td>
                                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-center w-20 md:w-24">
                                    {participant.missing_dates ? (
                                      <button
                                        className="text-pool-blue hover:text-brandeis-blue transition-colors text-xs md:text-sm font-medium"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setMissingDatesModal({ open: true, dates: participant.missing_dates, swimmer: participant.name });
                                        }}
                                      >
                                        View Dates
                                      </button>
                                    ) : (
                                      <span className="text-gray-400 italic text-xs md:text-sm">None</span>
                                    )}
                                  </td>
                                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-center">
                                    <div className="flex items-center justify-center">
                                      {participant.payment_status ? (
                                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                                      ) : (
                                        <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              
                              {(!classData.participants || classData.participants.length === 0) && (
                                <tr>
                                  <td colSpan="9" className="px-3 md:px-6 py-3 md:py-4 text-center text-gray-500 text-xs md:text-sm">
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
            <div className="text-center py-8 md:py-12">
              <Calendar className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No classes found</h3>
              <p className="text-sm md:text-base text-gray-600">No classes match the current filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Notes Modal */}
      {notesModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setNotesModal({ open: false, notes: '' })}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Notes for Instructor</h3>
            <div className="text-gray-700 whitespace-pre-line break-words max-h-60 overflow-y-auto bg-gray-50 p-4 rounded-xl">
              {notesModal.notes}
            </div>
          </div>
        </div>
      )}

      {/* Missing Dates Modal */}
      {missingDatesModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setMissingDatesModal({ open: false, dates: '', swimmer: '' })}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Missing Dates - {missingDatesModal.swimmer}</h3>
            <div className="text-gray-700 whitespace-pre-line break-words max-h-60 overflow-y-auto bg-gray-50 p-4 rounded-xl">
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