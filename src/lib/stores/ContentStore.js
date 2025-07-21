const pool = require('../database.js');
const { z } = require('zod');

/**
 * @typedef {Object} ContentCreateDTO
 * @property {string} section - Content section identifier
 * @property {string} content - Content text/HTML
 * @property {string} [title] - Content title
 * @property {boolean} [is_custom] - Whether content is custom
 * @property {number} [order_num] - Display order
 */

/**
 * @typedef {Object} ContentUpdateDTO
 * @property {string} [content] - Content text/HTML
 * @property {string} [title] - Content title
 * @property {boolean} [is_custom] - Whether content is custom
 * @property {number} [order_num] - Display order
 */

/**
 * @typedef {Object} Content
 * @property {number} id - Content ID
 * @property {string} section - Content section identifier
 * @property {string} content - Content text/HTML
 * @property {string} [title] - Content title
 * @property {boolean} is_custom - Whether content is custom
 * @property {number} order_num - Display order
 * @property {Date} last_updated - Last update timestamp
 */

// Zod schemas for validation
const ContentCreateSchema = z.object({
  section: z.string().min(1, 'Section is required'),
  content: z.string().min(1, 'Content is required'),
  title: z.string().optional(),
  is_custom: z.boolean().optional(),
  order_num: z.number().optional(),
});

const ContentUpdateSchema = z.object({
  content: z.string().min(1, 'Content is required').optional(),
  title: z.string().optional(),
  is_custom: z.boolean().optional(),
  order_num: z.number().optional(),
});

class ContentStore {
  /**
   * Create new content
   * @param {ContentCreateDTO} contentData
   * @returns {Promise<Content>}
   */
  static async create(contentData) {
    try {
      // Validate input
      const validatedData = ContentCreateSchema.parse(contentData);
      
      const query = `
        INSERT INTO site_content (section, content, title, is_custom, order_num, last_updated)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING id, section, content, title, is_custom, order_num, last_updated
      `;
      
      const values = [
        validatedData.section,
        validatedData.content,
        validatedData.title || '',
        validatedData.is_custom || true,
        validatedData.order_num || 0
      ];
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('Content for this section already exists');
      }
      throw new Error(`Failed to create content: ${error.message}`);
    }
  }

  /**
   * Find content by ID
   * @param {number} id
   * @returns {Promise<Content|null>}
   */
  static async findById(id) {
    try {
      const query = `
        SELECT id, section, content, title, is_custom, order_num, last_updated
        FROM site_content
        WHERE id = $1
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find content by ID: ${error.message}`);
    }
  }

  /**
   * Find content by section
   * @param {string} section
   * @returns {Promise<Content|null>}
   */
  static async findBySection(section) {
    try {
      const query = `
        SELECT id, section, content, title, is_custom, order_num, last_updated
        FROM site_content
        WHERE section = $1
      `;
      
      const result = await pool.query(query, [section]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find content by section: ${error.message}`);
    }
  }

  /**
   * Find all content
   * @returns {Promise<Content[]>}
   */
  static async findAll() {
    try {
      const query = `
        SELECT id, section, content, title, is_custom, order_num, last_updated
        FROM site_content
        ORDER BY order_num, section
      `;
      
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to find all content: ${error.message}`);
    }
  }

  /**
   * Update content
   * @param {number} id
   * @param {ContentUpdateDTO} updateData
   * @returns {Promise<Content|null>}
   */
  static async update(id, updateData) {
    try {
      // Validate input
      const validatedData = ContentUpdateSchema.parse(updateData);
      
      const setClause = [];
      const values = [];
      let paramCount = 1;

      if (validatedData.content !== undefined) {
        setClause.push(`content = $${paramCount++}`);
        values.push(validatedData.content);
      }
      if (validatedData.title !== undefined) {
        setClause.push(`title = $${paramCount++}`);
        values.push(validatedData.title);
      }
      if (validatedData.is_custom !== undefined) {
        setClause.push(`is_custom = $${paramCount++}`);
        values.push(validatedData.is_custom);
      }
      if (validatedData.order_num !== undefined) {
        setClause.push(`order_num = $${paramCount++}`);
        values.push(validatedData.order_num);
      }

      if (setClause.length === 0) {
        throw new Error('No fields to update');
      }

      // Always update last_updated
      setClause.push(`last_updated = NOW()`);

      values.push(id);
      const query = `
        UPDATE site_content
        SET ${setClause.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, section, content, title, is_custom, order_num, last_updated
      `;
      
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to update content: ${error.message}`);
    }
  }

  /**
   * Update content by section
   * @param {string} section
   * @param {ContentUpdateDTO} updateData
   * @returns {Promise<Content|null>}
   */
  static async updateBySection(section, updateData) {
    try {
      // Validate input
      const validatedData = ContentUpdateSchema.parse(updateData);
      
      const setClause = [];
      const values = [];
      let paramCount = 1;

      if (validatedData.content !== undefined) {
        setClause.push(`content = $${paramCount++}`);
        values.push(validatedData.content);
      }
      if (validatedData.title !== undefined) {
        setClause.push(`title = $${paramCount++}`);
        values.push(validatedData.title);
      }
      if (validatedData.is_custom !== undefined) {
        setClause.push(`is_custom = $${paramCount++}`);
        values.push(validatedData.is_custom);
      }
      if (validatedData.order_num !== undefined) {
        setClause.push(`order_num = $${paramCount++}`);
        values.push(validatedData.order_num);
      }

      if (setClause.length === 0) {
        throw new Error('No fields to update');
      }

      // Always update last_updated
      setClause.push(`last_updated = NOW()`);

      values.push(section);
      const query = `
        UPDATE site_content
        SET ${setClause.join(', ')}
        WHERE section = $${paramCount}
        RETURNING id, section, content, title, is_custom, order_num, last_updated
      `;
      
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to update content by section: ${error.message}`);
    }
  }

  /**
   * Delete content
   * @param {number} id
   * @returns {Promise<{id: number}|null>}
   */
  static async delete(id) {
    try {
      const query = 'DELETE FROM site_content WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to delete content: ${error.message}`);
    }
  }

  /**
   * Delete content by section
   * @param {string} section
   * @returns {Promise<{id: number}|null>}
   */
  static async deleteBySection(section) {
    try {
      const query = 'DELETE FROM site_content WHERE section = $1 RETURNING id';
      const result = await pool.query(query, [section]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to delete content by section: ${error.message}`);
    }
  }

  /**
   * Create or update content by section (upsert)
   * @param {string} section
   * @param {ContentCreateDTO} contentData
   * @returns {Promise<Content>}
   */
  static async upsertBySection(section, contentData) {
    try {
      // Validate input
      const validatedData = ContentCreateSchema.parse({ ...contentData, section });
      
      const query = `
        INSERT INTO site_content (section, content, title, is_custom, order_num, last_updated)
        VALUES ($1, $2, $3, $4, $5, NOW())
        ON CONFLICT (section) DO UPDATE SET
          content = EXCLUDED.content,
          title = EXCLUDED.title,
          is_custom = EXCLUDED.is_custom,
          order_num = EXCLUDED.order_num,
          last_updated = NOW()
        RETURNING id, section, content, title, is_custom, order_num, last_updated
      `;
      
      const values = [
        validatedData.section,
        validatedData.content,
        validatedData.title || '',
        validatedData.is_custom || true,
        validatedData.order_num || 0
      ];
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to upsert content: ${error.message}`);
    }
  }
}

module.exports = ContentStore; 