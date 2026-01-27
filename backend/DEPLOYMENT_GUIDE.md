# Backend Deployment Guide

## Issues Fixed ✅

1. **Environment Variable Validation** - Server now checks for required variables on startup
2. **Weak Secret Key Prevention** - Blocks production deployment with weak secrets
3. **Mongoose Schema Errors** - Fixed `index: false` + `unique: true` conflicts in User and MonitorLink models
4. **Production CORS Configuration** - Now supports restricted origins via `FRONTEND_URL`
5. **Server Binding** - Now binds to `0.0.0.0` for cloud platform compatibility
6. **Environment-aware Logging** - Shows development/production mode on startup

## Required Environment Variables

```env
AUTH_SECRET_KEY=<128-character-random-hex-string>
MONGODB_URI=<your-mongodb-connection-string>
PORT=5000
NODE_ENV=production
FRONTEND_URL=<your-frontend-url>
```

## Deployment Steps

### Option 1: Render.com (Recommended - Free Tier Available)

1. **Push your code to GitHub** (without .env file - already gitignored)

2. **Create New Web Service** on Render:
   - Connect your GitHub repository
   - Select `accountability-tracker/backend` as root directory
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Set Environment Variables** in Render Dashboard:

   ```
   AUTH_SECRET_KEY=<generate-new-secret>
   MONGODB_URI=<your-mongodb-uri>
   NODE_ENV=production
   FRONTEND_URL=<your-frontend-url>
   ```

4. **Generate Strong Secret**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

### Option 2: Railway.app

1. **Connect GitHub repo** to Railway

2. **Set Root Directory**: `accountability-tracker/backend`

3. **Environment Variables**:
   - Add all required variables from `.env.example`
   - Railway auto-generates PORT

4. **Deploy**: Railway auto-deploys on push

### Option 3: Vercel (Serverless)

1. **Install Vercel CLI**: `npm i -g vercel`

2. **Create `vercel.json`** in backend folder:

   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "src/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "src/server.js"
       }
     ]
   }
   ```

3. **Deploy**:

   ```bash
   cd backend
   vercel --prod
   ```

4. **Set Environment Variables** via Vercel Dashboard

### Option 4: Heroku

1. **Create Heroku App**:

   ```bash
   heroku create your-app-name
   ```

2. **Set Environment Variables**:

   ```bash
   heroku config:set AUTH_SECRET_KEY=<your-secret>
   heroku config:set MONGODB_URI=<your-uri>
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=<your-frontend-url>
   ```

3. **Deploy**:
   ```bash
   git push heroku main
   ```

## Post-Deployment Checklist

- [ ] Verify health check: `https://your-domain.com/api/v2/health`
- [ ] Test user registration: `POST /api/v2/auth/register`
- [ ] Test user login: `POST /api/v2/auth/login`
- [ ] Check MongoDB connection in logs
- [ ] Verify CORS allows frontend domain
- [ ] Update frontend `API_BASE_URL` to point to deployed backend

## Security Recommendations

1. **Never commit `.env` file** (already in .gitignore ✅)
2. **Rotate MongoDB credentials** if exposed previously
3. **Use different secrets** for dev/staging/production
4. **Monitor rate limiting** (consider adding express-rate-limit)
5. **Enable MongoDB Atlas IP whitelist** for production

## Troubleshooting

### Server won't start

- Check environment variables are set
- Verify `AUTH_SECRET_KEY` is at least 32 characters
- Ensure `MONGODB_URI` is correct

### CORS errors

- Add frontend URL to `FRONTEND_URL` env variable
- Separate multiple URLs with commas

### MongoDB connection fails

- Check IP whitelist in MongoDB Atlas
- Verify connection string includes credentials
- Check network access in Atlas dashboard

## API Documentation

See [API_DOCS.md](./API_DOCS.md) for full API reference.

Base URL structure: `https://your-domain.com/api/v2`

## Support

- [Backend API Docs](./API_DOCS.md)
- [Environment Migration](./ENV_MIGRATION.md)
- [Breaking Changes](../BREAKING_CHANGES.md)
