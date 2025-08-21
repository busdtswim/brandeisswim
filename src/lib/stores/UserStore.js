const pool = require('../database.js');
const { z } = require('zod');

/**
 * @typedef {Object} UserCreateDTO
 * @property {string} email - User's email address
 * @property {string} password - Hashed password
 * @property {string} [role] - User role (default: 'customer')
 * @property {string} [phone_number] - User's phone number
 * @property {string} [fullname] - User's full name
 */

/**
 * @typedef {Object} UserUpdateDTO
 * @property {string} [email] - User's email address
 * @property {string} [password] - Hashed password
 * @property {string} [role] - User role
 * @property {string} [phone_number] - User's phone number
 * @property {string} [fullname] - User's full name
 * @property {string} [reset_token] - Password reset token
 * @property {string} [reset_token_expiry] - Password reset token expiry
 */

/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} email - User's email address
 * @property {string} password - Hashed password
 * @property {string} role - User role
 * @property {string} [phone_number] - User's phone number
 * @property {string} [fullname] - User's full name
 * @property {string} [reset_token] - Password reset token
 * @property {string} [reset_token_expiry] - Password reset token expiry
 */

// Zod schemas for validation
const UserCreateSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/^(?=.*\d)/, 'Password must contain at least one number')
    .regex(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, 'Password must contain at least one special character'),
  role: z.string().optional().default('customer'),
  phone_number: z.string().optional(),
  fullname: z.string().optional(),
});

const UserUpdateSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/^(?=.*\d)/, 'Password must contain at least one number')
    .regex(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, 'Password must contain at least one special character')
    .optional(),
  role: z.string().optional(),
  phone_number: z.string().optional(),
  fullname: z.string().optional(),
  reset_token: z.string().nullable().optional(),
  reset_token_expiry: z.string().nullable().optional(),
});

class UserStore {
  /**
   * Create a new user
   * @param {UserCreateDTO} userData
   * @returns {Promise<User>}
   */
  static async create(userData) {
    try {
      // Validate input
      const validatedData = UserCreateSchema.parse(userData);
      
      const query = `
        INSERT INTO users (email, password, role, phone_number, fullname)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, email, password, role, phone_number, fullname, reset_token, reset_token_expiry
      `;
      
      const values = [
        validatedData.email,
        validatedData.password,
        validatedData.role,
        validatedData.phone_number,
        validatedData.fullname
      ];
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('User with this email already exists');
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  /**
   * Find user by ID
   * @param {number} id
   * @returns {Promise<User|null>}
   */
  static async findById(id) {
    try {
      const query = `
        SELECT id, email, password, role, phone_number, fullname, reset_token, reset_token_expiry
        FROM users
        WHERE id = $1
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error.message}`);
    }
  }

  /**
   * Find user by email
   * @param {string} email
   * @returns {Promise<User|null>}
   */
  static async findByEmail(email) {
    try {
      const query = `
        SELECT id, email, password, role, phone_number, fullname, reset_token, reset_token_expiry
        FROM users
        WHERE email = $1
      `;
      
      const result = await pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  /**
   * Update user
   * @param {number} id
   * @param {UserUpdateDTO} updateData
   * @returns {Promise<User|null>}
   */
  static async update(id, updateData) {
    try {
      // Validate input
      const validatedData = UserUpdateSchema.parse(updateData);
      
      const setClause = [];
      const values = [];
      let paramCount = 1;

      if (validatedData.email !== undefined) {
        setClause.push(`email = $${paramCount++}`);
        values.push(validatedData.email);
      }
      if (validatedData.password !== undefined) {
        setClause.push(`password = $${paramCount++}`);
        values.push(validatedData.password);
      }
      if (validatedData.role !== undefined) {
        setClause.push(`role = $${paramCount++}`);
        values.push(validatedData.role);
      }
      if (validatedData.phone_number !== undefined) {
        setClause.push(`phone_number = $${paramCount++}`);
        values.push(validatedData.phone_number);
      }
      if (validatedData.fullname !== undefined) {
        setClause.push(`fullname = $${paramCount++}`);
        values.push(validatedData.fullname);
      }
      if (validatedData.reset_token !== undefined) {
        setClause.push(`reset_token = $${paramCount++}`);
        values.push(validatedData.reset_token);
      }
      if (validatedData.reset_token_expiry !== undefined) {
        setClause.push(`reset_token_expiry = $${paramCount++}`);
        values.push(validatedData.reset_token_expiry);
      }

      if (setClause.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);
      const query = `
        UPDATE users
        SET ${setClause.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, email, password, role, phone_number, fullname, reset_token, reset_token_expiry
      `;
      
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('User with this email already exists');
      }
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  /**
   * Delete user
   * @param {number} id
   * @returns {Promise<{id: number}|null>}
   */
  static async delete(id) {
    try {
      const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  /**
   * Find all users
   * @returns {Promise<User[]>}
   */
  static async findAll() {
    try {
      const query = `
        SELECT id, email, password, role, phone_number, fullname, reset_token, reset_token_expiry
        FROM users
        ORDER BY id
      `;
      
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to find all users: ${error.message}`);
    }
  }

  /**
   * Update reset token for password reset
   * @param {string} email
   * @param {string} resetToken
   * @param {string} expiry
   * @returns {Promise<User|null>}
   */
  static async updateResetToken(email, resetToken, expiry) {
    try {
      const query = `
        UPDATE users
        SET reset_token = $1, reset_token_expiry = $2
        WHERE email = $3
        RETURNING id, email, reset_token, reset_token_expiry
      `;
      
      const result = await pool.query(query, [resetToken, expiry, email]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to update reset token: ${error.message}`);
    }
  }

  /**
   * Find user by reset token
   * @param {string} resetToken
   * @returns {Promise<User|null>}
   */
  static async findByResetToken(resetToken) {
    try {
      const query = `
        SELECT id, email, password, role, phone_number, fullname, reset_token, reset_token_expiry
        FROM users
        WHERE reset_token = $1
      `;
      
      const result = await pool.query(query, [resetToken]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find user by reset token: ${error.message}`);
    }
  }

  /**
   * Clear reset token
   * @param {number} id
   * @returns {Promise<User|null>}
   */
  static async clearResetToken(id) {
    try {
      const query = `
        UPDATE users
        SET reset_token = NULL, reset_token_expiry = NULL
        WHERE id = $1
        RETURNING id, email
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to clear reset token: ${error.message}`);
    }
  }
}

module.exports = UserStore; 