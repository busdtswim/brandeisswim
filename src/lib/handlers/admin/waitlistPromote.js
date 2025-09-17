const pool = require('@/lib/database.js');
const WaitlistStore = require('@/lib/stores/WaitlistStore.js');
const LessonStore = require('@/lib/stores/LessonStore.js');
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');

/**
 * Promote a waitlisted swimmer into a lesson if capacity allows
 * This is an admin-only action and bypasses public registration time rules.
 *
 * @param {Object} params
 * @param {number} params.waitlistId - The waitlist entry ID to promote
 * @param {number} params.lessonId - The target lesson ID
 * @param {number|null} [params.preferredInstructorId] - Optional preferred instructor to store
 * @param {string|null} [params.adminNote] - Optional admin note
 * @returns {Promise<Object>} Result with updated lesson and waitlist
 */
async function handleWaitlistPromotion({ waitlistId, lessonId, preferredInstructorId = null, adminNote = null }) {
  const waitlistIdInt = parseInt(waitlistId);
  const lessonIdInt = parseInt(lessonId);
  const preferredInstructorIdInt = preferredInstructorId !== null && preferredInstructorId !== undefined
    ? parseInt(preferredInstructorId)
    : null;

  if (isNaN(waitlistIdInt) || isNaN(lessonIdInt)) {
    throw new Error('Invalid waitlistId or lessonId');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Fetch waitlist entry and lesson inside the transaction (FOR UPDATE to prevent races)
    const waitlistRes = await client.query(
      `SELECT w.id, w.swimmer_id, w.status, w.position
       FROM waitlist w
       WHERE w.id = $1
       FOR UPDATE`,
      [waitlistIdInt]
    );

    if (waitlistRes.rows.length === 0) {
      throw new Error('Waitlist entry not found');
    }

    const waitlistEntry = waitlistRes.rows[0];
    if (waitlistEntry.status && waitlistEntry.status !== 'active') {
      throw new Error('Waitlist entry is not active');
    }

    const lessonRes = await client.query(
      `SELECT id, max_slots FROM lessons WHERE id = $1 FOR UPDATE`,
      [lessonIdInt]
    );
    if (lessonRes.rows.length === 0) {
      throw new Error('Lesson not found');
    }

    const lessonRow = lessonRes.rows[0];

    // Capacity check inside the transaction window
    const countRes = await client.query(
      `SELECT COUNT(*)::int AS count
       FROM swimmer_lessons
       WHERE lesson_id = $1`,
      [lessonIdInt]
    );
    const currentCount = countRes.rows[0].count;
    if (currentCount >= lessonRow.max_slots) {
      throw new Error('Lesson is full');
    }

    // Ensure not already enrolled
    const dupRes = await client.query(
      `SELECT 1 FROM swimmer_lessons WHERE swimmer_id = $1 AND lesson_id = $2`,
      [waitlistEntry.swimmer_id, lessonIdInt]
    );
    if (dupRes.rows.length > 0) {
      throw new Error('Swimmer is already registered for this lesson');
    }

    // Create enrollment (leave instructor_id null; mark payment_status false)
    await client.query(
      `INSERT INTO swimmer_lessons (
         swimmer_id, lesson_id, registration_date, payment_status, instructor_id, instructor_notes, preferred_instructor_id, missing_dates
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        waitlistEntry.swimmer_id,
        lessonIdInt,
        new Date().toISOString(),
        false,
        null,
        adminNote || 'Added from waitlist; coverage needed',
        preferredInstructorIdInt,
        null,
      ]
    );

    // Mark waitlist entry inactive and reorder
    await client.query(`UPDATE waitlist SET status = 'inactive' WHERE id = $1`, [waitlistEntry.id]);

    // Reorder remaining active positions
    await client.query(
      `WITH ranked AS (
         SELECT id, ROW_NUMBER() OVER (ORDER BY registration_date) as new_position
         FROM waitlist
         WHERE status = 'active'
       )
       UPDATE waitlist
       SET position = ranked.new_position
       FROM ranked
       WHERE waitlist.id = ranked.id`
    );

    await client.query('COMMIT');

    // Fetch updated lesson and waitlist using existing stores (outside the transaction)
    const lessonsWithParticipants = await LessonStore.findWithParticipants();
    const updatedLesson = lessonsWithParticipants.find(l => l.id === lessonIdInt) || null;
    const activeWaitlist = await WaitlistStore.findByStatus('active');

    return {
      success: true,
      message: 'Waitlisted swimmer promoted into lesson',
      lesson: updatedLesson,
      waitlist: activeWaitlist,
    };
  } catch (error) {
    try { await client.query('ROLLBACK'); } catch (_) {}
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  handleWaitlistPromotion
}; 