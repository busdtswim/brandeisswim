const pool = require('../database.js');
const { z } = require('zod');

/**
 * @typedef {Object} SwimmerLessonCreateDTO
 * @property {number} swimmer_id - Swimmer ID
 * @property {number} lesson_id - Lesson ID
 * @property {string} [registration_date] - Registration date
 * @property {boolean} [payment_status] - Payment status
 * @property {number} [instructor_id] - Assigned instructor ID
 * @property {string} [instructor_notes] - Instructor notes
 * @property {number} [preferred_instructor_id] - Preferred instructor ID
 * @property {string} [missing_dates] - Comma-separated dates when swimmer will be absent
 */

/**
 * @typedef {Object} SwimmerLessonUpdateDTO
 * @property {string} [registration_date] - Registration date
 * @property {boolean} [payment_status] - Payment status
 * @property {number} [instructor_id] - Assigned instructor ID
 * @property {string} [instructor_notes] - Instructor notes
 * @property {number} [preferred_instructor_id] - Preferred instructor ID
 * @property {string} [missing_dates] - Comma-separated dates when swimmer will be absent
 */

/**
 * @typedef {Object} SwimmerLesson
 * @property {number} swimmer_id - Swimmer ID
 * @property {number} lesson_id - Lesson ID
 * @property {string} [registration_date] - Registration date
 * @property {boolean} [payment_status] - Payment status
 * @property {number} [instructor_id] - Assigned instructor ID
 * @property {string} [instructor_notes] - Instructor notes
 * @property {number} [preferred_instructor_id] - Preferred instructor ID
 * @property {string} [missing_dates] - Comma-separated dates when swimmer will be absent
 */

// Zod schemas for validation
const SwimmerLessonCreateSchema = z.object({
  swimmer_id: z.number().positive('Swimmer ID must be positive'),
  lesson_id: z.number().positive('Lesson ID must be positive'),
  registration_date: z.string().optional(),
  payment_status: z.boolean().optional(),
  instructor_id: z.number().positive('Instructor ID must be positive').nullable().optional(),
  instructor_notes: z.string().nullable().optional(),
  preferred_instructor_id: z.number().positive('Preferred instructor ID must be positive').nullable().optional(),
  missing_dates: z.string().nullable().optional(),
});

const SwimmerLessonUpdateSchema = z.object({
  registration_date: z.string().optional(),
  payment_status: z.boolean().optional(),
  instructor_id: z.number().positive('Instructor ID must be positive').nullable().optional(),
  instructor_notes: z.string().nullable().optional(),
  preferred_instructor_id: z.number().positive('Preferred instructor ID must be positive').nullable().optional(),
  missing_dates: z.string().nullable().optional(),
});

// Schema for adding missing dates
const MissingDatesSchema = z.object({
  missing_dates: z.string().min(1, 'Missing dates are required'),
});

class SwimmerLessonStore {
  /**
   * Create a new swimmer lesson registration
   * @param {SwimmerLessonCreateDTO} swimmerLessonData
   * @returns {Promise<SwimmerLesson>}
   */
  static async create(swimmerLessonData) {
    try {
      // Validate input
      const validatedData = SwimmerLessonCreateSchema.parse(swimmerLessonData);
      
      const query = `
        INSERT INTO swimmer_lessons (swimmer_id, lesson_id, registration_date, payment_status, instructor_id, instructor_notes, preferred_instructor_id, missing_dates)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING swimmer_id, lesson_id, registration_date, payment_status, instructor_id, instructor_notes, preferred_instructor_id, missing_dates
      `;
      
      const values = [
        validatedData.swimmer_id,
        validatedData.lesson_id,
        validatedData.registration_date,
        validatedData.payment_status,
        validatedData.instructor_id,
        validatedData.instructor_notes,
        validatedData.preferred_instructor_id,
        validatedData.missing_dates
      ];
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23503') { // Foreign key constraint violation
        throw new Error('Referenced swimmer or lesson does not exist');
      }
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('Swimmer is already registered for this lesson');
      }
      throw new Error(`Failed to create swimmer lesson: ${error.message}`);
    }
  }

  /**
   * Find swimmer lesson by swimmer and lesson IDs
   * @param {number} swimmerId
   * @param {number} lessonId
   * @returns {Promise<SwimmerLesson|null>}
   */
  static async findBySwimmerAndLesson(swimmerId, lessonId) {
    try {
      const query = `
        SELECT sl.swimmer_id, sl.lesson_id, sl.registration_date, sl.payment_status, sl.instructor_id, sl.instructor_notes, sl.preferred_instructor_id, sl.missing_dates,
               s.name as swimmer_name, s.proficiency, s.gender, s.birthdate,
               l.meeting_days, l.max_slots, l.start_time, l.end_time, l.start_date, l.end_date,
               i1.name as instructor_name, i1.email as instructor_email,
               i2.name as preferred_instructor_name, i2.email as preferred_instructor_email
        FROM swimmer_lessons sl
        JOIN swimmers s ON sl.swimmer_id = s.id
        JOIN lessons l ON sl.lesson_id = l.id
        LEFT JOIN instructors i1 ON sl.instructor_id = i1.id
        LEFT JOIN instructors i2 ON sl.preferred_instructor_id = i2.id
        WHERE sl.swimmer_id = $1 AND sl.lesson_id = $2
      `;
      
      const result = await pool.query(query, [swimmerId, lessonId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find swimmer lesson: ${error.message}`);
    }
  }

  /**
   * Find swimmer lessons by swimmer ID
   * @param {number} swimmerId
   * @returns {Promise<Array>}
   */
  static async findBySwimmerId(swimmerId) {
    try {
      const query = `
        SELECT sl.swimmer_id, sl.lesson_id, sl.registration_date, sl.payment_status, sl.instructor_id, sl.instructor_notes, sl.preferred_instructor_id, sl.missing_dates,
               s.name as swimmer_name, s.proficiency, s.gender, s.birthdate,
               l.meeting_days, l.max_slots, l.start_time, l.end_time, l.start_date, l.end_date,
               i1.name as instructor_name, i1.email as instructor_email,
               i2.name as preferred_instructor_name, i2.email as preferred_instructor_email
        FROM swimmer_lessons sl
        JOIN swimmers s ON sl.swimmer_id = s.id
        JOIN lessons l ON sl.lesson_id = l.id
        LEFT JOIN instructors i1 ON sl.instructor_id = i1.id
        LEFT JOIN instructors i2 ON sl.preferred_instructor_id = i2.id
        WHERE sl.swimmer_id = $1
        ORDER BY sl.registration_date DESC
      `;
      
      const result = await pool.query(query, [swimmerId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to find swimmer lessons: ${error.message}`);
    }
  }

  /**
   * Find lesson participants by lesson ID
   * @param {number} lessonId
   * @returns {Promise<Array>}
   */
  static async findByLessonId(lessonId) {
    try {
      const query = `
        SELECT sl.swimmer_id, sl.lesson_id, sl.registration_date, sl.payment_status, sl.instructor_id, sl.instructor_notes, sl.preferred_instructor_id, sl.missing_dates,
               s.name as swimmer_name, s.proficiency, s.gender, s.birthdate,
               l.meeting_days, l.max_slots, l.start_time, l.end_time, l.start_date, l.end_date,
               i1.name as instructor_name, i1.email as instructor_email,
               i2.name as preferred_instructor_name, i2.email as preferred_instructor_email
        FROM swimmer_lessons sl
        JOIN swimmers s ON sl.swimmer_id = s.id
        JOIN lessons l ON sl.lesson_id = l.id
        LEFT JOIN instructors i1 ON sl.instructor_id = i1.id
        LEFT JOIN instructors i2 ON sl.preferred_instructor_id = i2.id
        WHERE sl.lesson_id = $1
        ORDER BY sl.registration_date
      `;
      
      const result = await pool.query(query, [lessonId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to find lesson participants: ${error.message}`);
    }
  }

  /**
   * Update swimmer lesson
   * @param {number} swimmerId
   * @param {number} lessonId
   * @param {SwimmerLessonUpdateDTO} updateData
   * @returns {Promise<SwimmerLesson|null>}
   */
  static async update(swimmerId, lessonId, updateData) {
    try {
      // Validate input
      const validatedData = SwimmerLessonUpdateSchema.parse(updateData);
      
      const setClause = [];
      const values = [];
      let paramCount = 1;

      if (validatedData.registration_date !== undefined) {
        setClause.push(`registration_date = $${paramCount++}`);
        values.push(validatedData.registration_date);
      }
      if (validatedData.payment_status !== undefined) {
        setClause.push(`payment_status = $${paramCount++}`);
        values.push(validatedData.payment_status);
      }
      if (validatedData.instructor_id !== undefined) {
        setClause.push(`instructor_id = $${paramCount++}`);
        values.push(validatedData.instructor_id);
      }
      if (validatedData.instructor_notes !== undefined) {
        setClause.push(`instructor_notes = $${paramCount++}`);
        values.push(validatedData.instructor_notes);
      }
      if (validatedData.preferred_instructor_id !== undefined) {
        setClause.push(`preferred_instructor_id = $${paramCount++}`);
        values.push(validatedData.preferred_instructor_id);
      }
      if (validatedData.missing_dates !== undefined) {
        setClause.push(`missing_dates = $${paramCount++}`);
        values.push(validatedData.missing_dates);
      }

      if (setClause.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(swimmerId, lessonId);
      const query = `
        UPDATE swimmer_lessons
        SET ${setClause.join(', ')}
        WHERE swimmer_id = $${paramCount++} AND lesson_id = $${paramCount}
        RETURNING swimmer_id, lesson_id, registration_date, payment_status, instructor_id, instructor_notes, preferred_instructor_id, missing_dates
      `;
      
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      if (error.code === '23503') { // Foreign key constraint violation
        throw new Error('Referenced instructor does not exist');
      }
      throw new Error(`Failed to update swimmer lesson: ${error.message}`);
    }
  }

  /**
   * Delete swimmer lesson
   * @param {number} swimmerId
   * @param {number} lessonId
   * @returns {Promise<{swimmer_id: number, lesson_id: number}|null>}
   */
  static async delete(swimmerId, lessonId) {
    try {
      const query = 'DELETE FROM swimmer_lessons WHERE swimmer_id = $1 AND lesson_id = $2 RETURNING swimmer_id, lesson_id';
      const result = await pool.query(query, [swimmerId, lessonId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to delete swimmer lesson: ${error.message}`);
    }
  }

  /**
   * Count participants by lesson ID
   * @param {number} lessonId
   * @returns {Promise<number>}
   */
  static async countByLessonId(lessonId) {
    try {
      const query = 'SELECT COUNT(*) as count FROM swimmer_lessons WHERE lesson_id = $1';
      const result = await pool.query(query, [lessonId]);
      return parseInt(result.rows[0].count);
    } catch (error) {
      throw new Error(`Failed to count lesson participants: ${error.message}`);
    }
  }

  /**
   * Find available slots for a lesson
   * @param {number} lessonId
   * @returns {Promise<number>}
   */
  static async findAvailableSlots(lessonId) {
    try {
      const query = `
        SELECT l.max_slots, COUNT(sl.swimmer_id) as current_participants
        FROM lessons l
        LEFT JOIN swimmer_lessons sl ON l.id = sl.lesson_id
        WHERE l.id = $1
        GROUP BY l.id, l.max_slots
      `;
      
      const result = await pool.query(query, [lessonId]);
      if (result.rows.length === 0) {
        throw new Error('Lesson not found');
      }
      
      const { max_slots, current_participants } = result.rows[0];
      return Math.max(0, max_slots - parseInt(current_participants));
    } catch (error) {
      throw new Error(`Failed to find available slots: ${error.message}`);
    }
  }

  /**
   * Unassign instructor from all lessons
   * @param {number} instructorId
   * @returns {Promise<{updatedCount: number}>}
   */
  static async unassignInstructorFromAllLessons(instructorId) {
    try {
      const query = `
        UPDATE swimmer_lessons
        SET instructor_id = NULL
        WHERE instructor_id = $1
      `;
      
      const result = await pool.query(query, [instructorId]);
      return { updatedCount: result.rowCount };
    } catch (error) {
      throw new Error(`Failed to unassign instructor from lessons: ${error.message}`);
    }
  }

  /**
   * Check if a swimmer is enrolled in a specific lesson
   * @param {number} swimmerId
   * @param {number} lessonId
   * @returns {Promise<boolean>}
   */
  static async isSwimmerEnrolledInLesson(swimmerId, lessonId) {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM swimmer_lessons 
        WHERE swimmer_id = $1 AND lesson_id = $2
      `;
      
      const result = await pool.query(query, [swimmerId, lessonId]);
      return result.rows[0].count > 0;
    } catch (error) {
      throw new Error(`Failed to check swimmer enrollment: ${error.message}`);
    }
  }

  /**
   * Update instructor notes for a swimmer's lesson
   * @param {number} swimmerId - Swimmer ID
   * @param {number} lessonId - Lesson ID
   * @param {string} notes - New instructor notes
   * @returns {Promise<Object|null>}
   */
  static async updateInstructorNotes(swimmerId, lessonId, notes) {
    try {
      const query = `
        UPDATE swimmer_lessons
        SET instructor_notes = $1
        WHERE swimmer_id = $2 AND lesson_id = $3
        RETURNING swimmer_id, lesson_id, instructor_notes
      `;
      
      const result = await pool.query(query, [notes, swimmerId, lessonId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to update instructor notes: ${error.message}`);
    }
  }

  /**
   * Get participants for a specific lesson assigned to a specific instructor
   * @param {number} lessonId
   * @param {number} instructorId
   * @returns {Promise<Array>} Array of participants assigned to this instructor
   */
  static async getLessonParticipants(lessonId, instructorId) {
    try {
      const query = `
        SELECT s.id, s.name, s.proficiency
        FROM swimmers s
        INNER JOIN swimmer_lessons sl ON s.id = sl.swimmer_id
        WHERE sl.lesson_id = $1 AND sl.instructor_id = $2
        ORDER BY s.name
      `;
      
      const result = await pool.query(query, [lessonId, instructorId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to get lesson participants: ${error.message}`);
    }
  }

  /**
   * Add missing dates for a swimmer's lesson
   * @param {number} swimmerId - Swimmer ID
   * @param {number} lessonId - Lesson ID
   * @param {string} missingDates - Comma-separated dates (MM/DD/YYYY format)
   * @returns {Promise<Object>} Updated swimmer lesson record
   */
  static async addMissingDates(swimmerId, lessonId, missingDates) {
    try {
      // Validate input
      const validatedData = MissingDatesSchema.parse({ missing_dates: missingDates });
      
      // Get current missing dates
      const currentRecord = await this.findBySwimmerAndLesson(swimmerId, lessonId);
      if (!currentRecord) {
        throw new Error('Swimmer lesson registration not found');
      }
      
      // Parse and validate dates
      const newDates = validatedData.missing_dates.split(',').map(date => date.trim());
      const currentDates = currentRecord.missing_dates ? currentRecord.missing_dates.split(',').map(date => date.trim()) : [];
      
      // Check for duplicates
      const duplicates = newDates.filter(date => currentDates.includes(date));
      if (duplicates.length > 0) {
        throw new Error(`Dates already marked as missing: ${duplicates.join(', ')}`);
      }
      
      // Combine dates and sort them
      const allDates = [...currentDates, ...newDates].sort();
      const combinedDates = allDates.join(',');
      
      // Update the record
      const query = `
        UPDATE swimmer_lessons
        SET missing_dates = $1
        WHERE swimmer_id = $2 AND lesson_id = $3
        RETURNING swimmer_id, lesson_id, missing_dates
      `;
      
      const result = await pool.query(query, [combinedDates, swimmerId, lessonId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to add missing dates: ${error.message}`);
    }
  }

  /**
   * Get missing dates for a swimmer's lesson
   * @param {number} swimmerId - Swimmer ID
   * @param {number} lessonId - Lesson ID
   * @returns {Promise<string|null>} Comma-separated missing dates or null
   */
  static async getMissingDates(swimmerId, lessonId) {
    try {
      const query = `
        SELECT missing_dates
        FROM swimmer_lessons
        WHERE swimmer_id = $1 AND lesson_id = $2
      `;
      
      const result = await pool.query(query, [swimmerId, lessonId]);
      return result.rows[0]?.missing_dates || null;
    } catch (error) {
      throw new Error(`Failed to get missing dates: ${error.message}`);
    }
  }

  /**
   * Check if a specific date is marked as missing for a swimmer
   * @param {number} swimmerId - Swimmer ID
   * @param {number} lessonId - Lesson ID
   * @param {string} date - Date to check (MM/DD/YYYY format)
   * @returns {Promise<boolean>} True if date is marked as missing
   */
  static async isDateMarkedAsMissing(swimmerId, lessonId, date) {
    try {
      const missingDates = await this.getMissingDates(swimmerId, lessonId);
      if (!missingDates) return false;
      
      const datesList = missingDates.split(',').map(d => d.trim());
      return datesList.includes(date);
    } catch (error) {
      throw new Error(`Failed to check missing date: ${error.message}`);
    }
  }

  /**
   * Get all swimmers with missing dates for a specific lesson
   * @param {number} lessonId - Lesson ID
   * @returns {Promise<Array>} Array of swimmers with missing dates
   */
  static async getSwimmersWithMissingDates(lessonId) {
    try {
      const query = `
        SELECT sl.swimmer_id, sl.missing_dates, s.name as swimmer_name
        FROM swimmer_lessons sl
        INNER JOIN swimmers s ON sl.swimmer_id = s.id
        WHERE sl.lesson_id = $1 AND sl.missing_dates IS NOT NULL AND sl.missing_dates != ''
        ORDER BY s.name
      `;
      
      const result = await pool.query(query, [lessonId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to get swimmers with missing dates: ${error.message}`);
    }
  }
}

module.exports = SwimmerLessonStore; 