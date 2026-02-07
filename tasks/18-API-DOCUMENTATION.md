# Task 18: API Documentation & Developer Portal

## Objective
Create comprehensive, developer-friendly API documentation to enable:
- Future mobile app development
- Third-party integrations (if needed)
- Internal team reference
- External audit (transparency)

## Core Requirements
- Auto-generated from code (OpenAPI/Swagger)
- Interactive testing (try API in browser)
- Authentication examples
- Error handling guide
- Versioning
- Rate limiting docs

## Subtasks

### 1. OpenAPI/Swagger Setup
- [ ] Install Swagger/OpenAPI library (backend framework dependent)
  - Node.js: swagger-jsdoc, swagger-ui-express
  - Python: FastAPI (built-in), Flask-RESTX
  - Go: swaggo/swag
- [ ] Annotate existing API endpoints with OpenAPI spec
- [ ] Auto-generate Swagger JSON/YAML

### 2. API Documentation Structure
```
/api-docs
  ├── /authentication
  ├── /societies
  ├── /residents
  ├── /vendors
  ├── /contracts
  ├── /services
  ├── /bookings
  ├── /payments
  ├── /ledger
  ├── /assets
  ├── /complaints
  ├── /notices
  ├── /votes
  ├── /reports
  └── /utilities
```

### 3. Per Endpoint Documentation
For each API endpoint, include:
- [ ] **Method & Path**
  - `POST /auth/login`
- [ ] **Description**
  - "Authenticate user and return JWT token"
- [ ] **Request Headers**
  - `Content-Type: application/json`
- [ ] **Request Body** (with schema)
  ```json
  {
    "email": "user@example.com",
    "password": "string"
  }
  ```
- [ ] **Response** (success - 200)
  ```json
  {
    "token": "jwt_token_here",
    "user": { ... }
  }
  ```
- [ ] **Error Responses**
  - 400 Bad Request
  - 401 Unauthorized
  - 500 Internal Server Error
- [ ] **Authentication Required?**
  - Yes/No
- [ ] **Rate Limiting**
  - 5 requests per minute

### 4. Authentication Guide
- [ ] How to register
- [ ] How to login
- [ ] How to get JWT token
- [ ] How to use JWT token in requests
  - `Authorization: Bearer <token>`
- [ ] Token expiry and refresh
- [ ] Role-based access control (RBAC) explanation

### 5. Interactive API Explorer (Swagger UI)
- [ ] Deploy Swagger UI at `/api-docs`
- [ ] "Try it out" functionality for each endpoint
- [ ] Pre-fill authentication token (after login)
- [ ] Example requests and responses

### 6. Error Handling Guide
- [ ] Standard error response format:
  ```json
  {
    "error": {
      "code": "INVALID_INPUT",
      "message": "Email is required",
      "details": { ... }
    }
  }
  ```
- [ ] Error code list with explanations:
  - `INVALID_INPUT` - Validation failed
  - `UNAUTHORIZED` - Invalid or missing token
  - `FORBIDDEN` - Insufficient permissions
  - `NOT_FOUND` - Resource not found
  - `CONFLICT` - Resource already exists
  - `RATE_LIMIT_EXCEEDED` - Too many requests
  - `INTERNAL_ERROR` - Server error

### 7. Rate Limiting Documentation
- [ ] Per-role limits:
  - Residents: 100 requests/minute
  - Society Admins: 300 requests/minute
  - Vendors: 200 requests/minute
  - Platform Admins: 1000 requests/minute
- [ ] How to check remaining quota (response headers)
  - `X-RateLimit-Limit: 100`
  - `X-RateLimit-Remaining: 95`
  - `X-RateLimit-Reset: 1678886400`

### 8. API Versioning
- [ ] Version in URL: `/v1/societies`
- [ ] Document deprecation policy:
  - "v1 will be supported until Dec 2026"
  - "v2 introduces breaking changes: XYZ"
- [ ] Changelog for each version

### 9. Webhooks Documentation (Future)
- [ ] If webhooks are implemented (e.g., payment status updates):
  - Webhook events list
  - Payload structure
  - Signature verification
  - Retry logic

### 10. Code Examples (SDK Style)
For popular use cases, provide code snippets:

#### Login Example
```javascript
// JavaScript
const response = await fetch('https://api.platform.com/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepass'
  })
});
const data = await response.json();
console.log(data.token);
```

```python
# Python
import requests
response = requests.post('https://api.platform.com/v1/auth/login', json={
  'email': 'user@example.com',
  'password': 'securepass'
})
print(response.json()['token'])
```

```dart
// Dart (Flutter)
final response = await http.post(
  Uri.parse('https://api.platform.com/v1/auth/login'),
  body: json.encode({
    'email': 'user@example.com',
    'password': 'securepass'
  })
);
final data = json.decode(response.body);
print(data['token']);
```

### 11. Postman Collection
- [ ] Export Postman collection for all API endpoints
- [ ] Pre-configured environment variables
- [ ] Example requests for each endpoint
- [ ] Downloadable from docs portal

### 12. API Status Page
- [ ] Real-time API status:
  - All systems operational ✅
  - Degraded performance ⚠️
  - Outage 🔴
- [ ] Uptime statistics (last 30 days)
- [ ] Subscribe to status updates (email/SMS)

### 13. Changelog
- [ ] Maintain API changelog:
  - **v1.2.0 (2026-02-01)**
    - Added: `/payments/auto-debit/setup`
    - Fixed: `/ledger` pagination bug
    - Deprecated: `/services/old-endpoint`
  - **v1.1.0 (2026-01-15)**
    - Added: `/votes` module
    - Changed: `/residents` response structure

### 14. Developer Portal Landing Page
- [ ] Overview: What is this API?
- [ ] Getting started (5-minute quickstart)
- [ ] Authentication guide
- [ ] API reference (Swagger UI link)
- [ ] Code examples
- [ ] Postman collection download
- [ ] FAQ
- [ ] Support (email/Slack channel)

### 15. Security Best Practices
- [ ] Document security recommendations:
  - Never expose JWT tokens in URLs
  - Use HTTPS always
  - Rotate tokens regularly
  - Validate input on client-side (but trust server validation)
  - Handle errors gracefully (don't expose stack traces)

### 16. Mobile App Readiness Notes
- [ ] Document API patterns for mobile:
  - Pagination (use `limit` and `offset`)
  - Caching strategies (use `ETag` headers)
  - Offline-first considerations
  - Image optimization (thumbnails vs full-size)
  - Push notification registration endpoints

## Acceptance Criteria
- All API endpoints are documented with OpenAPI spec
- Swagger UI is live and interactive
- Authentication flow is clearly explained
- Code examples provided for common tasks
- Error handling is well-documented
- Rate limiting is explained
- Postman collection is available
- Developer portal is accessible and clear

## Dependencies
- All backend tasks (APIs must exist to document)

## Estimated Effort
5-7 days

## Tools & Libraries
- **OpenAPI/Swagger**: API spec standard
- **Swagger UI**: Interactive API explorer
- **Postman**: API testing and collection export
- **Docusaurus / VuePress**: Static site for developer portal (optional)

## Deployment
- [ ] Deploy Swagger UI at `/api-docs`
- [ ] Deploy developer portal at `/developers` (separate static site)
- [ ] Link from main app footer ("Developers")

## Maintenance
- [ ] Auto-update Swagger spec on every deploy (CI/CD integration)
- [ ] Review and update code examples quarterly
- [ ] Keep changelog updated
- [ ] Monitor API status page

## Future Enhancements
- GraphQL API (in addition to REST)
- API SDKs (JavaScript, Python, Dart)
- Sandbox environment (test API without affecting prod)
- API playground (interactive coding environment)
