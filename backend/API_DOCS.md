# Accountability Wallet API Documentation

**Base URL:** `https://accountability-tracker-lps3.onrender.com/api/v3`

**API Version:** 3.0

⚠️ **Important:** Free tier sleeps after 15 minutes of inactivity. First request may take 30 seconds to wake up.

⚠️ **Breaking Change:** API v1 and v2 endpoints have been deprecated. All clients must update to use `/api/v3/` prefix and include the required `X-API-Key` header.

---

## Authentication

### API Key (Required for ALL requests)

All API requests require the `X-API-Key` header:

```
X-API-Key: <your_api_access_key>
```

Requests without a valid API key will receive a 401 or 403 error.

### JWT Token (Required for authenticated endpoints)

Admin endpoints additionally require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Get token from `/auth/register` or `/auth/login` endpoints.

---

## API Endpoints

### 🔐 Authentication Routes

#### Register New Admin
```http
POST /api/v3/auth/register
X-API-Key: <api_key>
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "createdAt": "2025-01-18T..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /api/v3/auth/login
X-API-Key: <api_key>
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securepassword123"
}
```

**Response:** Same as register

#### Verify Token
```http
GET /api/v3/auth/verify
X-API-Key: <api_key>
Authorization: Bearer <token>
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com"
  }
}
```

---

### 💰 Wallet Routes (All require API key + JWT authentication)

#### Get All Wallets
```http
GET /api/v3/wallets
X-API-Key: <api_key>
Authorization: Bearer <token>
```

**Response:**
```json
{
  "wallets": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Savings Account",
      "currentBalance": 5000,
      "createdAt": "2025-01-18T..."
    }
  ]
}
```

#### Create New Wallet
```http
POST /api/v3/wallets
X-API-Key: <api_key>
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Emergency Fund",
  "initialBalance": 1000
}
```

**Response:**
```json
{
  "message": "Wallet created successfully",
  "wallet": {
    "_id": "507f1f77bcf86cd799439011",
    "adminId": "507f191e810c19729de860ea",
    "name": "Emergency Fund",
    "currentBalance": 1000,
    "createdAt": "2025-01-18T..."
  }
}
```

#### Get Single Wallet
```http
GET /api/v3/wallets/:id
X-API-Key: <api_key>
Authorization: Bearer <token>
```

#### Add Inflow (Deposit Money)
```http
POST /api/v3/wallets/:id/inflow
X-API-Key: <api_key>
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500,
  "description": "Salary payment"
}
```

**Response:**
```json
{
  "message": "Inflow added successfully",
  "transaction": {
    "_id": "...",
    "type": "inflow",
    "amount": 500,
    "balanceAfter": 1500,
    "description": "Salary payment",
    "createdAt": "..."
  },
  "newBalance": 1500
}
```

#### Add Outflow (Withdraw Money)
```http
POST /api/v3/wallets/:id/outflow
X-API-Key: <api_key>
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 200,
  "description": "Groceries"
}
```

**Response:** Same format as inflow

**Error if insufficient balance:**
```json
{
  "error": "Insufficient balance"
}
```

#### Get Transaction History
```http
GET /api/v3/wallets/:id/transactions
X-API-Key: <api_key>
Authorization: Bearer <token>
```

**Response:**
```json
{
  "transactions": [
    {
      "_id": "...",
      "type": "outflow",
      "amount": 200,
      "balanceAfter": 1300,
      "description": "Groceries",
      "createdAt": "2025-01-18T14:30:00.000Z"
    },
    {
      "_id": "...",
      "type": "inflow",
      "amount": 500,
      "balanceAfter": 1500,
      "description": "Salary payment",
      "createdAt": "2025-01-18T14:00:00.000Z"
    }
  ]
}
```

#### Delete Wallet
```http
DELETE /api/v3/wallets/:id
X-API-Key: <api_key>
Authorization: Bearer <token>
```

---

### 👁️ Monitor Routes

#### Generate Monitor Link (Admin Only)
```http
POST /api/v3/monitor/generate/:walletId
X-API-Key: <api_key>
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Monitor link created successfully",
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "monitorUrl": "https://accountability-tracker-lps3.onrender.com/api/v3/monitor/550e8400-e29b-41d4-a716-446655440000",
  "wallet": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Emergency Fund"
  }
}
```

Share the `monitorUrl` with people you want to give read-only access to!

#### Get All Monitor Links (Admin Only)
```http
GET /api/v3/monitor/links
X-API-Key: <api_key>
Authorization: Bearer <token>
```

**Response:**
```json
{
  "links": [
    {
      "id": "...",
      "token": "550e8400-e29b-41d4-a716-446655440000",
      "walletId": "507f1f77bcf86cd799439011",
      "walletName": "Emergency Fund",
      "monitorUrl": "https://accountability-tracker-lps3.onrender.com/api/v3/monitor/550e8400-...",
      "createdAt": "2025-01-18T..."
    }
  ]
}
```

#### Delete Monitor Link (Admin Only)
```http
DELETE /api/v3/monitor/links/:token
X-API-Key: <api_key>
Authorization: Bearer <token>
```

Revokes access for monitors using that link.

#### View Wallet (Requires API Key Only)
```http
GET /api/v3/monitor/:token
X-API-Key: <api_key>
```

**Response:**
```json
{
  "wallet": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Emergency Fund",
    "currentBalance": 1300,
    "createdAt": "2025-01-18T..."
  },
  "linkCreatedAt": "2025-01-18T15:00:00.000Z",
  "accessType": "read-only"
}
```

#### View Transactions (Requires API Key Only)
```http
GET /api/v3/monitor/:token/transactions
X-API-Key: <api_key>
```

**Response:**
```json
{
  "transactions": [...],
  "accessType": "read-only"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email and password required"
}
```

### 401 Unauthorized (Missing API Key or Token)
```json
{
  "error": "API key required",
  "message": "Include X-API-Key header with your request"
}
```

or

```json
{
  "error": "Access token required"
}
```

### 403 Forbidden (Invalid API Key or Token)
```json
{
  "error": "Invalid API key",
  "message": "The provided API key is not valid"
}
```

or

```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Wallet not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Frontend Integration Tips

### 1. Store API Key Securely
Store the API key in environment variables (NOT in source code):
```javascript
const API_KEY = process.env.VITE_API_KEY; // or import.meta.env.VITE_API_KEY
```

### 2. Store JWT Token
After login/register, store the token in localStorage:
```javascript
localStorage.setItem('token', response.token);
```

### 3. Add Headers to All Requests
```javascript
const API_KEY = import.meta.env.VITE_API_KEY;
const token = localStorage.getItem('token');

fetch('https://accountability-tracker-lps3.onrender.com/api/v3/wallets', {
  headers: {
    'X-API-Key': API_KEY,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

### 4. Handle Free Tier Sleep
Show a loading indicator for the first request:
```javascript
// First request after sleep might take 30 seconds
const response = await fetch(apiUrl);
```

### 5. Monitor Links Require API Key
Monitor links require the API key but NOT JWT authentication - share the API key with legitimate monitor frontends only!

---

## Example Frontend Flow

1. **Admin registers** → Get token
2. **Admin creates wallet** → Get wallet ID
3. **Admin adds inflow/outflow** → Transactions logged
4. **Admin generates monitor link** → Get shareable URL
5. **Admin shares URL** → Monitors can view (API key required, but no login needed)
6. **Monitors visit URL** → See wallet balance & transaction history (read-only)

---

## Questions?

Contact the backend developer or check the GitHub repo for more details.