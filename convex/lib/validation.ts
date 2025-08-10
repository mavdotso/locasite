/**
 * Common validation utilities for Convex functions
 */

// Email validation regex - RFC 5322 compliant
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Subdomain validation regex
const SUBDOMAIN_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

// URL validation regex
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)$/;

// Phone number validation - supports international formats
const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;

/**
 * Validate email address format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email) {
    return { valid: false, error: "Email is required" };
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  
  if (trimmedEmail.length > 254) {
    return { valid: false, error: "Email address is too long" };
  }
  
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return { valid: false, error: "Invalid email format" };
  }
  
  // Check for common disposable email domains
  const disposableDomains = [
    'tempmail.com',
    'throwaway.email',
    'guerrillamail.com',
    'mailinator.com',
    '10minutemail.com'
  ];
  
  const domain = trimmedEmail.split('@')[1];
  if (disposableDomains.includes(domain)) {
    return { valid: false, error: "Disposable email addresses are not allowed" };
  }
  
  return { valid: true };
}

/**
 * Validate subdomain format
 */
export function validateSubdomain(subdomain: string): { valid: boolean; error?: string } {
  if (!subdomain) {
    return { valid: false, error: "Subdomain is required" };
  }
  
  const trimmed = subdomain.trim().toLowerCase();
  
  // Check length (3-63 characters)
  if (trimmed.length < 3) {
    return { valid: false, error: "Subdomain must be at least 3 characters long" };
  }
  
  if (trimmed.length > 63) {
    return { valid: false, error: "Subdomain must be less than 63 characters" };
  }
  
  // Check format
  if (!SUBDOMAIN_REGEX.test(trimmed)) {
    return { 
      valid: false, 
      error: "Subdomain can only contain lowercase letters, numbers, and hyphens (not at the start or end)" 
    };
  }
  
  // Check for consecutive hyphens
  if (/--/.test(trimmed)) {
    return { valid: false, error: "Subdomain cannot contain consecutive hyphens" };
  }
  
  // Check for reserved subdomains
  const reserved = [
    'www', 'api', 'app', 'admin', 'mail', 'ftp', 
    'blog', 'shop', 'store', 'help', 'support',
    'dashboard', 'account', 'login', 'signup',
    'oauth', 'auth', 'sso', 'cdn', 'static'
  ];
  
  if (reserved.includes(trimmed)) {
    return { valid: false, error: "This subdomain is reserved" };
  }
  
  return { valid: true };
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): { valid: boolean; error?: string } {
  if (!url) {
    return { valid: true }; // URLs are often optional
  }
  
  const trimmed = url.trim();
  
  if (!URL_REGEX.test(trimmed)) {
    return { valid: false, error: "Invalid URL format" };
  }
  
  return { valid: true };
}

/**
 * Validate phone number format
 */
export function validatePhone(phone: string): { valid: boolean; error?: string } {
  if (!phone) {
    return { valid: true }; // Phone numbers are often optional
  }
  
  const cleaned = phone.replace(/\s/g, '');
  
  if (!PHONE_REGEX.test(cleaned)) {
    return { valid: false, error: "Invalid phone number format" };
  }
  
  return { valid: true };
}

/**
 * Validate domain name format
 */
export function validateDomain(domain: string): { valid: boolean; error?: string } {
  if (!domain) {
    return { valid: false, error: "Domain is required" };
  }
  
  const trimmed = domain.trim().toLowerCase();
  
  // Basic domain validation
  const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
  
  if (!domainRegex.test(trimmed)) {
    return { valid: false, error: "Invalid domain format" };
  }
  
  // Check for IP addresses (not allowed as custom domains)
  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  if (ipRegex.test(trimmed)) {
    return { valid: false, error: "IP addresses are not allowed as custom domains" };
  }
  
  return { valid: true };
}

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

/**
 * Validate business name
 */
export function validateBusinessName(name: string): { valid: boolean; error?: string } {
  if (!name) {
    return { valid: false, error: "Business name is required" };
  }
  
  const trimmed = name.trim();
  
  if (trimmed.length < 2) {
    return { valid: false, error: "Business name must be at least 2 characters" };
  }
  
  if (trimmed.length > 100) {
    return { valid: false, error: "Business name must be less than 100 characters" };
  }
  
  // Check for profanity or inappropriate content
  // This is a basic check - consider using a proper profanity filter library
  const inappropriate = ['xxx', 'porn', 'sex'];
  const lowerName = trimmed.toLowerCase();
  
  for (const word of inappropriate) {
    if (lowerName.includes(word)) {
      return { valid: false, error: "Business name contains inappropriate content" };
    }
  }
  
  return { valid: true };
}