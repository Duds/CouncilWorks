/**
 * Content Security Policy (CSP) Configuration
 * 
 * Implements comprehensive CSP headers for Essential Eight compliance
 * Provides protection against XSS attacks and unauthorized resource loading
 */

export interface CSPConfig {
  defaultSrc: string[];
  scriptSrc: string[];
  styleSrc: string[];
  imgSrc: string[];
  fontSrc: string[];
  connectSrc: string[];
  frameSrc: string[];
  objectSrc: string[];
  mediaSrc: string[];
  manifestSrc: string[];
  workerSrc: string[];
  childSrc: string[];
  formAction: string[];
  frameAncestors: string[];
  baseUri: string[];
  upgradeInsecureRequests: boolean;
  blockAllMixedContent: boolean;
  reportUri?: string;
  reportTo?: string;
}

/**
 * Production CSP Configuration
 * Strict policy for production environments
 */
export const productionCSP: CSPConfig = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'", // Required for Next.js
    "'unsafe-eval'", // Required for Next.js development
    "https://cdn.jsdelivr.net", // For external libraries
    "https://unpkg.com", // For external libraries
    "https://cdnjs.cloudflare.com", // For external libraries
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'", // Required for styled-components and CSS-in-JS
    "https://fonts.googleapis.com", // For Google Fonts
    "https://cdn.jsdelivr.net",
  ],
  imgSrc: [
    "'self'",
    "data:", // For base64 images
    "blob:", // For blob URLs
    "https://images.unsplash.com", // For demo images
    "https://via.placeholder.com", // For placeholder images
    "https://cdn.jsdelivr.net",
    "https://unpkg.com",
  ],
  fontSrc: [
    "'self'",
    "data:", // For base64 fonts
    "https://fonts.gstatic.com", // For Google Fonts
    "https://cdn.jsdelivr.net",
  ],
  connectSrc: [
    "'self'",
    "https://api.councilworks.com", // API endpoints
    "https://*.azure.com", // Azure services
    "https://*.microsoft.com", // Microsoft services
    "wss://*.azure.com", // WebSocket connections
  ],
  frameSrc: [
    "'self'",
    "https://www.google.com", // For Google services
    "https://*.microsoft.com", // For Microsoft services
  ],
  objectSrc: ["'none'"], // Block all object embeds
  mediaSrc: [
    "'self'",
    "data:",
    "blob:",
  ],
  manifestSrc: ["'self'"],
  workerSrc: [
    "'self'",
    "blob:",
  ],
  childSrc: [
    "'self'",
    "blob:",
  ],
  formAction: [
    "'self'",
    "https://api.councilworks.com",
  ],
  frameAncestors: ["'none'"], // Prevent clickjacking
  baseUri: ["'self'"],
  upgradeInsecureRequests: true,
  blockAllMixedContent: true,
  reportUri: "/api/security/csp-report",
  reportTo: "csp-endpoint",
};

/**
 * Development CSP Configuration
 * More permissive for development environment
 */
export const developmentCSP: CSPConfig = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'", // Required for Next.js development
    "https://cdn.jsdelivr.net",
    "https://unpkg.com",
    "https://cdnjs.cloudflare.com",
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com",
    "https://cdn.jsdelivr.net",
  ],
  imgSrc: [
    "'self'",
    "data:",
    "blob:",
    "https://images.unsplash.com",
    "https://via.placeholder.com",
    "https://cdn.jsdelivr.net",
    "https://unpkg.com",
  ],
  fontSrc: [
    "'self'",
    "data:",
    "https://fonts.gstatic.com",
    "https://cdn.jsdelivr.net",
  ],
  connectSrc: [
    "'self'",
    "https://api.councilworks.com",
    "https://*.azure.com",
    "https://*.microsoft.com",
    "wss://*.azure.com",
    "http://localhost:*", // For local development
    "ws://localhost:*", // For local WebSocket
  ],
  frameSrc: [
    "'self'",
    "https://www.google.com",
    "https://*.microsoft.com",
  ],
  objectSrc: ["'none'"],
  mediaSrc: [
    "'self'",
    "data:",
    "blob:",
  ],
  manifestSrc: ["'self'"],
  workerSrc: [
    "'self'",
    "blob:",
  ],
  childSrc: [
    "'self'",
    "blob:",
  ],
  formAction: [
    "'self'",
    "https://api.councilworks.com",
  ],
  frameAncestors: ["'none'"],
  baseUri: ["'self'"],
  upgradeInsecureRequests: false, // Disabled for development
  blockAllMixedContent: false, // Disabled for development
  reportUri: "/api/security/csp-report",
  reportTo: "csp-endpoint",
};

/**
 * Generate CSP header string from configuration
 */
export function generateCSPHeader(config: CSPConfig): string {
  const directives: string[] = [];

  // Add all directives
  directives.push(`default-src ${config.defaultSrc.join(' ')}`);
  directives.push(`script-src ${config.scriptSrc.join(' ')}`);
  directives.push(`style-src ${config.styleSrc.join(' ')}`);
  directives.push(`img-src ${config.imgSrc.join(' ')}`);
  directives.push(`font-src ${config.fontSrc.join(' ')}`);
  directives.push(`connect-src ${config.connectSrc.join(' ')}`);
  directives.push(`frame-src ${config.frameSrc.join(' ')}`);
  directives.push(`object-src ${config.objectSrc.join(' ')}`);
  directives.push(`media-src ${config.mediaSrc.join(' ')}`);
  directives.push(`manifest-src ${config.manifestSrc.join(' ')}`);
  directives.push(`worker-src ${config.workerSrc.join(' ')}`);
  directives.push(`child-src ${config.childSrc.join(' ')}`);
  directives.push(`form-action ${config.formAction.join(' ')}`);
  directives.push(`frame-ancestors ${config.frameAncestors.join(' ')}`);
  directives.push(`base-uri ${config.baseUri.join(' ')}`);

  // Add boolean directives
  if (config.upgradeInsecureRequests) {
    directives.push('upgrade-insecure-requests');
  }
  if (config.blockAllMixedContent) {
    directives.push('block-all-mixed-content');
  }

  // Add reporting directives
  if (config.reportUri) {
    directives.push(`report-uri ${config.reportUri}`);
  }
  if (config.reportTo) {
    directives.push(`report-to ${config.reportTo}`);
  }

  return directives.join('; ');
}

/**
 * Get CSP configuration based on environment
 */
export function getCSPConfig(): CSPConfig {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment ? developmentCSP : productionCSP;
}

/**
 * CSP Report Endpoint Types
 */
export interface CSPViolationReport {
  'csp-report': {
    'document-uri': string;
    'referrer': string;
    'violated-directive': string;
    'effective-directive': string;
    'original-policy': string;
    'disposition': string;
    'blocked-uri': string;
    'line-number': number;
    'column-number': number;
    'source-file': string;
    'status-code': number;
    'script-sample': string;
  };
}

/**
 * Security Headers Configuration
 */
export interface SecurityHeaders {
  'Content-Security-Policy': string;
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Strict-Transport-Security': string;
  'X-XSS-Protection': string;
}

/**
 * Generate comprehensive security headers
 */
export function generateSecurityHeaders(): SecurityHeaders {
  const cspConfig = getCSPConfig();
  const cspHeader = generateCSPHeader(cspConfig);

  return {
    'Content-Security-Policy': cspHeader,
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-XSS-Protection': '1; mode=block',
  };
}
