import {
  calculateAge,
  formatToMMDDYYYY,
  getCurrentDateString
} from '../dateUtils'

describe('dateUtils', () => {
  describe('calculateAge', () => {
    it('should calculate age correctly from MM/DD/YYYY string', () => {
      const birthdate = '01/15/2010'
      const result = calculateAge(birthdate)
      const expectedAge = new Date().getFullYear() - 2010
      expect(result).toBe(expectedAge)
    })

    it('should calculate age correctly from YYYY-MM-DD string', () => {
      const birthdate = '2010-01-15'
      const result = calculateAge(birthdate)
      const expectedAge = new Date().getFullYear() - 2010
      expect(result).toBe(expectedAge)
    })

    it('should calculate age correctly from Date object', () => {
      const birthdate = new Date('2010-01-15')
      const result = calculateAge(birthdate)
      const expectedAge = new Date().getFullYear() - 2010
      expect(result).toBe(expectedAge)
    })

    it('should handle null birthdate', () => {
      const result = calculateAge(null)
      expect(result).toBe(0)
    })

    it('should handle undefined birthdate', () => {
      const result = calculateAge(undefined)
      expect(result).toBe(0)
    })

    it('should handle invalid date string', () => {
      const result = calculateAge('invalid-date')
      // The function returns NaN for invalid dates, so we check for that
      expect(isNaN(result)).toBe(true)
    })
  })

  describe('formatToMMDDYYYY', () => {
    it('should return MM/DD/YYYY string as is', () => {
      const dateString = '12/25/2024'
      const result = formatToMMDDYYYY(dateString)
      expect(result).toBe('12/25/2024')
    })

    it('should convert YYYY-MM-DD to MM/DD/YYYY', () => {
      const dateString = '2024-12-25'
      const result = formatToMMDDYYYY(dateString)
      expect(result).toBe('12/25/2024')
    })

    it('should convert Date object to MM/DD/YYYY', () => {
      const date = new Date('2024-12-25')
      const result = formatToMMDDYYYY(date)
      // Note: Date constructor can have timezone issues, so we check the format instead
      expect(result).toMatch(/^\d{2}\/\d{2}\/2024$/)
    })

    it('should handle invalid date input', () => {
      const invalidDate = 'invalid-date'
      const result = formatToMMDDYYYY(invalidDate)
      expect(result).toBe('invalid-date')
    })

    it('should handle null input', () => {
      const result = formatToMMDDYYYY(null)
      // The function returns a date string for null input, so we check the format
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/)
    })
  })

  describe('getCurrentDateString', () => {
    it('should return current date in MM/DD/YYYY format', () => {
      const result = getCurrentDateString()
      const today = new Date()
      const expected = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear()}`
      expect(result).toBe(expected)
    })

    it('should return string in correct format', () => {
      const result = getCurrentDateString()
      const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/
      expect(result).toMatch(dateFormat)
    })
  })
}) 