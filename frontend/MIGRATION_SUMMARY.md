# Frontend Migration Summary

## ✅ Changes Applied

### 1. **API Endpoint Updates**

- Updated [client.js](src/api/client.js) to use `/api/v2` as default base URL
- Changed from `/api` → `/api/v2`

### 2. **Vite Configuration**

- Updated [vite.config.js](vite.config.js) proxy to forward `/api/v2` to backend
- Ensures local development works seamlessly

### 3. **Environment Configuration**

- Updated [.env](.env) with production API URL pointing to `/api/v2`
- Created [.env.example](.env.example) template for reference

### 4. **Documentation**

- Created [SETUP.md](SETUP.md) with comprehensive setup and deployment instructions
- Includes troubleshooting guide and API v2 migration notes

## Testing Checklist

### Local Development (Both Backend & Frontend Running)

1. **Start Backend** (Terminal 1):

   ```bash
   cd accountability-tracker/backend
   npm run dev
   ```

   ✅ Verify: Server running on http://localhost:5000

2. **Start Frontend** (Terminal 2):

   ```bash
   cd accountability-tracker/frontend
   npm run dev
   ```

   ✅ Verify: Vite running on http://localhost:5173

3. **Test User Registration**:
   - Go to http://localhost:5173/register
   - Create a new account
   - ✅ Should receive token and redirect to dashboard

4. **Test Wallet Creation**:
   - Click "Create Wallet"
   - Add a wallet with initial balance
   - ✅ Should see new wallet in dashboard

5. **Test Transactions**:
   - Click wallet to view details
   - Add inflow/outflow transactions
   - ✅ Balance should update correctly

6. **Test Monitor Links**:
   - Generate a monitor link
   - Copy and open in incognito window
   - ✅ Should see read-only view of wallet

### Production Deployment

#### Backend (Already Deployed on Render)

Status: ⚠️ **Needs environment variables**

Required actions:

1. Go to Render Dashboard → Your Service → Environment
2. Add variables:
   ```
   AUTH_SECRET_KEY=<your-generated-secret>
   MONGODB_URI=<your-mongodb-uri>
   NODE_ENV=production
   FRONTEND_URL=<your-frontend-url-once-deployed>
   ```
3. Wait for automatic redeploy
4. Test health endpoint: `https://your-backend.onrender.com/api/v2/health`

#### Frontend (Next Step)

Choose one deployment platform:

**Option A: Vercel** (Recommended - Zero Config)

1. Connect GitHub repo
2. Root directory: `accountability-tracker/frontend`
3. Environment variable:
   ```
   VITE_API_URL=https://accountability-tracker-lps3.onrender.com/api/v2
   ```
4. Deploy

**Option B: Netlify**

1. New site from Git
2. Base directory: `accountability-tracker/frontend`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Environment: `VITE_API_URL=https://accountability-tracker-lps3.onrender.com/api/v2`

**Option C: Render Static Site**

1. New Static Site
2. Root directory: `accountability-tracker/frontend`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Environment: `VITE_API_URL=https://accountability-tracker-lps3.onrender.com/api/v2`

## Known Issues & Fixes

### ✅ FIXED: API v1 → v2 Migration

- **Issue**: Frontend was using `/api/*` endpoints
- **Fix**: Updated to `/api/v2/*` in all configurations

### ✅ FIXED: Vite Proxy Configuration

- **Issue**: Proxy only handled `/api` routes
- **Fix**: Changed to `/api/v2` proxy

### ✅ FIXED: Production Environment Variables

- **Issue**: No example template for environment setup
- **Fix**: Created `.env.example` with clear documentation

## Post-Deployment Verification

Once both frontend and backend are deployed:

1. **Test Registration Flow**:

   ```
   POST https://your-backend/api/v2/auth/register
   ```

2. **Test CORS**:
   - Open frontend in browser
   - Open DevTools → Network tab
   - Attempt login
   - ✅ No CORS errors should appear

3. **Update Backend CORS**:
   - Add frontend URL to backend's `FRONTEND_URL` env variable:

   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```

4. **End-to-End Test**:
   - Register → Create Wallet → Add Transaction → Generate Monitor Link
   - ✅ All features should work

## Quick Commands

```bash
# Install dependencies
cd frontend && npm install

# Local development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Environment Variables Reference

| Variable       | Required | Description     | Example                      |
| -------------- | -------- | --------------- | ---------------------------- |
| `VITE_API_URL` | No\*     | Backend API URL | `https://backend.com/api/v2` |

\*Not required for local dev (uses Vite proxy)

## Support

- Frontend Setup: [SETUP.md](SETUP.md)
- Backend Deployment: [../backend/DEPLOYMENT_GUIDE.md](../backend/DEPLOYMENT_GUIDE.md)
- API Documentation: [../backend/API_DOCS.md](../backend/API_DOCS.md)
- Migration Guide: [../BREAKING_CHANGES.md](../BREAKING_CHANGES.md)
