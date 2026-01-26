# Accountability Tracker

A hackathon project for tracking financial accountability with wallet management and monitoring features.

## ⚠️ Important: API v2 Migration

**If you're seeing this after January 2026, the API has been migrated to v2.**

### What Changed?

The backend API has undergone breaking changes to enhance security:

- **API Endpoints**: Changed from `/api/*` to `/api/v2/*`
- **Environment Variables**: `JWT_SECRET` renamed to `AUTH_SECRET_KEY`
- **All tokens invalidated**: Users must re-authenticate

### Migration Required

**For Backend Deployment:**
1. Read `backend/ENV_MIGRATION.md` for environment variable updates
2. Generate a NEW `AUTH_SECRET_KEY` (don't reuse old secret)
3. Update your hosting platform's environment variables

**For Frontend Integration:**
1. Update API base URL from `/api` to `/api/v2`
2. See `BREAKING_CHANGES.md` for detailed instructions

### Documentation

- **[BREAKING_CHANGES.md](./BREAKING_CHANGES.md)** - Complete migration guide
- **[SECURITY_SUMMARY.md](./SECURITY_SUMMARY.md)** - Security analysis and recommendations
- **[backend/ENV_MIGRATION.md](./backend/ENV_MIGRATION.md)** - Environment variable migration
- **[backend/API_DOCS.md](./backend/API_DOCS.md)** - Updated API documentation

## Project Structure

```
├── backend/          # Node.js/Express backend (API v2)
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
echo "AUTH_SECRET_KEY=your-secret-here" > .env
echo "MONGODB_URI=your-mongodb-uri" >> .env

npm run dev
```

### Frontend

```bash
cd frontend
npm install

# Update API base URL to /api/v2 in your config
npm run dev
```

## Testing Migration

To verify the API v2 migration:

```bash
cd backend
node test-migration.js
```

## Contributing

This project was developed during a hackathon. For security reasons, collaborator access has been restricted.

## License

ISC
