const pool = require('../database.js');
const { z } = require('zod');

/**
 * @typedef {Object} InstructorCreateDTO
 * @property {string} name - Instructor's name
 * @property {string} email - Instructor's email address
 */

/**
 * @typedef {Object} InstructorUpdateDTO
 * @property {string} [name] - Instructor's name
 * @property {string} [email] - Instructor's email address
 */

/**
 * @typedef {Object} Instructor
 * @property {number} id - Instructor ID
 * @property {string} name - Instructor's name
 * @property {string} email - Instructor's email address
 */

// Zod schemas for validation
const InstructorCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
});

const InstructorUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
});

class InstructorStore {
  /**
   * Create a new instructor
   * @param {InstructorCreateDTO} instructorData
   * @returns {Promise<Instructor>}
   */
  static async create(instructorData) {
    try {
      // Validate input
      const validatedData = InstructorCreateSchema.parse(instructorData);
      
      const query = `
        INSERT INTO instructors (name, email)
        VALUES ($1, $2)
        RETURNING id, name, email
      `;
      
      const values = [validatedData.name, validatedData.email];
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('Instructor with this email already exists');
      }
      throw new Error(`Failed to create instructor: ${error.message}`);
    }
  }

  /**
   * Find instructor by ID
   * @param {number} id
   * @returns {Promise<Instructor|null>}
   */
  static async findById(id) {
    try {
      const query = `
        SELECT id, name, email
        FROM instructors
        WHERE id = $1
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find instructor by ID: ${error.message}`);
    }
  }

  /**
   * Find instructor by email
   * @param {string} email
   * @returns {Promise<Instructor|null>}
   */
  static async findByEmail(email) {
    try {
      const query = `
        SELECT id, name, email
        FROM instructors
        WHERE email = $1
      `;
      
      const result = await pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find instructor by email: ${error.message}`);
    }
  }

  /**
   * Find all instructors
   * @returns {Promise<Instructor[]>}
   */
  static async findAll() {
    try {
      const query = `
        SELECT id, name, email
        FROM instructors
        ORDER BY name
      `;
      
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to find all instructors: ${error.message}`);
    }
  }

  /**
   * Update instructor
   * @param {number} id
   * @param {InstructorUpdateDTO} updateData
   * @returns {Promise<Instructor|null>}
   */
  static async update(id, updateData) {
    try {
      // Validate input
      const validatedData = InstructorUpdateSchema.parse(updateData);
      
      const setClause = [];
      const values = [];
      let paramCount = 1;

      if (validatedData.name !== undefined) {
        setClause.push(`name = $${paramCount++}`);
        values.push(validatedData.name);
      }
      if (validatedData.email !== undefined) {
        setClause.push(`email = $${paramCount++}`);
        values.push(validatedData.email);
      }

      if (setClause.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);
      const query = `
        UPDATE instructors
        SET ${setClause.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, name, email
      `;
      
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('Instructor with this email already exists');
      }
      throw new Error(`Failed to update instructor: ${error.message}`);
    }
  }

  /**
   * Delete instructor
   * @param {number} id
   * @returns {Promise<{id: number}|null>}
   */
  static async delete(id) {
    try {
      const query = 'DELETE FROM instructors WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to delete instructor: ${error.message}`);
    }
  }

  /**
   * Find instructor with assignments
   * @param {number} instructorId
   * @returns {Promise<Object|null>}
   */
  static async findWithAssignments(instructorId) {
    try {
      const query = `
        SELECT i.id, i.name, i.email,
               sl.swimmer_id, sl.lesson_id, sl.registration_date, sl.payment_status, sl.instructor_notes,
               s.name as swimmer_name, s.proficiency, s.gender, s.birthdate,
               l.meeting_days, l.max_slots, l.start_time, l.end_time, l.start_date, l.end_date
        FROM instructors i
        LEFT JOIN swimmer_lessons sl ON i.id = sl.instructor_id
        LEFT JOIN swimmers s ON sl.swimmer_id = s.id
        LEFT JOIN lessons l ON sl.lesson_id = l.id
        WHERE i.id = $1
        ORDER BY sl.registration_date DESC
      `;
      
      const result = await pool.query(query, [instructorId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const instructor = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        assignments: []
      };
      
      result.rows.forEach(row => {
        if (row.swimmer_id) {
          instructor.assignments.push({
            swimmer_id: row.swimmer_id,
            lesson_id: row.lesson_id,
            registration_date: row.registration_date,
            payment_status: row.payment_status,
            instructor_notes: row.instructor_notes,
            swimmer: {
              name: row.swimmer_name,
              proficiency: row.proficiency,
              gender: row.gender,
              birthdate: row.birthdate
            },
            lesson: {
              meeting_days: row.meeting_days,
              max_slots: row.max_slots,
              start_time: row.start_time,
              end_time: row.end_time,
              start_date: row.start_date,
              end_date: row.end_date
            }
          });
        }
      });
      
      return instructor;
    } catch (error) {
      throw new Error(`Failed to find instructor with assignments: ${error.message}`);
    }
  }
}

module.exports = InstructorStore; 