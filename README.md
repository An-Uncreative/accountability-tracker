# Accountability Tracker

A hackathon project for tracking financial accountability with wallet management and monitoring features.

## ⚠️ Important: API v3 Migration

**If you're seeing this after January 2026, the API has been migrated to v3.**

### What Changed?

The backend API has undergone breaking changes to enhance security:

- **API Endpoints**: Changed from `/api/v2/*` to `/api/v3/*`
- **Environment Variables**: `AUTH_SECRET_KEY` renamed to `APP_TOKEN_SECRET`
- **NEW: API Key Required**: All requests must include `X-API-Key` header
- **All tokens invalidated**: Users must re-authenticate

### Migration Required

**For Backend Deployment:**

1. Read `backend/ENV_MIGRATION.md` for environment variable updates
2. Generate a NEW `APP_TOKEN_SECRET` (don't reuse old secret)
3. Generate a NEW `API_ACCESS_KEY` for API protection
4. Update your hosting platform's environment variables

**For Frontend Integration:**

1. Update API base URL from `/api/v2` to `/api/v3`
2. Add `X-API-Key` header to all API requests
3. See `BREAKING_CHANGES.md` for detailed instructions

### Documentation

- **[BREAKING_CHANGES.md](./BREAKING_CHANGES.md)** - Complete migration guide
- **[SECURITY_SUMMARY.md](./SECURITY_SUMMARY.md)** - Security analysis and recommendations
- **[backend/ENV_MIGRATION.md](./backend/ENV_MIGRATION.md)** - Environment variable migration
- **[backend/API_DOCS.md](./backend/API_DOCS.md)** - Updated API documentation

## Project Structure

```
├── backend/          # Node.js/Express backend (API v3)
├── frontend/         # React frontend
└── trustify-frontend/# Alternative frontend implementation
```

## Quick Start

### Backend

```bash
cd backend
npm install

# Create .env file with required variables
# See backend/ENV_MIGRATION.md for details
npm run dev
```

**Important**: Set environment variables before starting:

- `APP_TOKEN_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- `API_ACCESS_KEY` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `MONGODB_URI` - Your MongoDB connection string
- See [backend/DEPLOYMENT_GUIDE.md](backend/DEPLOYMENT_GUIDE.md) for full setup

### Frontend

```bash
cd frontend
npm install

# For local development (no .env needed - uses Vite proxy)
npm run dev
```

**For production**: 
- Set `VITE_API_URL` to your deployed backend URL with `/api/v3` suffix
- Set `VITE_API_KEY` to your `API_ACCESS_KEY` value

- See [frontend/SETUP.md](frontend/SETUP.md) for deployment instructions

## Testing Migration

To verify the API v3 migration:

```bash
cd backend
node test-migration.js
```

## Contributing

This project was developed during a hackathon. For security reasons, collaborator access has been restricted.

## License

ISC
