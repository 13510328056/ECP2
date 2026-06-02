/**
 * Validates a Ghanaian phone number.
 * Accepts formats: +233 XX XXX XXXX, 0XX XXX XXXX, 0XXXXXXXXX
 * @example isValidPhone('+233 24 123 4567') // true
 * @example isValidPhone('0241234567') // true
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '')
  const ghanaPhoneRegex = /^(\+233|0)[2-9]\d{8}$/
  return ghanaPhoneRegex.test(cleaned)
}

/**
 * Validates an email address using a standard format check.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Checks whether a string value is non-empty after trimming.
 */
export function isRequired(value: string): boolean {
  return value.trim().length > 0
}
