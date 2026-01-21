const helmet = require('helmet');

// Environment-based CSP configuration
const isDevelopment = process.env.NODE_ENV !== 'production';

// Content Security Policy configuration
const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Required for inline styles (consider removing in production)
      "https://fonts.googleapis.com",
      "https://cdn.jsdelivr.net",
      "https://unpkg.com"
    ],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Required for inline scripts (consider removing in production)
      "'unsafe-eval'", // Required for development tools (remove in production)
      "https://cdn.jsdelivr.net",
      "https://unpkg.com"
    ],
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com",
      "data:"
    ],
    imgSrc: [
      "'self'",
      "data:",
      "https:",
      "blob:"
    ],
    connectSrc: [
      "'self'",
      "ws://localhost:*", // WebSocket for development
      "wss://localhost:*",
      "http://localhost:*", // Local API calls
      "https://api.*" // External API calls
    ],
    mediaSrc: [
      "'self'",
      "data:",
      "blob:"
    ],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: isDevelopment ? null : [], // Only enforce in production
  },
  // Set to report-only in development for easier debugging
  reportOnly: isDevelopment,
  // Optional: Configure CSP reporting endpoint
  // reportUri: '/api/csp-report'
};

// Helmet configuration with comprehensive security headers
const helmetConfig = helmet({
  // Block all mixed content (separate from CSP)
  blockAllMixedContent: !isDevelopment,
  // Content Security Policy
  contentSecurityPolicy: cspConfig,
  
  // Cross-Origin Embedder Policy
  crossOriginEmbedderPolicy: { policy: "require-corp" },
  
  // Cross-Origin Opener Policy
  crossOriginOpenerPolicy: { policy: "same-origin" },
  
  // Cross-Origin Resource Policy
  crossOriginResourcePolicy: { policy: "cross-origin" },
  
  // DNS Prefetch Control
  dnsPrefetchControl: { allow: false },
  
  // Expect-CT (Certificate Transparency)
  expectCt: {
    maxAge: 86400,
    enforce: true,
  },
  
  // Feature Policy (deprecated but still useful for older browsers)
  featurePolicy: {
    features: {
      camera: ["'none'"],
      microphone: ["'none'"],
      geolocation: ["'none'"],
      payment: ["'none'"],
      usb: ["'none'"],
      magnetometer: ["'none'"],
      gyroscope: ["'none'"],
      accelerometer: ["'none'"],
      ambientLightSensor: ["'none'"],
      autoplay: ["'none'"],
      encryptedMedia: ["'none'"],
      fullscreen: ["'self'"],
      pictureInPicture: ["'none'"],
      syncXhr: ["'none'"],
      vibrate: ["'none'"],
      wakeLock: ["'none'"],
    }
  },
  
  // Frameguard
  frameguard: { action: 'deny' },
  
  // Hide X-Powered-By header
  hidePoweredBy: true,
  
  // HSTS (HTTP Strict Transport Security)
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  
  // IE No Open
  ieNoOpen: true,
  
  // No Sniff
  noSniff: true,
  
  // Origin Agent Cluster
  originAgentCluster: true,
  
  // Permissions Policy
  permissionsPolicy: {
    camera: [],
    microphone: [],
    geolocation: [],
    payment: [],
    usb: [],
    magnetometer: [],
    gyroscope: [],
    accelerometer: [],
    ambientLightSensor: [],
    autoplay: [],
    encryptedMedia: [],
    fullscreen: ["self"],
    pictureInPicture: [],
    syncXhr: [],
    vibrate: [],
    wakeLock: [],
  },
  
  // Referrer Policy
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  
  // XSS Filter
  xssFilter: true,
});

module.exports = helmetConfig;
