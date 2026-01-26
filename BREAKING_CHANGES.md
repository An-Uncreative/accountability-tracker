# Breaking Changes - API v2 Migration

## Overview

This document describes the breaking changes made to the backend API to invalidate access from removed collaborators who may have cloned the repository.

## What Changed?

### 1. API Endpoint Versioning

**Old (v1):** `/api/auth`, `/api/wallets`, `/api/monitor`  
**New (v2):** `/api/v2/auth`, `/api/v2/wallets`, `/api/v2/monitor`

All API endpoints now require the `/v2/` prefix. The old v1 endpoints will return 404 errors.

### 2. Environment Variable Names

**Old:** `JWT_SECRET`  
**New:** `AUTH_SECRET_KEY`

The backend now uses `AUTH_SECRET_KEY` instead of `JWT_SECRET` for signing authentication tokens.

### 3. Health Check Endpoint

**Old:** `/api/health`  
**New:** `/api/v2/health`

The health check endpoint has been moved and now includes a version field in the response.

## Why These Changes?

These changes ensure that:

1. **Old frontend code won't work** - Any cloned repositories with hardcoded `/api/` endpoints will fail with 404 errors
2. **Old tokens are invalidated** - Changing the environment variable name means the secret will be different, invalidating all existing JWT tokens
3. **Deployment configuration breaks** - The removed collaborator's deployment configs will fail until updated with the new environment variable names

## Migration Guide for Legitimate Users

### For Backend Deployment

1. **Update Environment Variables**
   - Rename `JWT_SECRET` to `AUTH_SECRET_KEY` in your `.env` file
   - Generate a NEW secret key (do not reuse the old one)
   - See `ENV_MIGRATION.md` for instructions on generating a secure secret

2. **Redeploy the Backend**
   - Push the updated code
   - Update environment variables in your hosting platform (Render, Heroku, etc.)

### For Frontend Integration

1. **Update API Base URL**
   - Change from `/api` to `/api/v2`
   - If using a client library, update the base URL configuration

2. **Example Changes**

   **Before:**
   ```javascript
   const API_BASE_URL = '/api';
   ```

   **After:**
   ```javascript
   const API_BASE_URL = '/api/v2';
   ```

3. **Re-authenticate**
   - All users will need to log in again after deployment
   - Old JWT tokens will be invalid

## Testing Your Changes

Run the migration test to verify all changes are correct:

```bash
cd backend
node test-migration.js
```

This will verify:
- ✓ All routes use the v2 prefix
- ✓ AUTH_SECRET_KEY is used instead of JWT_SECRET
- ✓ Monitor URLs are updated

## Security Benefits

These changes provide several security benefits:

1. **Immediate Access Revocation** - Old cloned code cannot access the API
2. **Token Invalidation** - All existing authentication tokens are invalidated
3. **Configuration Break** - Deployment configurations need updating with new variable names
4. **No Data Exposure** - The removed collaborator cannot use their cloned code to access backend data

## Rollback (Not Recommended)

If you need to rollback these changes:

1. Revert commits changing `/api/v2/` back to `/api/`
2. Change `AUTH_SECRET_KEY` back to `JWT_SECRET`
3. Use the old secret value

**Warning:** Rolling back will re-enable access for the removed collaborator.

## Questions?

Refer to:
- `API_DOCS.md` - Updated API documentation
- `ENV_MIGRATION.md` - Environment variable migration guide
