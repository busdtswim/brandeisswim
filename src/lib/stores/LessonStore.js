const pool = require('../database.js');
const { z } = require('zod');

/**
 * @typedef {Object} LessonCreateDTO
 * @property {string} meeting_days - Comma-separated days (e.g., "Monday,Wednesday")
 * @property {number} max_slots - Maximum number of participants
 * @property {string} [exception_dates] - Comma-separated exception dates
 * @property {string} [start_time] - Start time (HH:MM format)
 * @property {string} [end_time] - End time (HH:MM format)
 * @property {string} [start_date] - Start date (MM/DD/YYYY format)
 * @property {string} [end_date] - End date (MM/DD/YYYY format)
 */

/**
 * @typedef {Object} LessonUpdateDTO
 * @property {string} [meeting_days] - Comma-separated days
 * @property {number} [max_slots] - Maximum number of participants
 * @property {string} [exception_dates] - Comma-separated exception dates
 * @property {string} [start_time] - Start time (HH:MM format)
 * @property {string} [end_time] - End time (HH:MM format)
 * @property {string} [start_date] - Start date (MM/DD/YYYY format)
 * @property {string} [end_date] - End date (MM/DD/YYYY format)
 */

/**
 * @typedef {Object} Lesson
 * @property {number} id - Lesson ID
 * @property {string} meeting_days - Comma-separated days
 * @property {number} max_slots - Maximum number of participants
 * @property {string} [exception_dates] - Comma-separated exception dates
 * @property {string} [start_time] - Start time
 * @property {string} [end_time] - End time
 * @property {string} [start_date] - Start date
 * @property {string} [end_date] - End date
 */

/**
 * @typedef {Object} LessonWithParticipants
 * @property {number} id - Lesson ID
 * @property {string} meeting_days - Comma-separated days
 * @property {number} max_slots - Maximum number of participants
 * @property {string} [exception_dates] - Comma-separated exception dates
 * @property {string} [start_time] - Start time
 * @property {string} [end_time] - End time
 * @property {string} [start_date] - Start date
 * @property {string} [end_date] - End date
 * @property {Array} participants - Array of participant objects
 */

// Zod schemas for validation
const LessonCreateSchema = z.object({
  meeting_days: z.string().min(1, 'Meeting days are required'),
  max_slots: z.number().positive('Max slots must be positive'),
  exception_dates: z.string().nullable().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

const LessonUpdateSchema = z.object({
  meeting_days: z.string().min(1, 'Meeting days are required').optional(),
  max_slots: z.number().positive('Max slots must be positive').optional(),
  exception_dates: z.string().nullable().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

class LessonStore {
  /**
   * Create a new lesson
   * @param {LessonCreateDTO} lessonData
   * @returns {Promise<Lesson>}
   */
  static async create(lessonData) {
    try {
      // Validate input
      const validatedData = LessonCreateSchema.parse(lessonData);
      
      const query = `
        INSERT INTO lessons (meeting_days, max_slots, exception_dates, start_time, end_time, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, meeting_days, max_slots, exception_dates, start_time, end_time, start_date, end_date
      `;
      
      const values = [
        validatedData.meeting_days,
        validatedData.max_slots,
        validatedData.exception_dates,
        validatedData.start_time,
        validatedData.end_time,
        validatedData.start_date,
        validatedData.end_date
      ];
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create lesson: ${error.message}`);
    }
  }

  /**
   * Find lesson by ID
   * @param {number} id
   * @returns {Promise<Lesson|null>}
   */
  static async findById(id) {
    try {
      const query = `
        SELECT id, meeting_days, max_slots, exception_dates, start_time, end_time, start_date, end_date
        FROM lessons
        WHERE id = $1
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find lesson by ID: ${error.message}`);
    }
  }

  /**
   * Find all lessons
   * @returns {Promise<Lesson[]>}
   */
  static async findAll() {
    try {
      const query = `
        SELECT id, meeting_days, max_slots, exception_dates, start_time, end_time, start_date, end_date
        FROM lessons
        ORDER BY id
      `;
      
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to find all lessons: ${error.message}`);
    }
  }

  /**
   * Update lesson
   * @param {number} id
   * @param {LessonUpdateDTO} updateData
   * @returns {Promise<Lesson|null>}
   */
  static async update(id, updateData) {
    try {
      // Validate input
      const validatedData = LessonUpdateSchema.parse(updateData);
      
      const setClause = [];
      const values = [];
      let paramCount = 1;

      if (validatedData.meeting_days !== undefined) {
        setClause.push(`meeting_days = $${paramCount++}`);
        values.push(validatedData.meeting_days);
      }
      if (validatedData.max_slots !== undefined) {
        setClause.push(`max_slots = $${paramCount++}`);
        values.push(validatedData.max_slots);
      }
      if (validatedData.exception_dates !== undefined) {
        setClause.push(`exception_dates = $${paramCount++}`);
        values.push(validatedData.exception_dates);
      }
      if (validatedData.start_time !== undefined) {
        setClause.push(`start_time = $${paramCount++}`);
        values.push(validatedData.start_time);
      }
      if (validatedData.end_time !== undefined) {
        setClause.push(`end_time = $${paramCount++}`);
        values.push(validatedData.end_time);
      }
      if (validatedData.start_date !== undefined) {
        setClause.push(`start_date = $${paramCount++}`);
        values.push(validatedData.start_date);
      }
      if (validatedData.end_date !== undefined) {
        setClause.push(`end_date = $${paramCount++}`);
        values.push(validatedData.end_date);
      }

      if (setClause.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);
      const query = `
        UPDATE lessons
        SET ${setClause.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, meeting_days, max_slots, exception_dates, start_time, end_time, start_date, end_date
      `;
      
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to update lesson: ${error.message}`);
    }
  }

  /**
   * Delete lesson
   * @param {number} id
   * @returns {Promise<{id: number}|null>}
   */
  static async delete(id) {
    try {
      const query = 'DELETE FROM lessons WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to delete lesson: ${error.message}`);
    }
  }

  /**
   * Find lessons assigned to a specific instructor
   * @param {number} instructorId
   * @returns {Promise<Lesson[]>}
   */
  static async findByInstructor(instructorId) {
    try {
      const query = `
        SELECT DISTINCT l.id, l.meeting_days, l.max_slots, l.exception_dates, 
               l.start_time, l.end_time, l.start_date, l.end_date
        FROM lessons l
        INNER JOIN swimmer_lessons sl ON l.id = sl.lesson_id
        WHERE sl.instructor_id = $1
        AND l.start_date IS NOT NULL 
        AND l.end_date IS NOT NULL
        ORDER BY l.start_date
      `;
      
      const result = await pool.query(query, [instructorId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to find lessons for instructor: ${error.message}`);
    }
  }

  /**
   * Find lessons with participants
   * @returns {Promise<LessonWithParticipants[]>}
   */
  static async findWithParticipants() {
    try {
      const query = `
        SELECT l.id, l.meeting_days, l.max_slots, l.exception_dates, l.start_time, l.end_time, l.start_date, l.end_date,
               sl.swimmer_id, sl.registration_date, sl.payment_status, sl.instructor_id, sl.instructor_notes, sl.preferred_instructor_id, sl.missing_dates,
               s.name as swimmer_name, s.proficiency, s.gender, s.birthdate,
               u.fullname as parent_name, u.email as parent_email, u.phone_number as parent_phone_number,
               i1.name as instructor_name, i1.email as instructor_email,
               i2.name as preferred_instructor_name, i2.email as preferred_instructor_email
        FROM lessons l
        LEFT JOIN swimmer_lessons sl ON l.id = sl.lesson_id
        LEFT JOIN swimmers s ON sl.swimmer_id = s.id
        LEFT JOIN users u ON s.user_id = u.id
        LEFT JOIN instructors i1 ON sl.instructor_id = i1.id
        LEFT JOIN instructors i2 ON sl.preferred_instructor_id = i2.id
        ORDER BY l.id, sl.registration_date
      `;
      
      const result = await pool.query(query);
      
      // Group by lesson
      const lessonsMap = new Map();
      
      result.rows.forEach(row => {
        if (!lessonsMap.has(row.id)) {
          lessonsMap.set(row.id, {
            id: row.id,
            meeting_days: row.meeting_days,
            max_slots: row.max_slots,
            exception_dates: row.exception_dates,
            start_time: row.start_time,
            end_time: row.end_time,
            start_date: row.start_date,
            end_date: row.end_date,
            participants: []
          });
        }
        
        if (row.swimmer_id) {
          const lesson = lessonsMap.get(row.id);
          lesson.participants.push({
            swimmer_id: row.swimmer_id,
            registration_date: row.registration_date,
            payment_status: row.payment_status,
            instructor_id: row.instructor_id,
            instructor_notes: row.instructor_notes,
            preferred_instructor_id: row.preferred_instructor_id,
            missing_dates: row.missing_dates,
            name: row.swimmer_name,
            proficiency: row.proficiency,
            gender: row.gender,
            birthdate: row.birthdate,
            parent_name: row.parent_name,
            parent_email: row.parent_email,
            parent_phone_number: row.parent_phone_number,
            instructor: row.instructor_name ? {
              id: row.instructor_id,
              name: row.instructor_name,
              email: row.instructor_email
            } : null,
            preferred_instructor: row.preferred_instructor_name ? {
              id: row.preferred_instructor_id,
              name: row.preferred_instructor_name,
              email: row.preferred_instructor_email
            } : null
          });
        }
      });
      
      return Array.from(lessonsMap.values());
    } catch (error) {
      throw new Error(`Failed to find lessons with participants: ${error.message}`);
    }
  }
}

module.exports = LessonStore; 