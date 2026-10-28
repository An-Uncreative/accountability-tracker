# Funds Accountability Tracker

A personal portfolio project and **solo-built hackathon prototype** created during the **Team-Hera CWT Hackathon**.

## Project Overview

Funds Accountability Tracker is a mock full-stack application concept for transparent fund management. It demonstrates how a user can track incoming funds, record expenses, monitor balances, and provide controlled read-only visibility to trusted collaborators.

> **Status:** This repository is a prototype. The real-world/production application is still under development.

## What Was Built (Features)

- Account registration and login flows
- JWT-protected authenticated actions
- Fund/wallet creation and management
- Incoming fund and expense transaction recording
- Automatic balance updates and history tracking
- Read-only monitoring links for trusted collaborators
- API key + JWT request protection patterns

## Problem

Shared or purpose-based funds often lack clear, centralized tracking. This prototype explores a lightweight workflow for accountability by making fund activity visible, structured, and reviewable.

## Prototype Workflow

1. User signs up or logs in.
2. User creates a fund/wallet.
3. Incoming funds and expenses are recorded.
4. Balances update as transactions are saved.
5. User generates a read-only monitoring link.
6. Trusted collaborators can view balances and transaction history without edit access.

## Technology Used

### Frontend

- React
- React Router
- Axios
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt
- UUID
- dotenv

## What the Project Demonstrates

- End-to-end full-stack implementation of a finance-style workflow
- API design with authenticated and read-only access patterns
- Data modeling for funds, balances, and transactions
- Practical use of React + Express + MongoDB in a prototype product context

## Project Structure

```text
accountability-tracker/
├── backend/
│   ├── src/
│   ├── package.json
│   └── API_DOCS.md
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── BREAKING_CHANGES.md
├── DEPLOYMENT_STATUS.md
├── SECURITY_SUMMARY.md
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 18+
- npm
- MongoDB (local) or MongoDB Atlas

### 1) Clone

```bash
git clone https://github.com/An-Uncreative/accountability-tracker.git
cd accountability-tracker
```

### 2) Backend setup

```bash
cd backend
npm install
```

Create `/backend/.env`:

```env
PORT=5000
APP_TOKEN_SECRET=your_jwt_secret
API_ACCESS_KEY=your_api_access_key
MONGODB_URI=your_mongodb_connection_string
```

Run backend:

```bash
npm run dev
```

### 3) Frontend setup

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Create `/frontend/.env` for configured frontend environments:

```env
VITE_API_URL=your_backend_url/api/v3
VITE_API_KEY=your_api_access_key
```

## Available Scripts

### Frontend (`/frontend`)

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend (`/backend`)

```bash
npm run dev
npm start
```

## Documentation

- [`backend/API_DOCS.md`](./backend/API_DOCS.md)
- [`BREAKING_CHANGES.md`](./BREAKING_CHANGES.md)
- [`SECURITY_SUMMARY.md`](./SECURITY_SUMMARY.md)
- [`DEPLOYMENT_STATUS.md`](./DEPLOYMENT_STATUS.md)

## My Role

I independently designed and built this prototype during the Team-Hera CWT Hackathon, covering frontend development, backend API implementation, database integration, authentication, and read-only monitoring workflow design.

## Future Direction

The production application is still in development. Planned improvements include stronger production-grade security hardening, expanded validation/testing coverage, refined UX, and broader reporting/accountability capabilities.

## Prototype Disclaimer

This repository is a hackathon mock/prototype and is **not** production-ready. It should not be used to manage real funds, sensitive financial records, or mission-critical financial operations.

## License

ISC
