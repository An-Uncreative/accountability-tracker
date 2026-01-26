# Environment Variable Migration Guide

## Breaking Changes in API v2

The backend now uses updated environment variable names. You must update your `.env` file to use the new variable names.

### Required Changes

**Old Variable Name** → **New Variable Name**
- `JWT_SECRET` → `AUTH_SECRET_KEY`

### Example .env File

```env
# Database connection
MONGODB_URI=mongodb://localhost:27017/accountability-tracker

# Authentication secret (REQUIRED - generate a new strong secret)
AUTH_SECRET_KEY=your-new-secure-random-string-here

# Server port (optional, defaults to 5000)
PORT=5000
```

### Generating a New Secret

For security, generate a NEW random secret key. Do not reuse the old JWT_SECRET value.

You can generate a secure random string using:

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64

# Python
python -c "import secrets; print(secrets.token_hex(64))"
```

### Important Security Note

⚠️ **Changing the secret key will invalidate all existing JWT tokens.** This is intentional and necessary to revoke access from the removed collaborator.

All users (including you) will need to log in again after this change.
