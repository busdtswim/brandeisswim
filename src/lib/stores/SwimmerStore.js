const pool = require('../database.js');
const { z } = require('zod');

/**
 * @typedef {Object} SwimmerCreateDTO
 * @property {number} [user_id] - Associated user ID
 * @property {string} name - Swimmer's name
 * @property {string} [proficiency] - Swimming proficiency level
 * @property {string} [gender] - Swimmer's gender
 * @property {string} [birthdate] - Swimmer's birthdate (MM/DD/YYYY format)
 */

/**
 * @typedef {Object} SwimmerUpdateDTO
 * @property {number} [user_id] - Associated user ID
 * @property {string} [name] - Swimmer's name
 * @property {string} [proficiency] - Swimming proficiency level
 * @property {string} [gender] - Swimmer's gender
 * @property {string} [birthdate] - Swimmer's birthdate (MM/DD/YYYY format)
 */

/**
 * @typedef {Object} Swimmer
 * @property {number} id - Swimmer ID
 * @property {number} [user_id] - Associated user ID
 * @property {string} name - Swimmer's name
 * @property {string} [proficiency] - Swimming proficiency level
 * @property {string} [gender] - Swimmer's gender
 * @property {string} [birthdate] - Swimmer's birthdate
 */

/**
 * @typedef {Object} SwimmerWithUser
 * @property {number} id - Swimmer ID
 * @property {number} [user_id] - Associated user ID
 * @property {string} name - Swimmer's name
 * @property {string} [proficiency] - Swimming proficiency level
 * @property {string} [gender] - Swimmer's gender
 * @property {string} [birthdate] - Swimmer's birthdate
 * @property {string} [email] - User's email
 * @property {string} [fullname] - User's full name
 * @property {string} [phone_number] - User's phone number
 */

// Zod schemas for validation
const SwimmerCreateSchema = z.object({
  user_id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  proficiency: z.string().optional(),
  gender: z.string().optional(),
  birthdate: z.string().optional(),
});

const SwimmerUpdateSchema = z.object({
  user_id: z.number().optional(),
  name: z.string().min(1, 'Name is required').optional(),
  proficiency: z.string().optional(),
  gender: z.string().optional(),
  birthdate: z.string().optional(),
});

class SwimmerStore {
  /**
   * Create a new swimmer
   * @param {SwimmerCreateDTO} swimmerData
   * @returns {Promise<Swimmer>}
   */
  static async create(swimmerData) {
    try {
      // Validate input
      const validatedData = SwimmerCreateSchema.parse(swimmerData);
      
      const query = `
        INSERT INTO swimmers (user_id, name, proficiency, gender, birthdate)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, user_id, name, proficiency, gender, birthdate
      `;
      
      const values = [
        validatedData.user_id,
        validatedData.name,
        validatedData.proficiency,
        validatedData.gender,
        validatedData.birthdate
      ];
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23503') { // Foreign key constraint violation
        throw new Error('Referenced user does not exist');
      }
      throw new Error(`Failed to create swimmer: ${error.message}`);
    }
  }

  /**
   * Find swimmer by ID
   * @param {number} id
   * @returns {Promise<Swimmer|null>}
   */
  static async findById(id) {
    try {
      const query = `
        SELECT id, user_id, name, proficiency, gender, birthdate
        FROM swimmers
        WHERE id = $1
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find swimmer by ID: ${error.message}`);
    }
  }

  /**
   * Find swimmer by ID with user information
   * @param {number} id
   * @returns {Promise<SwimmerWithUser|null>}
   */
  static async findByIdWithUser(id) {
    try {
      const query = `
        SELECT s.id, s.user_id, s.name, s.proficiency, s.gender, s.birthdate,
               u.email, u.fullname, u.phone_number
        FROM swimmers s
        LEFT JOIN users u ON s.user_id = u.id
        WHERE s.id = $1
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find swimmer by ID: ${error.message}`);
    }
  }

  /**
   * Find swimmers by user ID
   * @param {number} userId
   * @returns {Promise<SwimmerWithUser[]>}
   */
  static async findByUserId(userId) {
    try {
      const query = `
        SELECT s.id, s.user_id, s.name, s.proficiency, s.gender, s.birthdate,
               u.email, u.fullname, u.phone_number
        FROM swimmers s
        LEFT JOIN users u ON s.user_id = u.id
        WHERE s.user_id = $1
        ORDER BY s.id
      `;
      
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to find swimmers by user ID: ${error.message}`);
    }
  }

  /**
   * Update swimmer
   * @param {number} id
   * @param {SwimmerUpdateDTO} updateData
   * @returns {Promise<Swimmer|null>}
   */
  static async update(id, updateData) {
    try {
      // Validate input
      const validatedData = SwimmerUpdateSchema.parse(updateData);
      
      const setClause = [];
      const values = [];
      let paramCount = 1;

      if (validatedData.user_id !== undefined) {
        setClause.push(`user_id = $${paramCount++}`);
        values.push(validatedData.user_id);
      }
      if (validatedData.name !== undefined) {
        setClause.push(`name = $${paramCount++}`);
        values.push(validatedData.name);
      }
      if (validatedData.proficiency !== undefined) {
        setClause.push(`proficiency = $${paramCount++}`);
        values.push(validatedData.proficiency);
      }
      if (validatedData.gender !== undefined) {
        setClause.push(`gender = $${paramCount++}`);
        values.push(validatedData.gender);
      }
      if (validatedData.birthdate !== undefined) {
        setClause.push(`birthdate = $${paramCount++}`);
        values.push(validatedData.birthdate);
      }

      if (setClause.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);
      const query = `
        UPDATE swimmers
        SET ${setClause.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, user_id, name, proficiency, gender, birthdate
      `;
      
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      if (error.code === '23503') { // Foreign key constraint violation
        throw new Error('Referenced user does not exist');
      }
      throw new Error(`Failed to update swimmer: ${error.message}`);
    }
  }

  /**
   * Delete swimmer
   * @param {number} id
   * @returns {Promise<{id: number}|null>}
   */
  static async delete(id) {
    try {
      const query = 'DELETE FROM swimmers WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to delete swimmer: ${error.message}`);
    }
  }

  /**
   * Find all swimmers
   * @returns {Promise<SwimmerWithUser[]>}
   */
  static async findAll() {
    try {
      const query = `
        SELECT s.id, s.user_id, s.name, s.proficiency, s.gender, s.birthdate,
               u.email, u.fullname, u.phone_number
        FROM swimmers s
        LEFT JOIN users u ON s.user_id = u.id
        ORDER BY s.id
      `;
      
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to find all swimmers: ${error.message}`);
    }
  }

  /**
   * Find swimmer with lessons
   * @param {number} swimmerId
   * @returns {Promise<Array>}
   */
  static async findWithLessons(swimmerId) {
    try {
      const query = `
        SELECT s.id, s.user_id, s.name, s.proficiency, s.gender, s.birthdate,
               sl.lesson_id, sl.registration_date, sl.payment_status, sl.instructor_id,
               sl.instructor_notes, sl.preferred_instructor_id,
               l.meeting_days, l.max_slots, l.start_time, l.end_time, l.start_date, l.end_date,
               i1.name as instructor_name, i1.email as instructor_email,
               i2.name as preferred_instructor_name, i2.email as preferred_instructor_email
        FROM swimmers s
        LEFT JOIN swimmer_lessons sl ON s.id = sl.swimmer_id
        LEFT JOIN lessons l ON sl.lesson_id = l.id
        LEFT JOIN instructors i1 ON sl.instructor_id = i1.id
        LEFT JOIN instructors i2 ON sl.preferred_instructor_id = i2.id
        WHERE s.id = $1
        ORDER BY sl.registration_date DESC
      `;
      
      const result = await pool.query(query, [swimmerId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to find swimmer with lessons: ${error.message}`);
    }
  }
}

module.exports = SwimmerStore; 