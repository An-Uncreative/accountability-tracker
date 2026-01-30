# Breaking Changes - API v3 Migration

## Overview

This document describes the breaking changes made to the backend API to completely invalidate access from removed collaborators who may have cloned the repository.

## What Changed?

### 1. API Endpoint Versioning

**Old (v1):** `/api/auth`, `/api/wallets`, `/api/monitor`  
**Previous (v2):** `/api/v2/auth`, `/api/v2/wallets`, `/api/v2/monitor`  
**New (v3):** `/api/v3/auth`, `/api/v3/wallets`, `/api/v3/monitor`

All API endpoints now require the `/v3/` prefix. The old v1 and v2 endpoints will return 404 errors.

### 2. Environment Variable Names

**Original:** `JWT_SECRET`  
**Previous (v2):** `AUTH_SECRET_KEY`  
**New (v3):** `APP_TOKEN_SECRET`

The backend now uses `APP_TOKEN_SECRET` instead of `AUTH_SECRET_KEY` or `JWT_SECRET` for signing authentication tokens.

### 3. NEW: API Key Requirement

**New in v3:** All API requests now require an `X-API-Key` header.

The server validates this key against the `API_ACCESS_KEY` environment variable. Requests without a valid API key will receive a 401 or 403 error.

### 4. Health Check Endpoint

**Old:** `/api/health`  
**Previous (v2):** `/api/v2/health`  
**New (v3):** `/api/v3/health` (requires API key)

The health check endpoint has been moved and now requires the API key header.

## Why These Changes?

These changes ensure that:

1. **Old frontend code won't work** - Any cloned repositories with hardcoded `/api/` or `/api/v2/` endpoints will fail with 404 errors
2. **Old tokens are invalidated** - Changing the environment variable name means the secret will be different, invalidating all existing JWT tokens
3. **API key required** - Without the new `API_ACCESS_KEY`, no requests can be made, even if endpoints are guessed
4. **Deployment configuration breaks** - The removed collaborator's deployment configs will fail until updated with the new environment variable names

## Migration Guide for Legitimate Users

### For Backend Deployment

1. **Update Environment Variables**
   - Rename `AUTH_SECRET_KEY` to `APP_TOKEN_SECRET` in your `.env` file
   - Add new `API_ACCESS_KEY` variable
   - Generate NEW secret keys (do not reuse the old ones)
   - See `ENV_MIGRATION.md` for instructions on generating secure secrets

2. **Required Environment Variables (v3)**
   ```
   APP_TOKEN_SECRET=<your-new-token-secret>
   API_ACCESS_KEY=<your-new-api-key>
   MONGODB_URI=<your-mongodb-uri>
   ```

3. **Redeploy the Backend**
   - Push the updated code
   - Update environment variables in your hosting platform (Render, Heroku, etc.)

### For Frontend Integration

1. **Update API Base URL**
   - Change from `/api/v2` to `/api/v3`
   - If using a client library, update the base URL configuration

2. **Add API Key Header**
   - All requests must include `X-API-Key` header

3. **Example Changes**

   **Before (v2):**
   ```javascript
   const API_BASE_URL = '/api/v2';
   
   fetch(`${API_BASE_URL}/auth/login`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email, password })
   });
   ```

   **After (v3):**
   ```javascript
   const API_BASE_URL = '/api/v3';
   const API_KEY = process.env.VITE_API_KEY; // Store in environment
   
   fetch(`${API_BASE_URL}/auth/login`, {
     method: 'POST',
     headers: { 
       'Content-Type': 'application/json',
       'X-API-Key': API_KEY
     },
     body: JSON.stringify({ email, password })
   });
   ```

4. **Re-authenticate**
   - All users will need to log in again after deployment
   - Old JWT tokens will be invalid

## Testing Your Changes

Run the migration test to verify all changes are correct:

```bash
cd backend
node test-migration.js
```

This will verify:
- ✓ All routes use the v3 prefix
- ✓ APP_TOKEN_SECRET is used instead of older variable names
- ✓ API_ACCESS_KEY validation is present
- ✓ Monitor URLs are updated

## Security Benefits

These changes provide several security benefits:

1. **Immediate Access Revocation** - Old cloned code cannot access the API
2. **Token Invalidation** - All existing authentication tokens are invalidated
3. **API Key Protection** - Without the API key, the backend is inaccessible
4. **Configuration Break** - Deployment configurations need updating with new variable names
5. **No Data Exposure** - The removed collaborator cannot use their cloned code to access backend data

## Rollback (Not Recommended)

If you need to rollback these changes:

1. Revert commits changing `/api/v3/` back to `/api/v2/`
2. Change `APP_TOKEN_SECRET` back to `AUTH_SECRET_KEY`
3. Remove API key requirement
4. Use the old secret value

**Warning:** Rolling back will re-enable access for the removed collaborator.

## Questions?

Refer to:
- `API_DOCS.md` - Updated API documentation
- `ENV_MIGRATION.md` - Environment variable migration guide
