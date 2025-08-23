const pool = require('../database.js');
const { z } = require('zod');

/**
 * @typedef {Object} CoverageRequestCreateDTO
 * @property {number} requesting_instructor_id - ID of instructor requesting coverage
 * @property {number} lesson_id - ID of lesson needing coverage
 * @property {number} swimmer_id - ID of specific swimmer needing coverage
 * @property {string} request_date - Date when coverage is needed
 * @property {string} [reason] - Reason for coverage request
 * @property {string} [notes] - Additional notes
 */

/**
 * @typedef {Object} CoverageRequestUpdateDTO
 * @property {string} [reason] - Reason for coverage request
 * @property {string} [notes] - Additional notes
 * @property {string} [status] - Status of coverage request
 * @property {number} [swimmer_id] - ID of specific swimmer needing coverage
 */

/**
 * @typedef {Object} CoverageRequest
 * @property {number} id - Coverage request ID
 * @property {number} requesting_instructor_id - ID of instructor requesting coverage
 * @property {number} lesson_id - ID of lesson needing coverage
 * @property {number} swimmer_id - ID of specific swimmer needing coverage
 * @property {string} request_date - Date when coverage is needed
 * @property {string} reason - Reason for coverage request
 * @property {string} notes - Additional notes
 * @property {string} status - Status (pending, accepted, declined, cancelled)
 * @property {number} [covering_instructor_id] - ID of instructor providing coverage
 * @property {string} created_at - When request was created
 * @property {string} [updated_at] - When request was last updated
 */

// Zod schemas for validation
const CoverageRequestCreateSchema = z.object({
  requesting_instructor_id: z.number().positive('Instructor ID must be positive'),
  lesson_id: z.number().positive('Lesson ID must be positive'),
  swimmer_id: z.number().positive('Swimmer ID must be positive'),
  request_date: z.string().min(1, 'Request date is required'),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

const CoverageRequestUpdateSchema = z.object({
  reason: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: z.enum(['pending', 'accepted', 'declined', 'cancelled']).optional(),
  covering_instructor_id: z.number().positive('Instructor ID must be positive').nullable().optional(),
  swimmer_id: z.number().positive('Swimmer ID must be positive').nullable().optional(),
  requesting_instructor_id: z.number().positive('Instructor ID must be positive').optional(),
});

class CoverageStore {
  /**
   * Create a new coverage request
   * @param {CoverageRequestCreateDTO} coverageData
   * @returns {Promise<CoverageRequest>}
   */
  static async create(coverageData) {
    try {
      // Validate input
      const validatedData = CoverageRequestCreateSchema.parse(coverageData);
      
      const query = `
        INSERT INTO coverage_requests (requesting_instructor_id, lesson_id, swimmer_id, request_date, reason, notes, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'pending')
        RETURNING id, requesting_instructor_id, lesson_id, swimmer_id, request_date, reason, notes, status, created_at
      `;
      
      const values = [
        validatedData.requesting_instructor_id,
        validatedData.lesson_id,
        validatedData.swimmer_id,
        validatedData.request_date,
        validatedData.reason || null,
        validatedData.notes || null,
      ];
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23503') { // Foreign key constraint violation
        throw new Error('Referenced instructor or lesson does not exist');
      }
      throw new Error(`Failed to create coverage request: ${error.message}`);
    }
  }

  /**
   * Find a coverage request by ID
   * @param {number} id
   * @returns {Promise<CoverageRequest|null>}
   */
  static async findById(id) {
    try {
      const query = `
        SELECT cr.*, 
               i1.name as requesting_instructor_name,
               i1.email as requesting_instructor_email,
               i2.name as covering_instructor_name,
               i2.email as covering_instructor_email,
               l.start_date, l.end_date, l.meeting_days, l.start_time, l.end_time
        FROM coverage_requests cr
        LEFT JOIN instructors i1 ON cr.requesting_instructor_id = i1.id
        LEFT JOIN instructors i2 ON cr.covering_instructor_id = i2.id
        LEFT JOIN lessons l ON cr.lesson_id = l.id
        WHERE cr.id = $1
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find coverage request: ${error.message}`);
    }
  }

  /**
   * Find all pending coverage requests
   * @returns {Promise<CoverageRequest[]>}
   */
  static async findPending() {
    try {
      // First get the basic coverage requests
      const query = `
        SELECT cr.*, 
               i1.name as requesting_instructor_name,
               i1.email as requesting_instructor_email
        FROM coverage_requests cr
        LEFT JOIN instructors i1 ON cr.requesting_instructor_id = i1.id
        WHERE cr.status = 'pending'
        ORDER BY cr.request_date ASC, cr.created_at ASC
      `;
      
      const result = await pool.query(query);
      const coverageRequests = result.rows;
      
      // Now fetch lesson and swimmer details for each request
      const enrichedRequests = await Promise.all(
        coverageRequests.map(async (request) => {
          // Get lesson details
          const lessonQuery = 'SELECT start_time, end_time, start_date, end_date, meeting_days FROM lessons WHERE id = $1';
          const lessonResult = await pool.query(lessonQuery, [request.lesson_id]);
          const lesson = lessonResult.rows[0] || {};
          
          // Get swimmer details
          const swimmerQuery = 'SELECT name, proficiency FROM swimmers WHERE id = $1';
          const swimmerResult = await pool.query(swimmerQuery, [request.swimmer_id]);
          const swimmer = swimmerResult.rows[0] || {};
          
          return {
            ...request,
            start_time: lesson.start_time,
            end_time: lesson.end_time,
            start_date: lesson.start_date,
            end_date: lesson.end_date,
            meeting_days: lesson.meeting_days,
            swimmer_name: swimmer.name,
            proficiency: swimmer.proficiency
          };
        })
      );
      
      return enrichedRequests;
    } catch (error) {
      throw new Error(`Failed to find pending coverage requests: ${error.message}`);
    }
  }

  /**
   * Find coverage requests by lesson
   * @param {number} lessonId
   * @returns {Promise<CoverageRequest[]>}
   */
  static async findByLesson(lessonId) {
    try {
      const query = `
        SELECT cr.*, 
               i1.name as requesting_instructor_name,
               i1.email as requesting_instructor_email,
               i2.name as covering_instructor_name,
               i2.email as covering_instructor_email
        FROM coverage_requests cr
        LEFT JOIN instructors i1 ON cr.requesting_instructor_id = i1.id
        LEFT JOIN instructors i2 ON cr.covering_instructor_id = i2.id
        WHERE cr.lesson_id = $1
        ORDER BY cr.created_at DESC
      `;
      
      const result = await pool.query(query, [lessonId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to find coverage requests for lesson: ${error.message}`);
    }
  }

  /**
   * Find coverage requests by swimmer
   * @param {number} swimmerId
   * @returns {Promise<CoverageRequest[]>}
   */
  static async findBySwimmer(swimmerId) {
    try {
      const query = `
        SELECT cr.*, 
               i1.name as requesting_instructor_name,
               i1.email as requesting_instructor_email,
               i2.name as covering_instructor_name,
               i2.email as covering_instructor_email,
               l.start_date, l.end_date, l.meeting_days, l.start_time, l.end_time
        FROM coverage_requests cr
        LEFT JOIN instructors i1 ON cr.requesting_instructor_id = i1.id
        LEFT JOIN instructors i2 ON cr.covering_instructor_id = i2.id
        LEFT JOIN lessons l ON cr.lesson_id = l.id
        WHERE cr.swimmer_id = $1
        ORDER BY cr.created_at DESC
      `;
      
      const result = await pool.query(query, [swimmerId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to find coverage requests for swimmer: ${error.message}`);
    }
  }

  /**
   * Find coverage requests by requesting instructor
   * @param {number} instructorId
   * @returns {Promise<CoverageRequest[]>}
   */
  static async findByRequestingInstructor(instructorId) {
    try {
      // First get the basic coverage requests
      const query = `
        SELECT cr.*, 
               i1.name as requesting_instructor_name,
               i1.email as requesting_instructor_email,
               i2.name as covering_instructor_name,
               i2.email as covering_instructor_email
        FROM coverage_requests cr
        LEFT JOIN instructors i1 ON cr.requesting_instructor_id = i1.id
        LEFT JOIN instructors i2 ON cr.covering_instructor_id = i2.id
        WHERE cr.requesting_instructor_id = $1
        ORDER BY cr.created_at DESC
      `;
      
      const result = await pool.query(query, [instructorId]);
      const coverageRequests = result.rows;
      
      // Now fetch lesson and swimmer details for each request
      const enrichedRequests = await Promise.all(
        coverageRequests.map(async (request) => {
          // Get lesson details
          const lessonQuery = 'SELECT start_time, end_time, start_date, end_date, meeting_days FROM lessons WHERE id = $1';
          const lessonResult = await pool.query(lessonQuery, [request.lesson_id]);
          const lesson = lessonResult.rows[0] || {};
          
          // Get swimmer details
          const swimmerQuery = 'SELECT name, proficiency FROM swimmers WHERE id = $1';
          const swimmerResult = await pool.query(swimmerQuery, [request.swimmer_id]);
          const swimmer = swimmerResult.rows[0] || {};
          
          return {
            ...request,
            start_time: lesson.start_time,
            end_time: lesson.end_time,
            start_date: lesson.start_date,
            end_date: lesson.end_date,
            meeting_days: lesson.meeting_days,
            swimmer_name: swimmer.name,
            proficiency: swimmer.proficiency
          };
        })
      );
      
      return enrichedRequests;
    } catch (error) {
      throw new Error(`Failed to find coverage requests by requesting instructor: ${error.message}`);
    }
  }

  /**
   * Find coverage requests by covering instructor
   * @param {number} instructorId
   * @returns {Promise<CoverageRequest[]>}
   */
  static async findByCoveringInstructor(instructorId) {
    try {
      // First get the basic coverage requests
      const query = `
        SELECT cr.*, 
               i1.name as requesting_instructor_name,
               i1.email as requesting_instructor_email,
               i2.name as covering_instructor_name,
               i2.email as covering_instructor_email
        FROM coverage_requests cr
        LEFT JOIN instructors i1 ON cr.requesting_instructor_id = i1.id
        LEFT JOIN instructors i2 ON cr.covering_instructor_id = i2.id
        WHERE cr.covering_instructor_id = $1
        ORDER BY cr.created_at DESC
      `;
      
      const result = await pool.query(query, [instructorId]);
      const coverageRequests = result.rows;
      
      // Now fetch lesson and swimmer details for each request
      const enrichedRequests = await Promise.all(
        coverageRequests.map(async (request) => {
          // Get lesson details
          const lessonQuery = 'SELECT start_time, end_time, start_date, end_date, meeting_days FROM lessons WHERE id = $1';
          const lessonResult = await pool.query(lessonQuery, [request.lesson_id]);
          const lesson = lessonResult.rows[0] || {};
          
          // Get swimmer details
          const swimmerQuery = 'SELECT name, proficiency FROM swimmers WHERE id = $1';
          const swimmerResult = await pool.query(swimmerQuery, [request.swimmer_id]);
          const swimmer = swimmerResult.rows[0] || {};
          
          return {
            ...request,
            start_time: lesson.start_time,
            end_time: lesson.end_time,
            start_date: lesson.start_date,
            end_date: lesson.end_date,
            meeting_days: lesson.meeting_days,
            swimmer_name: swimmer.name,
            proficiency: swimmer.proficiency
          };
        })
      );
      
      return enrichedRequests;
    } catch (error) {
      throw new Error(`Failed to find coverage requests by covering instructor: ${error.message}`);
    }
  }

  /**
   * Update a coverage request
   * @param {number} id
   * @param {CoverageRequestUpdateDTO} updateData
   * @returns {Promise<CoverageRequest>}
   */
  static async update(id, updateData) {
    try {
      // Validate input
      const validatedData = CoverageRequestUpdateSchema.parse(updateData);
      
      const setClause = [];
      const values = [];
      let paramCount = 1;

      if (validatedData.reason !== undefined) {
        setClause.push(`reason = $${paramCount++}`);
        values.push(validatedData.reason);
      }

      if (validatedData.notes !== undefined) {
        setClause.push(`notes = $${paramCount++}`);
        values.push(validatedData.notes);
      }

      if (validatedData.status !== undefined) {
        setClause.push(`status = $${paramCount++}`);
        values.push(validatedData.status);
      }

      if (validatedData.covering_instructor_id !== undefined) {
        setClause.push(`covering_instructor_id = $${paramCount++}`);
        values.push(validatedData.covering_instructor_id);
      }

      if (validatedData.swimmer_id !== undefined) {
        setClause.push(`swimmer_id = $${paramCount++}`);
        values.push(validatedData.swimmer_id);
      }

      if (validatedData.requesting_instructor_id !== undefined) {
        setClause.push(`requesting_instructor_id = $${paramCount++}`);
        values.push(validatedData.requesting_instructor_id);
      }

      if (setClause.length === 0) {
        throw new Error('No fields to update');
      }

      setClause.push(`updated_at = NOW()`);
      values.push(id);

      const query = `
        UPDATE coverage_requests 
        SET ${setClause.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update coverage request: ${error.message}`);
    }
  }

  /**
   * Decline a coverage request
   * @param {number} id
   * @returns {Promise<CoverageRequest>}
   */
  static async decline(id) {
    try {
      const query = `
        UPDATE coverage_requests 
        SET status = 'declined', updated_at = NOW()
        WHERE id = $1 AND status = 'pending'
        RETURNING *
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to decline coverage request: ${error.message}`);
    }
  }

  /**
   * Delete a coverage request
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  static async delete(id) {
    try {
      const query = `
        DELETE FROM coverage_requests 
        WHERE id = $1
      `;
      
      const result = await pool.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete coverage request: ${error.message}`);
    }
  }

  /**
   * Get coverage statistics for an instructor
   * @param {number} instructorId
   * @returns {Promise<Object>}
   */
  static async getStats(instructorId) {
    try {
      // Get pending requests created by this instructor
      const pendingRequests = await pool.query(`
        SELECT COUNT(*) as count
        FROM coverage_requests 
        WHERE requesting_instructor_id = $1 AND status = 'pending'
      `, [instructorId]);

      // Get accepted coverage requests where this instructor is covering
      const acceptedCoverage = await pool.query(`
        SELECT COUNT(*) as count
        FROM coverage_requests 
        WHERE covering_instructor_id = $1 AND status = 'accepted'
      `, [instructorId]);

      // Get all pending requests from other instructors (for volunteering)
      const availableRequests = await pool.query(`
        SELECT COUNT(*) as count
        FROM coverage_requests 
        WHERE requesting_instructor_id != $1 AND status = 'pending'
      `, [instructorId]);

      return {
        pendingRequests: parseInt(pendingRequests.rows[0].count),
        acceptedCoverage: parseInt(acceptedCoverage.rows[0].count),
        availableRequests: parseInt(availableRequests.rows[0].count)
      };
    } catch (error) {
      throw new Error(`Failed to get coverage stats: ${error.message}`);
    }
  }
}

module.exports = CoverageStore; 