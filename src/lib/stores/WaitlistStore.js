const pool = require('../database.js');
const { z } = require('zod');

/**
 * @typedef {Object} WaitlistCreateDTO
 * @property {number} swimmer_id - Swimmer ID
 * @property {string} [registration_date] - Registration date
 * @property {string} [status] - Status (default: 'active')
 * @property {number} [position] - Position in waitlist
 * @property {string} [notes] - Notes
 */

/**
 * @typedef {Object} WaitlistUpdateDTO
 * @property {string} [registration_date] - Registration date
 * @property {string} [status] - Status
 * @property {number} [position] - Position in waitlist
 * @property {string} [notes] - Notes
 */

/**
 * @typedef {Object} Waitlist
 * @property {number} id - Waitlist entry ID
 * @property {number} swimmer_id - Swimmer ID
 * @property {string} [registration_date] - Registration date
 * @property {string} [status] - Status
 * @property {number} [position] - Position in waitlist
 * @property {string} [notes] - Notes
 */

/**
 * @typedef {Object} WaitlistWithSwimmer
 * @property {number} id - Waitlist entry ID
 * @property {number} swimmer_id - Swimmer ID
 * @property {string} [registration_date] - Registration date
 * @property {string} [status] - Status
 * @property {number} [position] - Position in waitlist
 * @property {string} [notes] - Notes
 * @property {string} [swimmer_name] - Swimmer's name
 * @property {string} [proficiency] - Swimming proficiency
 * @property {string} [gender] - Swimmer's gender
 * @property {string} [birthdate] - Swimmer's birthdate
 * @property {string} [user_email] - User's email
 * @property {string} [user_fullname] - User's full name
 */

// Zod schemas for validation
const WaitlistCreateSchema = z.object({
  swimmer_id: z.number().positive('Swimmer ID must be positive'),
  registration_date: z.string().optional(),
  status: z.string().optional().default('active'),
  position: z.number().optional(),
  notes: z.string().optional(),
});

const WaitlistUpdateSchema = z.object({
  registration_date: z.string().optional(),
  status: z.string().optional(),
  position: z.number().optional(),
  notes: z.string().optional(),
});

class WaitlistStore {
  /**
   * Create a new waitlist entry
   * @param {WaitlistCreateDTO} waitlistData
   * @returns {Promise<Waitlist>}
   */
  static async create(waitlistData) {
    try {
      // Validate input
      const validatedData = WaitlistCreateSchema.parse(waitlistData);
      
      // If position is not provided, get the next position
      if (!validatedData.position) {
        validatedData.position = await this.getNextPosition();
      }
      
      // If registration_date is not provided, set to now
      if (!validatedData.registration_date) {
        validatedData.registration_date = new Date().toISOString();
      }
      
      const query = `
        INSERT INTO waitlist (swimmer_id, registration_date, status, position, notes)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, swimmer_id, registration_date, status, position, notes
      `;
      
      const values = [
        validatedData.swimmer_id,
        validatedData.registration_date,
        validatedData.status,
        validatedData.position,
        validatedData.notes
      ];
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23503') { // Foreign key constraint violation
        throw new Error('Referenced swimmer does not exist');
      }
      throw new Error(`Failed to create waitlist entry: ${error.message}`);
    }
  }

  /**
   * Find waitlist entry by ID
   * @param {number} id
   * @returns {Promise<WaitlistWithSwimmer|null>}
   */
  static async findById(id) {
    try {
      const query = `
        SELECT w.id, w.swimmer_id, w.registration_date, w.status, w.position, w.notes,
               s.name as swimmer_name, s.proficiency, s.gender, s.birthdate,
               u.email as user_email, u.fullname as user_fullname, u.phone_number as user_phone_number
        FROM waitlist w
        JOIN swimmers s ON w.swimmer_id = s.id
        LEFT JOIN users u ON s.user_id = u.id
        WHERE w.id = $1
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find waitlist entry by ID: ${error.message}`);
    }
  }

  /**
   * Find waitlist entries by swimmer ID
   * @param {number} swimmerId
   * @returns {Promise<WaitlistWithSwimmer[]>}
   */
  static async findBySwimmerId(swimmerId) {
    try {
      const query = `
        SELECT w.id, w.swimmer_id, w.registration_date, w.status, w.position, w.notes,
               s.name as swimmer_name, s.proficiency, s.gender, s.birthdate,
               u.email as user_email, u.fullname as user_fullname, u.phone_number as user_phone_number
        FROM waitlist w
        JOIN swimmers s ON w.swimmer_id = s.id
        LEFT JOIN users u ON s.user_id = u.id
        WHERE w.swimmer_id = $1
        ORDER BY w.position
      `;
      
      const result = await pool.query(query, [swimmerId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to find waitlist entries by swimmer ID: ${error.message}`);
    }
  }

  /**
   * Find all waitlist entries
   * @returns {Promise<WaitlistWithSwimmer[]>}
   */
  static async findAll() {
    try {
      const query = `
        SELECT w.id, w.swimmer_id, w.registration_date, w.status, w.position, w.notes,
               s.name as swimmer_name, s.proficiency, s.gender, s.birthdate,
               u.email as user_email, u.fullname as user_fullname, u.phone_number as user_phone_number
        FROM waitlist w
        JOIN swimmers s ON w.swimmer_id = s.id
        LEFT JOIN users u ON s.user_id = u.id
        ORDER BY w.position
      `;
      
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to find all waitlist entries: ${error.message}`);
    }
  }

  /**
   * Find waitlist entries by status
   * @param {string} status
   * @returns {Promise<WaitlistWithSwimmer[]>}
   */
  static async findByStatus(status) {
    try {
      const query = `
        SELECT w.id, w.swimmer_id, w.registration_date, w.status, w.position, w.notes,
               s.name as swimmer_name, s.proficiency, s.gender, s.birthdate,
               u.email as user_email, u.fullname as user_fullname, u.phone_number as user_phone_number
        FROM waitlist w
        JOIN swimmers s ON w.swimmer_id = s.id
        LEFT JOIN users u ON s.user_id = u.id
        WHERE w.status = $1
        ORDER BY w.position
      `;
      
      const result = await pool.query(query, [status]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to find waitlist entries by status: ${error.message}`);
    }
  }

  /**
   * Update waitlist entry
   * @param {number} id
   * @param {WaitlistUpdateDTO} updateData
   * @returns {Promise<Waitlist|null>}
   */
  static async update(id, updateData) {
    try {
      // Validate input
      const validatedData = WaitlistUpdateSchema.parse(updateData);
      
      const setClause = [];
      const values = [];
      let paramCount = 1;

      if (validatedData.registration_date !== undefined) {
        setClause.push(`registration_date = $${paramCount++}`);
        values.push(validatedData.registration_date);
      }
      if (validatedData.status !== undefined) {
        setClause.push(`status = $${paramCount++}`);
        values.push(validatedData.status);
      }
      if (validatedData.position !== undefined) {
        setClause.push(`position = $${paramCount++}`);
        values.push(validatedData.position);
      }
      if (validatedData.notes !== undefined) {
        setClause.push(`notes = $${paramCount++}`);
        values.push(validatedData.notes);
      }

      if (setClause.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);
      const query = `
        UPDATE waitlist
        SET ${setClause.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, swimmer_id, registration_date, status, position, notes
      `;
      
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to update waitlist entry: ${error.message}`);
    }
  }

  /**
   * Delete waitlist entry
   * @param {number} id
   * @returns {Promise<{id: number}|null>}
   */
  static async delete(id) {
    try {
      const query = 'DELETE FROM waitlist WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to delete waitlist entry: ${error.message}`);
    }
  }

  /**
   * Get next position for waitlist
   * @returns {Promise<number>}
   */
  static async getNextPosition() {
    try {
      const query = 'SELECT COALESCE(MAX(position), 0) + 1 as next_position FROM waitlist';
      const result = await pool.query(query);
      return parseInt(result.rows[0].next_position);
    } catch (error) {
      throw new Error(`Failed to get next position: ${error.message}`);
    }
  }

  /**
   * Reorder waitlist positions
   * @returns {Promise<void>}
   */
  static async reorderPositions() {
    try {
      const query = `
        WITH ranked AS (
          SELECT id, ROW_NUMBER() OVER (ORDER BY registration_date) as new_position
          FROM waitlist
          WHERE status = 'active'
        )
        UPDATE waitlist
        SET position = ranked.new_position
        FROM ranked
        WHERE waitlist.id = ranked.id
      `;
      
      await pool.query(query);
    } catch (error) {
      throw new Error(`Failed to reorder positions: ${error.message}`);
    }
  }

  /**
   * Count waitlist entries by status
   * @param {string} status
   * @returns {Promise<number>}
   */
  static async countByStatus(status) {
    try {
      const query = 'SELECT COUNT(*) as count FROM waitlist WHERE status = $1';
      const result = await pool.query(query, [status]);
      return parseInt(result.rows[0].count);
    } catch (error) {
      throw new Error(`Failed to count waitlist entries by status: ${error.message}`);
    }
  }
}

module.exports = WaitlistStore; 