# Environment Variable Migration Guide

## Breaking Changes in API v3

The backend now uses updated environment variable names and requires an additional API key. You must update your `.env` file to use the new variable names.

### Required Changes

**v1 → v2 → v3 Variable Name Changes**
- `JWT_SECRET` → `AUTH_SECRET_KEY` → `APP_TOKEN_SECRET`

**New in v3**
- `API_ACCESS_KEY` - Required API key for all requests

### Example .env File

```env
# Database connection
MONGODB_URI=mongodb://localhost:27017/accountability-tracker

# Authentication secret (REQUIRED - generate a new strong secret)
APP_TOKEN_SECRET=your-new-secure-random-string-here

# API Access Key (REQUIRED - generate a new strong key)
API_ACCESS_KEY=your-api-access-key-here

# Server port (optional, defaults to 5000)
PORT=5000

# Frontend URL(s) for CORS (comma-separated, optional)
FRONTEND_URL=https://your-frontend.com
```

### Generating New Secrets

For security, generate NEW random secrets. Do not reuse the old values.

You can generate secure random strings using:

```bash
# Node.js (for APP_TOKEN_SECRET - 64 bytes)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Node.js (for API_ACCESS_KEY - 32 bytes)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 64  # For APP_TOKEN_SECRET
openssl rand -hex 32  # For API_ACCESS_KEY

# Python
python -c "import secrets; print(secrets.token_hex(64))"  # For APP_TOKEN_SECRET
python -c "import secrets; print(secrets.token_hex(32))"  # For API_ACCESS_KEY
```

### API Key Usage

All API requests must include the `X-API-Key` header:

```javascript
// Example fetch request
fetch('/api/v3/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-access-key-here'
  },
  body: JSON.stringify({ email, password })
});
```

Without a valid API key, all requests will receive a 401 or 403 error.

### Important Security Note

⚠️ **Changing the secret key will invalidate all existing JWT tokens.** This is intentional and necessary to revoke access from the removed collaborator.

⚠️ **Without the API key, no one can access the backend.** Make sure to securely share the API key with legitimate frontend deployments.

All users (including you) will need to log in again after this change.
