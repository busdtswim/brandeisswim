// Update your dateUtils.js file if needed

// This function calculates age from birthdate
export const calculateAge = (birthdate) => {
  // If birthdate is null or undefined, return 0 or some default value
  if (!birthdate) return 0;

  // Handle string dates in MM/DD/YYYY format
  let birthdateObj;
  if (typeof birthdate === 'string') {
    if (birthdate.includes('/')) {
      // Parse MM/DD/YYYY format
      const [month, day, year] = birthdate.split('/').map(Number);
      birthdateObj = new Date(year, month - 1, day);
    } else {
      // Assume it's in a format Date can parse
      birthdateObj = new Date(birthdate);
    }
  } else {
    // If it's already a Date object
    birthdateObj = new Date(birthdate);
  }

  // Calculate age
  const today = new Date();
  let age = today.getFullYear() - birthdateObj.getFullYear();
  const m = today.getMonth() - birthdateObj.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthdateObj.getDate())) {
    age--;
  }
  
  return age;
};

// Format a date to MM/DD/YYYY string
export const formatToMMDDYYYY = (dateInput) => {
  // If already in MM/DD/YYYY format, return as is
  if (typeof dateInput === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(dateInput)) {
    return dateInput;
  }

  // If it's in YYYY-MM-DD format
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [year, month, day] = dateInput.split('-');
    return `${month}/${day}/${year}`;
  }

  // Convert from Date object or other formats
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    // Invalid date, return original input or empty string
    return dateInput || '';
  }

  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};

/**
 * Get current date in MM/DD/YYYY format
 * @returns {string} Formatted date string
 */
export const getCurrentDateString = () => {
  const today = new Date();
  return `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear()}`;
}