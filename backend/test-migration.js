#!/usr/bin/env node

/**
 * Test script to verify API v2 migration
 * This ensures old v1 endpoints are removed and v2 endpoints exist
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Testing API Version Migration...\n');

console.log('✓ Code Structure Check:');

// Check that routes use v2
const serverFile = readFileSync(join(__dirname, 'src', 'server.js'), 'utf-8');
const authFile = readFileSync(join(__dirname, 'src', 'routes', 'auth.js'), 'utf-8');
const authMiddleware = readFileSync(join(__dirname, 'src', 'middleware', 'auth.js'), 'utf-8');
const monitorFile = readFileSync(join(__dirname, 'src', 'routes', 'monitor.js'), 'utf-8');

// Verify v2 routes in server.js
if (serverFile.includes('/api/v2/auth') && 
    serverFile.includes('/api/v2/wallets') && 
    serverFile.includes('/api/v2/monitor')) {
  console.log('  ✓ Server.js uses /api/v2/ routes');
} else {
  console.error('  ✗ Server.js does not use v2 routes');
  process.exit(1);
}

// Verify old v1 routes are NOT present
if (!serverFile.match(/["']\/api\/auth["']/) && 
    !serverFile.match(/["']\/api\/wallets["']/) && 
    !serverFile.match(/["']\/api\/monitor["']/)) {
  console.log('  ✓ Old /api/v1 routes removed from server.js');
} else {
  console.error('  ✗ Old v1 routes still present in server.js');
  process.exit(1);
}

// Verify AUTH_SECRET_KEY in auth.js
if (authFile.includes('AUTH_SECRET_KEY') && !authFile.includes('JWT_SECRET')) {
  console.log('  ✓ Auth routes use AUTH_SECRET_KEY');
} else {
  console.error('  ✗ Auth routes still use JWT_SECRET or missing AUTH_SECRET_KEY');
  process.exit(1);
}

// Verify AUTH_SECRET_KEY in middleware
if (authMiddleware.includes('AUTH_SECRET_KEY') && !authMiddleware.includes('JWT_SECRET')) {
  console.log('  ✓ Auth middleware uses AUTH_SECRET_KEY');
} else {
  console.error('  ✗ Auth middleware still use JWT_SECRET or missing AUTH_SECRET_KEY');
  process.exit(1);
}

// Verify monitor URLs use v2
if (monitorFile.includes('/api/v2/monitor/') && !monitorFile.match(/\/api\/monitor\/[^v]/)) {
  console.log('  ✓ Monitor routes generate v2 URLs');
} else {
  console.error('  ✗ Monitor routes still generate old URLs');
  process.exit(1);
}

console.log('\n✅ All checks passed!');
console.log('\n📋 Summary of Changes:');
console.log('  • API routes changed from /api/* to /api/v2/*');
console.log('  • Environment variable JWT_SECRET → AUTH_SECRET_KEY');
console.log('  • Old v1 endpoints will return 404');
console.log('  • Frontend must be updated to use /api/v2/ prefix');
console.log('  • Monitor URLs now use /api/v2/monitor/ prefix');
console.log('\n⚠️  IMPORTANT: Update your .env file with AUTH_SECRET_KEY before deploying!');
console.log('  See ENV_MIGRATION.md for details on updating environment variables.');
