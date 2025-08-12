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
  X 
} from 'lucide-react';
import { DateFormatter } from '@/lib/utils/formatUtils';
import EditExceptionsModal from '../EditExceptionModal';
import { hasScheduleConflict } from '@/lib/utils/timeUtils';

const ViewSchedule = () => {
  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignError, setAssignError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [expandedClasses, setExpandedClasses] = useState(new Set());
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showMessage, setShowMessage] = useState(false);
  const [notesModal, setNotesModal] = useState({ open: false, notes: '' });

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
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const displayMessage = (text, type) => {
    setMessage({ text, type });
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 5000);
  };

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

  const handleInstructorAssign = async (classId, swimmerId, instructorId) => {
    try {
      setAssignError(null);
      if (!instructorId) {
        // Unassign instructor
        const assignResponse = await fetch(`/api/auth/lessons/assign/${classId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ swimmerId: parseInt(swimmerId), instructorId: null }),
        });
        if (!assignResponse.ok) {
          const errorData = await assignResponse.json();
          throw new Error(errorData.error || 'Failed to unassign instructor');
        }
        // Notify instructor of unassignment
        const classData = classes.find(cls => cls.id === parseInt(classId));
        const prevInstructor = classData.participants.find(p => p.id === parseInt(swimmerId))?.instructor;
        if (prevInstructor) {
          try {
            await fetch('/api/auth/lessons/notify-instructor-unassign', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                instructor: prevInstructor,
                lessonDetails: {
                  startDate: classData.startDate,
                  endDate: classData.endDate,
                  meetingDays: classData.meetingDays,
                  time: classData.time,
                },
              }),
            });
          } catch (notifyError) {
            console.error('Error sending unassign notification:', notifyError);
          }
        }
        // Update UI state
        setClasses(prevClasses => prevClasses.map(cls => {
          if (cls.id === parseInt(classId)) {
            return {
              ...cls,
              participants: cls.participants.map(p => {
                if (p.id === parseInt(swimmerId)) {
                  return { ...p, instructor_id: null, instructor: null };
                }
                return p;
              })
            };
          }
          return cls;
        }));
        return;
      }
      const response = await fetch('/api/auth/lessons/classes');
      if (!response.ok) {
        throw new Error('Failed to fetch lessons data');
      }
      const allLessons = await response.json();
      const currentLesson = allLessons.find(cls => cls.id === parseInt(classId));
      const hasConflict = allLessons.some(otherLesson => {
        if (otherLesson.id === parseInt(classId)) return false;
        const hasInstructorInOtherLesson = otherLesson.participants.some(
          p => p.instructor_id === parseInt(instructorId)
        );
        if (!hasInstructorInOtherLesson) return false;
        // Use hasScheduleConflict for accurate time overlap
        return hasScheduleConflict(currentLesson, otherLesson);
      });
      if (hasConflict) {
        setAssignError('This instructor has a scheduling conflict during this time slot.');
        return;
      }
      // Assign instructor
      const assignResponse = await fetch(`/api/auth/lessons/assign/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ swimmerId: parseInt(swimmerId), instructorId: parseInt(instructorId) }),
      });
      if (!assignResponse.ok) {
        const errorData = await assignResponse.json();
        throw new Error(errorData.error || 'Failed to assign instructor');
      }
      // Notify instructor of assignment
      const classData = classes.find(cls => cls.id === parseInt(classId));
      const swimmer = classData.participants.find(p => p.id === parseInt(swimmerId));
      const instructor = instructors.find(i => i.id === parseInt(instructorId));
      if (instructor) {
        try {
          await fetch('/api/auth/lessons/notify-instructor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              instructor,
              swimmer: {
                ...swimmer,
                instructor_notes: swimmer.instructorNotes || swimmer.instructor_notes || '',
              },
              lessonDetails: {
                startDate: classData.startDate,
                endDate: classData.endDate,
                meetingDays: classData.meetingDays,
                time: classData.time,
              },
            }),
          });
        } catch (notifyError) {
          console.error('Error sending notification:', notifyError);
        }
      }
      // Update UI state
      setClasses(prevClasses => prevClasses.map(cls => {
        if (cls.id === parseInt(classId)) {
          return {
            ...cls,
            participants: cls.participants.map(p => {
              if (p.id === parseInt(swimmerId)) {
                const assignedInstructor = instructors.find(i => i.id === parseInt(instructorId));
                return {
                  ...p,
                  instructor_id: parseInt(instructorId),
                  instructor: assignedInstructor || null
                };
              }
              return p;
            })
          };
        }
        return cls;
      }));
    } catch (error) {
      console.error('Error in handleInstructorAssign:', error);
      setAssignError(error.message);
      displayMessage(`Error: ${error.message}`, 'error');
    }
  };

  const handlePaymentStatusChange = async (classId, swimmerId, status) => {
    try {
      const response = await fetch('/api/auth/lessons/payment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: classId,
          swimmerId: swimmerId,
          status: status
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      setClasses(classes.map(cls => {
        if (cls.id === classId) {
          return {
            ...cls,
            participants: cls.participants.map(p => {
              if (p.id === swimmerId) {
                return { ...p, payment_status: status };
              }
              return p;
            })
          };
        }
        return cls;
      }));

      displayMessage(`Payment status ${status ? 'confirmed' : 'marked as pending'}`, 'success');
    } catch (error) {
      console.error('Error updating payment status:', error);
      displayMessage('Failed to update payment status', 'error');
    }
  };

  const handleEditExceptionsUpdate = async (updatedLesson) => {
    try {
      setClasses(prevClasses => 
        prevClasses.map(cls => 
          cls.id === updatedLesson.id ? {
            ...cls,
            ...updatedLesson,
            startDate: updatedLesson.start_date || cls.startDate,
            endDate: updatedLesson.end_date || cls.endDate,
            meetingDays: Array.isArray(updatedLesson.meeting_days) 
              ? updatedLesson.meeting_days 
              : updatedLesson.meeting_days?.split(',') || [],
            exception_dates: updatedLesson.exception_dates || []
          } : cls
        )
      );
      setSelectedLesson(null);
      await fetchData();
      displayMessage('Lesson exceptions updated successfully', 'success');
    } catch (error) {
      console.error('Error updating exceptions:', error);
      displayMessage('Failed to update exceptions', 'error');
    }
  };

  const handleRemoveSwimmer = async (classId, swimmerId) => {
    if (window.confirm('Are you sure you want to remove this swimmer from the lesson?')) {
      try {
        const response = await fetch('/api/auth/lessons/remove-swimmer', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lessonId: classId, swimmerId }),
        });

        if (!response.ok) {
          throw new Error('Failed to remove swimmer');
        }

        setClasses(prevClasses => prevClasses.map(cls => {
          if (cls.id === classId) {
            return {
              ...cls,
              participants: cls.participants.filter(p => p.id !== swimmerId)
            };
          }
          return cls;
        }));
        
        displayMessage('Swimmer removed successfully', 'success');
      } catch (error) {
        console.error('Error removing swimmer:', error);
        displayMessage('Failed to remove swimmer from lesson', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">View Schedule</h1>
        <p className="text-gray-600">Manage class schedules, assign instructors, and track payments.</p>
      </div>
      
      {/* Notification message */}
      {showMessage && (
        <div className={`mb-6 p-4 rounded-lg flex items-start ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border-l-4 border-green-500' 
            : 'bg-red-50 text-red-800 border-l-4 border-red-500'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 mr-3 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 mr-3 mt-0.5" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      {/* Error display */}
      {error && !showMessage && (
        <div className="mb-6 p-4 rounded-lg flex items-start bg-red-50 text-red-800 border-l-4 border-red-500">
          <AlertTriangle className="w-5 h-5 mr-3 mt-0.5" />
          <div>
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Filter className="text-gray-400 mr-2" size={20} />
            <label htmlFor="filter" className="text-sm font-medium text-gray-700 mr-2">Filter Classes:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Classes</option>
              <option value="past">Past Classes</option>
              <option value="current">Current Classes</option>
              <option value="future">Future Classes</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredClasses.length}</span> {filteredClasses.length === 1 ? 'class' : 'classes'}
          </div>
        </div>
      </div>

      {/* Classes List */}
      {filteredClasses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-lg">No classes found for the selected filter.</p>
          <p className="text-gray-500 mt-2">Try changing your filter options or create new lessons.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredClasses.map(classData => (
            <div 
              key={classData.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div 
                className="bg-blue-600 text-white p-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleClassExpanded(classData.id)}
              >
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {classData.meetingDays?.join(', ') || ''} Swim Class
                  </h3>
                  <p className="text-sm text-blue-100 mt-1">
                    {DateFormatter.formatForDisplay(classData.startDate)} - {DateFormatter.formatForDisplay(classData.endDate)}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="px-3 py-1 rounded-full bg-white text-blue-600 text-sm font-medium mr-3">
                    {classData.participants?.length || 0}/{classData.capacity} Enrolled
                  </span>
                  {expandedClasses.has(classData.id) ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
              </div>
              
              {expandedClasses.has(classData.id) && (
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <Clock className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Time</p>
                            <p className="text-gray-600">{classData.time}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Calendar className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Meeting Days</p>
                            <p className="text-gray-600">{classData.meetingDays?.join(', ') || 'Not specified'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Users className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Capacity</p>
                            <p className="text-gray-600">{classData.participants?.length || 0}/{classData.capacity}</p>
                          </div>
                        </div>
                        
                        {classData.exception_dates && Array.isArray(classData.exception_dates) && classData.exception_dates.length > 0 && (
                          <div className="flex items-start">
                            <X className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-red-600">Exception Dates</p>
                              <p className="text-gray-600">{DateFormatter.formatExceptionDates(classData.exception_dates)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLesson(classData);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Edit Exceptions
                      </button>
                    </div>
                    
                    {assignError && (
                      <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md">
                        <div className="flex">
                          <AlertTriangle className="w-5 h-5 mr-3 mt-0.5" />
                          <span>{assignError}</span>
                        </div>
                      </div>
                    )}

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Swimmer
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Age/Gender
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Proficiency
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Preferred Instructor
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Assigned Instructor
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                              Notes for Instructor
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Payment
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {classData.participants?.map((participant) => (
                            <tr key={participant.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">{participant.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-gray-500">{participant.age} / {participant.gender}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  participant.proficiency === 'beginner' ? 'bg-blue-100 text-blue-800' :
                                  participant.proficiency === 'intermediate' ? 'bg-green-100 text-green-800' :
                                  participant.proficiency === 'advanced' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {participant.proficiency || 'N/A'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {participant.preferred_instructor ? (
                                  <div className="text-gray-900">{participant.preferred_instructor.name}</div>
                                ) : (
                                  <div className="text-gray-400 italic">No preference</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={participant.instructor_id || ''}
                                  onChange={(e) => handleInstructorAssign(
                                    classData.id,
                                    participant.id,
                                    e.target.value
                                  )}
                                  className="w-full border rounded-md p-2 text-sm"
                                >
                                  <option value="">Select instructor</option>
                                  {instructors.map((instructor) => (
                                    <option key={instructor.id} value={instructor.id}>
                                      {instructor.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center w-24">
                                {participant.instructorNotes || participant.instructor_notes ? (
                                  <button
                                    className="text-blue-600 hover:underline text-sm font-medium"
                                    onClick={() => setNotesModal({ open: true, notes: participant.instructorNotes || participant.instructor_notes })}
                                  >
                                    View Notes
                                  </button>
                                ) : (
                                  <span className="text-gray-400 italic text-sm">None</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="relative inline-block w-10 align-middle select-none">
                                  <input
                                    type="checkbox"
                                    name={`payment-${participant.id}`}
                                    id={`payment-${participant.id}`}
                                    checked={participant.payment_status || false}
                                    onChange={(e) => handlePaymentStatusChange(
                                      classData.id,
                                      participant.id,
                                      e.target.checked
                                    )}
                                    className="sr-only"
                                  />
                                  <label
                                    htmlFor={`payment-${participant.id}`}
                                    className={`
                                      block overflow-hidden h-6 rounded-full cursor-pointer
                                      transition-colors duration-200 ease-in-out
                                      ${participant.payment_status ? 'bg-green-500' : 'bg-gray-300'}
                                    `}
                                  >
                                    <span
                                      className={`
                                        block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out
                                        ${participant.payment_status ? 'translate-x-4' : 'translate-x-0'}
                                      `}
                                    ></span>
                                  </label>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <button
                                  onClick={() => handleRemoveSwimmer(classData.id, participant.id)}
                                  className="text-red-600 hover:text-red-800 font-medium"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                          
                          {(!classData.participants || classData.participants.length === 0) && (
                            <tr>
                              <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
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
      )}

      {/* Exception Modal */}
      {selectedLesson && (
        <EditExceptionsModal
          isOpen={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
          lessonId={selectedLesson?.id}
          onUpdate={handleEditExceptionsUpdate}
        />
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
    </div>
  );
};

export default ViewSchedule;