# Security Implementation

This document outlines the security measures implemented in the INSY POE Backend application.

## Helmet Configuration

The application uses Helmet.js to set various HTTP security headers. The configuration is located in `src/security/helmet.js` and includes:

### Content Security Policy (CSP)
- **Development Mode**: CSP runs in report-only mode for easier debugging
- **Production Mode**: CSP is enforced to prevent XSS attacks
- Allows self-hosted resources and common CDNs for development
- Blocks inline scripts and styles in production (configurable)

### Security Headers
- **HSTS**: Forces HTTPS connections
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-XSS-Protection**: Enables XSS filtering
- **Referrer Policy**: Controls referrer information
- **Permissions Policy**: Restricts browser features
- **Cross-Origin Policies**: Controls cross-origin resource sharing

## Environment Configuration

### Development (`NODE_ENV !== "production"`)
- CSP runs in report-only mode
- Allows unsafe-inline and unsafe-eval for development tools
- Mixed content is allowed
- Insecure requests are not upgraded

### Production (`NODE_ENV === "production"`)
- CSP is enforced
- Strict content policies
- Mixed content is blocked
- Insecure requests are upgraded to HTTPS

## Testing Security Headers

Run the security test script to verify headers are working:

```bash
# Start the server
npm run dev

# In another terminal, run the test
node test-security.js
```

Or test manually using curl:

```bash
curl -I http://localhost:5000/api/security-test
```

## CORS Configuration

CORS is configured to allow requests from the frontend application:
- **Origin**: `http://localhost:5173` (Vite dev server)
- **Methods**: GET, POST, PUT, DELETE
- **Credentials**: Enabled for authentication

## Security Best Practices

1. **Environment Variables**: Store sensitive data in `.env` files
2. **Rate Limiting**: Implemented via `express-rate-limit`
3. **Input Validation**: Using `express-validator`
4. **Authentication**: JWT-based with bcrypt password hashing
5. **HTTPS**: SSL/TLS configuration ready (commented out in server.js)

## CSP Reporting (Optional)

To enable CSP violation reporting, uncomment and configure the `reportUri` in `helmet.js`:

```javascript
reportUri: '/api/csp-report'
```

Then implement the endpoint to handle violation reports.

## Monitoring

The application logs CSP mode on startup:
- Development: "CSP mode: REPORT-ONLY (dev)"
- Production: "CSP mode: ENFORCED (prod)"

## Security Checklist

- [x] Helmet security headers
- [x] Content Security Policy
- [x] CORS configuration
- [x] Environment-based configuration
- [x] HTTPS ready (SSL configuration available)
- [x] Rate limiting
- [x] Input validation
- [x] Authentication middleware
- [x] Password hashing
- [ ] CSP violation reporting (optional)
- [ ] Security headers testing
- [ ] Regular security audits
