/**
 * Simple rate limiting for Next.js App Router
 * For production: This will reset on server restart, but it's simple and works
 */

const rateLimitStore = new Map();

/**
 * Simple rate limiter
 * @param {number} maxRequests - Max requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @param {string} message - Error message
 */
export const createRateLimiter = (maxRequests, windowMs, message) => {
  return async (req) => {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const key = `${ip}:${req.url}`;
    const now = Date.now();
    
    // Get existing requests for this IP
    const requests = rateLimitStore.get(key) || [];
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(time => time > now - windowMs);
    
    // Check if limit exceeded
    if (recentRequests.length >= maxRequests) {
      return {
        success: false,
        error: message
      };
    }
    
    // Add current request
    recentRequests.push(now);
    rateLimitStore.set(key, recentRequests);
    
    return { success: true };
  };
};

// Pre-configured limiters
export const authLimiter = createRateLimiter(5, 15 * 60 * 1000, 'Too many login attempts');
export const registrationLimiter = createRateLimiter(3, 60 * 60 * 1000, 'Too many registrations');
export const contactLimiter = createRateLimiter(5, 60 * 60 * 1000, 'Too many contact submissions');
export const lessonRegistrationLimiter = createRateLimiter(10, 15 * 60 * 1000, 'Too many lesson registrations'); 