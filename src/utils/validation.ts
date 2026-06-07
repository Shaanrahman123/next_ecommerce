const EMAIL_REGEX = /\S+@\S+\.\S+/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Email is required';
  if (!isValidEmail(email)) return 'Email is invalid';
  return undefined;
}

export function validatePassword(password: string, minLength = 6): string | undefined {
  if (!password) return 'Password is required';
  if (password.length < minLength) return `Password must be at least ${minLength} characters`;
  return undefined;
}

export function validateConfirmPassword(password: string, confirmPassword: string): string | undefined {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return undefined;
}

export function splitFullName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/);
  return {
    firstName: parts[0] || 'User',
    lastName: parts.slice(1).join(' ') || 'Guest',
  };
}

export interface PasswordCriterion {
  label: string;
  test: (password: string) => boolean;
}

export const STRONG_PASSWORD_CRITERIA: PasswordCriterion[] = [
  { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
  { label: 'Contains uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
  { label: 'Contains lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
  { label: 'Contains number', test: (pwd) => /\d/.test(pwd) },
  { label: 'Contains special character', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
];

export function getPasswordStrength(password: string) {
  const passed = STRONG_PASSWORD_CRITERIA.filter((c) => c.test(password)).length;
  if (passed <= 2) return { label: 'Weak' as const, width: '33%' };
  if (passed <= 3) return { label: 'Medium' as const, width: '66%' };
  return { label: 'Strong' as const, width: '100%' };
}

export function validateStrongPassword(password: string): string | undefined {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!STRONG_PASSWORD_CRITERIA.every((c) => c.test(password))) {
    return 'Password does not meet all requirements';
  }
  return undefined;
}
