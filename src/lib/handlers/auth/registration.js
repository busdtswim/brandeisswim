const UserStore = require('@/lib/stores/UserStore.js');
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');
const bcrypt = require('bcrypt');

/**
 * Main registration handler
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration result
 */
async function handleRegistration(userData) {
  try {
    // Check if email already exists
    const existingUser = await UserStore.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create the user with hashed password
    const user = await UserStore.create({
      email: userData.email,
      password: hashedPassword, // Store the hashed password
      role: 'customer',
      phone_number: userData.phoneNumber,
      fullname: userData.fullName,
    });

    // Create swimmers if provided (Zod validation happens automatically in SwimmerStore.create)
    let swimmers = [];
    if (userData.swimmers && userData.swimmers.length > 0) {
      for (const swimmer of userData.swimmers) {
        const createdSwimmer = await SwimmerStore.create({
          name: swimmer.name,
          birthdate: swimmer.birthdate,
          gender: swimmer.gender,
          proficiency: swimmer.proficiency,
          user_id: user.id
        });
        swimmers.push(createdSwimmer);
      }
    }

    // Remove sensitive data from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      message: 'User and swimmers created successfully',
      user: userWithoutPassword,
      swimmers: swimmers
    };
  } catch (error) {
    // Re-throw the error to be handled by the route
    throw error;
  }
}

module.exports = {
  handleRegistration
}; 