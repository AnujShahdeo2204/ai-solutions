# Order Analytics Dashboard - Backend

This is the backend service for the Order Analytics Dashboard exercise. It is built using Node.js and Express.

## Prerequisites

- Node.js installed on your machine

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server

Start the server in development mode (with nodemon):
```bash
npm run dev
```

Start the server in production mode:
```bash
npm start
```

## Endpoints

### Health Check

Test if the server is running:

**GET /api/health**
```json
{
  "success": true,
  "message": "Order Analytics API is running"
}
```
