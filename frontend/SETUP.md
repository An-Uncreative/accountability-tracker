# Frontend Configuration Guide

## Environment Variables

The frontend uses environment variables to configure the API endpoint.

### Development

For local development, leave `.env` empty or don't create it. The Vite proxy will automatically forward `/api/v2` requests to `http://localhost:5000`.

Make sure your backend is running:

```bash
cd ../backend
npm run dev
```

Then start the frontend:

```bash
npm run dev
```

### Production

Set the `VITE_API_URL` environment variable to your deployed backend URL:

```env
VITE_API_URL=https://your-backend.onrender.com/api/v2
```

**Important:** The URL must include `/api/v2` at the end (API v2 endpoints).

## Setup Instructions

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create .env file (optional for local dev):**

   ```bash
   cp .env.example .env
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**

   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## API v2 Migration

This frontend has been updated to work with API v2. Key changes:

- All endpoints now use `/api/v2` prefix
- Updated Vite proxy configuration
- Environment variable points to v2 endpoints

### Old vs New Endpoints

| Old (v1)          | New (v2)             |
| ----------------- | -------------------- |
| `/api/auth/login` | `/api/v2/auth/login` |
| `/api/wallets`    | `/api/v2/wallets`    |
| `/api/monitor/*`  | `/api/v2/monitor/*`  |

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set root directory to `accountability-tracker/frontend`
3. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com/api/v2`
4. Deploy

### Netlify

1. Connect your GitHub repository
2. Set build directory to `accountability-tracker/frontend`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable `VITE_API_URL`

### Manual Build

```bash
npm run build
# Files will be in dist/ folder
# Upload to any static hosting service
```

## Troubleshooting

### CORS Errors

If you see CORS errors in production:

- Ensure backend's `FRONTEND_URL` environment variable includes your frontend domain
- Check that backend CORS configuration allows your frontend origin

### API Connection Issues

1. Verify `VITE_API_URL` is set correctly
2. Test backend health endpoint: `https://your-backend.com/api/v2/health`
3. Check browser network tab for actual URL being called
4. Ensure backend is deployed and running

### 404 Errors on API Calls

- Confirm you're using `/api/v2` endpoints (not `/api`)
- Check backend logs for routing issues
- Verify backend environment variables are set

## Features

- ✅ User authentication (register/login)
- ✅ Wallet management
- ✅ Transaction tracking (inflows/outflows)
- ✅ Shareable monitor links (read-only access)
- ✅ Real-time balance updates
- ✅ Responsive design

## Tech Stack

- React 19
- Vite 7
- React Router v7
- Axios for API calls
- CSS for styling
