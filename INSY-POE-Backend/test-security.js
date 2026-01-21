/**
 * Security Headers Test Script
 * 
 * This script tests the security headers implemented by Helmet
 * Run with: node test-security.js
 */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 5000,
  path: '/api/security-test',
  method: 'GET',
  headers: {
    'User-Agent': 'Security-Test-Script'
  }
};

console.log('Testing Security Headers...\n');

const req = http.request(options, (res) => {
  console.log('Response Status:', res.statusCode);
  console.log('Security Headers:\n');

  // List of important security headers to check
  const securityHeaders = [
    'content-security-policy',
    'content-security-policy-report-only',
    'x-frame-options',
    'x-content-type-options',
    'x-xss-protection',
    'strict-transport-security',
    'referrer-policy',
    'permissions-policy',
    'cross-origin-embedder-policy',
    'cross-origin-opener-policy',
    'cross-origin-resource-policy',
    'x-dns-prefetch-control',
    'x-download-options',
    'x-permitted-cross-domain-policies',
    'expect-ct',
    'origin-agent-cluster'
  ];

  let foundHeaders = 0;
  
  securityHeaders.forEach(header => {
    const value = res.headers[header];
    if (value) {
      console.log(`${header}:`);
      console.log(`${value}\n`);
      foundHeaders++;
    }
  });

  // Check for X-Powered-By (should be removed by Helmet)
  if (res.headers['x-powered-by']) {
    console.log('X-Powered-By header is present (should be removed by Helmet)');
  } else {
    console.log('X-Powered-By header removed by Helmet');
  }

  console.log(`\nSummary: ${foundHeaders} security headers found`);

  // Display response body
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(body);
      console.log('\nResponse Body:');
      console.log(JSON.stringify(response, null, 2));
    } catch (_e) {
      console.log('\nResponse Body:');
      console.log(body);
    }
    
    console.log('\nSecurity test completed!');
  });
});

req.on('error', (e) => {
  console.error('Error testing security headers:', e.message);
  console.log('\nMake sure the server is running with: npm run dev');
});

req.end();
