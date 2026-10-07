# 🚀 Order Analytics Dashboard - Backend API

A high-performance, modular **Node.js & Express REST API** and **ETL Ingestion Engine** built for multi-format e-commerce data processing, complex relational transformations, real-time currency conversion, and analytics aggregation.

![Node.js](https://img.shields.io/badge/Node.js-20%2B-green?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2-lightgrey?logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Better--SQLite3-blue?logo=sqlite&logoColor=white)
![Fast-XML-Parser](https://img.shields.io/badge/Parser-Fast--XML-orange)
![CSV-Parse](https://img.shields.io/badge/Parser-CSV--Parse-yellow)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Architectural Overview

The backend is structured into clear layers with **Separation of Concerns**:
- **Controllers** (`src/controllers/`) — HTTP request extraction, validation, and JSON response formatting.
- **Services** (`src/services/`) — Core business logic, parsing engines, transformations, joins, and currency conversions.
- **Database** (`src/db/`) — SQLite connection management, table schemas, and automated schema migrations.
- **Middleware** (`src/middleware/`) — Multer file upload handling and centralized error management.
- **Routes** (`src/routes/`) — REST route declarations.

```
backend/
├── data/
│   ├── Orders.json          # Baseline raw orders dataset
│   ├── Products.csv         # Baseline raw products catalog
│   ├── Shipment.xml         # Baseline raw shipments dataset
│   └── analytics.db         # Persistent SQLite relational database (WAL mode)
├── src/
│   ├── controllers/
│   │   ├── analytics.controller.js  # Analytics, charts, metrics controllers
│   │   └── ingest.controller.js     # Multi-format ingestion controllers
│   ├── db/
│   │   └── database.js              # SQLite schema & dynamic migrations
│   ├── middleware/
│   │   ├── error.middleware.js      # Global error handler
│   │   └── upload.middleware.js     # Multer multipart file upload middleware
│   ├── routes/
│   │   ├── analytics.routes.js      # Analytics endpoints
│   │   └── ingest.routes.js         # Ingestion endpoints
│   ├── services/
│   │   ├── analytics.service.js     # Metrics aggregation & SQL query builder
│   │   ├── csv.service.js           # CSV parsing & column normalization
│   │   ├── currency.service.js      # External Frankfurter currency API + caching
│   │   ├── json.service.js          # Nested JSON extraction & quote sanitation
│   │   ├── storage.service.js       # Transactional SQLite relational persistence
│   │   ├── transformation.service.js# Core multi-way join & delay calculation
│   │   └── xml.service.js           # XML parsing & array normalization
│   └── app.js                       # Express bootstrap, CORS & middleware
├── test-e2e.js                      # Automated End-to-End Test Suite
└── package.json
```

---

## 🗄️ Database Schema (SQLite Relational Model)

Data is normalized across 5 relational tables with indexing on frequently queried columns:

| Table | Primary Key | Foreign Keys | Description |
|---|---|---|---|
| `customers` | `id` | - | Customer identity and name |
| `products` | `product_id` | - | Catalog items, name, category, price, stock |
| `orders` | `order_id` | `customer_id` → `customers(id)` | Order headers, order dates, total and converted values |
| `shipments` | `shipment_id` | `order_id` → `orders(order_id)` | Delivery days, status, delay boolean flag |
| `order_items` | `id` (AUTOINCREMENT) | `order_id`, `product_id` | Line items with quantity, unit price, item value |

---

## 🔄 Core Transformation & Join Pipeline

1. **JSON Cleaning & Flattening**:
   - Resolves malformed quotation marks (e.g., `""orders""` from spreadsheet exports).
   - Flattens nested order line items while maintaining customer links.
2. **CSV Parsing**:
   - Strips BOM markers and outer quotation boundaries.
   - Normalizes varied header naming conventions (`ProductID` vs `product_id`).
3. **XML Parsing**:
   - Handles single `<shipment>` object vs `<shipment>` array discrepancies cleanly.
   - Normalizes status tags and validates integer delivery days.
4. **Relational Multi-Way Join**:
   - Performs $O(1)$ in-memory lookups joining Orders with Products and Shipments.
   - Calculates **Total Order Value** (`sum(qty * price)`).
   - Computes **Delivery Delay Flag**: evaluates `status = 'Delayed'` OR `delivery_days > 5`.
   - Ingests gracefully with fallback values when joins are incomplete (e.g. unknown customer or uncategorized product).
5. **Real-time Currency Conversion**:
   - Integrates with the public **Frankfurter API** (`https://api.frankfurter.app/`).
   - Caches rates with 1-hour TTL and provides realistic offline fallbacks.
   - Stores dual currency metrics (`total_order_value` in base currency and `total_order_value_converted` in EUR).

---

## 🛠️ API Reference

### Health & Status

#### `GET /api/health`
Returns server status and database table counts.
```json
{
  "success": true,
  "message": "Order Analytics API is running",
  "stats": {
    "orders": 41,
    "customers": 10,
    "products": 12,
    "shipments": 41,
    "orderItems": 82
  }
}
```

---

### Ingestion Endpoints

#### `POST /api/ingest/json`
Ingests orders. Supports multipart file upload (`file`), raw JSON payload, or defaults to stored `Orders.json`.

#### `POST /api/ingest/csv`
Ingests products catalog. Supports multipart file upload (`file`), raw CSV text, or defaults to stored `Products.csv`.

#### `POST /api/ingest/xml`
Ingests shipments. Supports multipart file upload (`file`), raw XML text, or defaults to stored `Shipment.xml`.

#### `POST /api/ingest/all`
Runs the complete multi-way join and normalization pipeline across all datasets.

#### `POST /api/ingest/seed`
Seeds a rich demonstration dataset (41+ realistic orders across 14 dates and 5 categories) for testing dashboards.

#### `GET /api/ingest/status`
Returns database record counts and table statistics.

---

### Analytics Endpoints

All analytics endpoints support dynamic filtering via query parameters:
- `startDate` (e.g. `2024-01-01`)
- `endDate` (e.g. `2024-01-14`)
- `category` (e.g. `Electronics`, `Furniture`)
- `deliveryStatus` (e.g. `Delivered`, `Delayed`)

#### `GET /api/analytics/summary`
Returns KPI metrics for dashboard cards.
```json
{
  "success": true,
  "data": {
    "totalOrders": 41,
    "totalRevenue": 1222150,
    "delayedOrders": 9,
    "deliveredOrders": 34,
    "averageOrderValue": 29808.54,
    "averageDeliveryDays": 3.9,
    "currencyRate": 0.0092,
    "targetCurrency": "EUR"
  }
}
```

#### `GET /api/analytics/revenue`
Returns daily revenue and order trends.
```json
{
  "success": true,
  "data": [
    { "date": "2024-01-01", "revenue": 142000, "orders": 3 },
    { "date": "2024-01-02", "revenue": 95000, "orders": 2 }
  ]
}
```

#### `GET /api/analytics/categories`
Returns category breakdown with revenue and order counts.

#### `GET /api/analytics/delivery`
Returns delivery distribution: `{ "delivered": 34, "delayed": 9, "unknown": 0 }`.

#### `GET /api/analytics/orders`
Returns list of customer orders with delivery status and amounts. Supports `search`, `limit`, and `offset`.

#### `GET /api/analytics/products`
Returns list of products in catalog with categories and stock.

---

### External API Integrations

#### `GET /api/analytics/currency?base=INR`
Fetches live exchange rates using the Frankfurter API with caching.

#### `GET /api/analytics/countries?region=Asia`
Fetches demographic and currency data from the **REST Countries API** (`https://restcountries.com/v3.1/all`) normalized into tabular format.

---

## 🚀 Getting Started

### 1. Installation
```bash
cd backend
npm install
```

### 2. Configure Environment (`.env`)
```env
PORT=5000
NODE_ENV=development
```

### 3. Run Server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```
The server will start at **http://localhost:5000**.

### 4. Run Automated E2E Tests
```bash
node test-e2e.js
```
Validates all 13 REST routes, ingestion pipelines, database integrity, and currency conversions.
