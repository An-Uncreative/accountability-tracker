#!/usr/bin/env node

/**
 * Test script to verify API v3 migration
 * This ensures old v1/v2 endpoints are removed and v3 endpoints exist
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Testing API Version Migration (v3)...\n');

console.log('✓ Code Structure Check:');

// Check that routes use v3
const serverFile = readFileSync(join(__dirname, 'src', 'server.js'), 'utf-8');
const authFile = readFileSync(join(__dirname, 'src', 'routes', 'auth.js'), 'utf-8');
const authMiddleware = readFileSync(join(__dirname, 'src', 'middleware', 'auth.js'), 'utf-8');
const monitorFile = readFileSync(join(__dirname, 'src', 'routes', 'monitor.js'), 'utf-8');

// Verify v3 routes in server.js
if (serverFile.includes('/api/v3/auth') && 
    serverFile.includes('/api/v3/wallets') && 
    serverFile.includes('/api/v3/monitor')) {
  console.log('  ✓ Server.js uses /api/v3/ routes');
} else {
  console.error('  ✗ Server.js does not use v3 routes');
  process.exit(1);
}

// Verify old v1 and v2 routes are NOT present
if (!serverFile.match(/["']\/api\/auth["']/) && 
    !serverFile.match(/["']\/api\/wallets["']/) && 
    !serverFile.match(/["']\/api\/monitor["']/) &&
    !serverFile.match(/["']\/api\/v2\/auth["']/) && 
    !serverFile.match(/["']\/api\/v2\/wallets["']/) && 
    !serverFile.match(/["']\/api\/v2\/monitor["']/)) {
  console.log('  ✓ Old /api and /api/v2 routes removed from server.js');
} else {
  console.error('  ✗ Old /api or /api/v2 routes still present in server.js');
  process.exit(1);
}

// Verify APP_TOKEN_SECRET in auth.js
if (authFile.includes('APP_TOKEN_SECRET') && !authFile.includes('JWT_SECRET') && !authFile.includes('AUTH_SECRET_KEY')) {
  console.log('  ✓ Auth routes use APP_TOKEN_SECRET');
} else {
  console.error('  ✗ Auth routes still use old secret variable names');
  process.exit(1);
}

// Verify APP_TOKEN_SECRET in middleware
if (authMiddleware.includes('APP_TOKEN_SECRET') && !authMiddleware.includes('JWT_SECRET') && !authMiddleware.includes('AUTH_SECRET_KEY')) {
  console.log('  ✓ Auth middleware uses APP_TOKEN_SECRET');
} else {
  console.error('  ✗ Auth middleware still uses old secret variable names');
  process.exit(1);
}

// Verify monitor URLs use v3
if (monitorFile.includes('/api/v3/monitor/') && !monitorFile.includes('/api/monitor/') && !monitorFile.includes('/api/v2/monitor/')) {
  console.log('  ✓ Monitor routes generate v3 URLs');
} else {
  console.error('  ✗ Monitor routes still generate old URLs');
  process.exit(1);
}

// Verify API_ACCESS_KEY requirement
if (serverFile.includes('API_ACCESS_KEY') && serverFile.includes('x-api-key')) {
  console.log('  ✓ API key validation middleware present');
} else {
  console.error('  ✗ API key validation not found');
  process.exit(1);
}

console.log('\n✅ All checks passed!');
console.log('\n📋 Summary of Changes (v3):');
console.log('  • API routes changed from /api/v2/* to /api/v3/*');
console.log('  • Environment variable AUTH_SECRET_KEY → APP_TOKEN_SECRET');
console.log('  • NEW: API_ACCESS_KEY required for all requests');
console.log('  • All requests must include X-API-Key header');
console.log('  • Old v1 and v2 endpoints will return 404');
console.log('  • Frontend must be updated to use /api/v3/ prefix');
console.log('  • Frontend must include X-API-Key header in all requests');
console.log('  • Monitor URLs now use /api/v3/monitor/ prefix');
console.log('\n⚠️  IMPORTANT: Update your .env file with APP_TOKEN_SECRET and API_ACCESS_KEY before deploying!');
console.log('  See ENV_MIGRATION.md for details on updating environment variables.');
