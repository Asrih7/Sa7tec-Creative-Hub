/**
 * Security utilities for SA7TEC website
 * Implements best practices for XSS prevention, input validation, and data sanitization
 */

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validates phone number format (E.164 format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ""));
}

/**
 * Sanitizes user input to prevent XSS
 * Note: React escapes by default, but explicit sanitization is good practice
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  
  return (
    input
      .trim()
      .replace(/[<>\"]/g, (char) => {
        const map: Record<string, string> = {
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
        };
        return map[char] || char;
      })
      // Remove any potential script patterns
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
  );
}

export function normalizeInput(input: string, maxLength: number): string {
  return sanitizeInput(input)
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

/**
 * Validates form data object
 */
export function validateContactForm(data: {
  name?: string;
  email?: string;
  projectType?: string;
  budgetRange?: string;
  message?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }
  if (data.name && data.name.length > 100) {
    errors.push("Name must not exceed 100 characters");
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Invalid email address");
  }

  if (!data.projectType || data.projectType.trim().length === 0) {
    errors.push("Project type is required");
  }

  if (!data.budgetRange || data.budgetRange.trim().length === 0) {
    errors.push("Budget range is required");
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters");
  }
  if (data.message && data.message.length > 5000) {
    errors.push("Message must not exceed 5000 characters");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Rate limiting for client-side form submission
 */
export class RateLimiter {
  private key: string;
  private maxRequests: number;
  private windowMs: number;

  constructor(key: string, maxRequests: number = 5, windowMs: number = 3600000) {
    this.key = key;
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(): boolean {
    const data = this.getStoredData();
    const now = Date.now();

    // Clean old entries
    const recentAttempts = data.filter((timestamp) => now - timestamp < this.windowMs);

    if (recentAttempts.length < this.maxRequests) {
      recentAttempts.push(now);
      localStorage.setItem(this.key, JSON.stringify(recentAttempts));
      return true;
    }

    return false;
  }

  getNextAllowedTime(): number {
    const data = this.getStoredData();
    if (data.length === 0) return Date.now();
    const oldestAllowed = data[0] + this.windowMs;
    return oldestAllowed;
  }

  private getStoredData(): number[] {
    try {
      const stored = localStorage.getItem(this.key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  reset(): void {
    localStorage.removeItem(this.key);
  }
}

export async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function generateSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function hashPassword(password: string, salt = generateSalt()): Promise<string> {
  const hash = await sha256Hex(`${salt}:${password}`);
  return `sha256:${salt}:${hash}`;
}

export async function verifyPassword(password: string, stored: string | null | undefined): Promise<boolean> {
  if (!stored) return false;
  if (!stored.startsWith("sha256:")) {
    return password === stored;
  }

  const [, salt, expectedHash] = stored.split(":");
  if (!salt || !expectedHash) return false;
  const actualHash = await sha256Hex(`${salt}:${password}`);
  return actualHash === expectedHash;
}

/**
 * Generates a secure random token for CSRF protection
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Validates URL to prevent open redirects
 */
export function isValidRedirectUrl(url: string): boolean {
  if (!url) return false;
  
  // Only allow relative URLs or same-origin absolute URLs
  if (url.startsWith("/")) return true;
  
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.origin === window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Securely stores sensitive data in sessionStorage (cleared on browser close)
 */
export function secureStore(key: string, value: string): void {
  try {
    const encrypted = btoa(encodeURIComponent(value)); // Basic encoding (use crypto-js for production)
    sessionStorage.setItem(key, encrypted);
  } catch {
    console.warn("Failed to store secure data");
  }
}

/**
 * Retrieves securely stored data
 */
export function secureRetrieve(key: string): string | null {
  try {
    const encrypted = sessionStorage.getItem(key);
    if (!encrypted) return null;
    return decodeURIComponent(atob(encrypted)); // Basic decoding (use crypto-js for production)
  } catch {
    return null;
  }
}

export default {
  isValidEmail,
  isValidPhone,
  sanitizeInput,
  validateContactForm,
  RateLimiter,
  normalizeInput,
  sha256Hex,
  generateSalt,
  hashPassword,
  verifyPassword,
  generateCSRFToken,
  isValidRedirectUrl,
  secureStore,
  secureRetrieve,
};
