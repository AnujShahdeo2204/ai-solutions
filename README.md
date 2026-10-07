# ⚡ AI Solutions — Order Analytics Dashboard & Ingestion Pipeline

An end-to-end fullstack platform featuring a **modular Node.js/Express ETL API** and a **responsive React 19 / Vite analytics dashboard**. Built to ingest heterogeneous multi-format data (JSON, CSV, XML), perform relational dataset joins, derive complex metrics, convert currencies via live external APIs, and visualize real-time business intelligence.

---

## 🌟 Solution Architecture

```
                       ┌─────────────────────────┐
                       │   React 19 Dashboard    │
                       │   (Tailwind + Recharts) │
                       │    http://localhost:5173│
                       └────────────┬────────────┘
                                    │ REST API
                                    ▼
                       ┌─────────────────────────┐
                       │  Node.js / Express API  │
                       │    http://localhost:5000│
                       └────────────┬────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌───────────────┐           ┌───────────────┐           ┌─────────────────┐
│ Ingest Engine │           │  Data Joins   │           │  External APIs  │
│ ───────────── │           │  ───────────  │           │  ─────────────  │
│ • JSON Orders │           │ • Relational  │           │ • Frankfurter   │
│ • CSV Products│ ────────> │   O(1) Joins  │ ────────> │   Currency API  │
│ • XML Shipment│           │ • Delay Flags │           │ • REST Countries│
└───────────────┘           │ • Metrics     │           │   Demographics  │
                            └───────┬───────┘           └─────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   SQLite Database   │
                         │   (WAL Mode)        │
                         │   analytics.db      │
                         └─────────────────────┘
```

---

## 🎯 Requirements Met & Key Capabilities

| Requirement | Implementation Detail | Status |
|---|---|---|
| **1. API Development** | REST routes for `/api/ingest/json`, `/api/ingest/csv`, `/api/ingest/xml`, `/api/ingest/all`, and `/api/analytics/summary` | ✅ Completed |
| **2. Multi-Format Ingestion** | Custom sanitization for malformed quotes (`""orders""`), CSV BOM stripping, and XML parser with tag normalization | ✅ Completed |
| **3. Core Data Processing** | Flattens nested order line items, links customer references, and merges orders + products + shipments | ✅ Completed |
| **4. Inconsistencies & Errors** | Gracefully handles missing customers, uncategorized products, and type conversions | ✅ Completed |
| **5. Complex Transformations** | Derives **Total Order Value**, **Delivery Delay Flag** (`status='Delayed' \|\| days > 5`), and category revenue | ✅ Completed |
| **6. Currency Conversion** | Live exchange rates via Frankfurter API with TTL caching and realistic fallback rates | ✅ Completed |
| **7. Relational Persistence** | SQLite database with 5 normalized tables (`customers`, `products`, `orders`, `shipments`, `order_items`) | ✅ Completed |
| **8. React Dashboard UI** | KPI summary cards, area trend charts, category bar charts, delivery pie chart, and drilldown drawers | ✅ Completed |
| **9. Filter Engine** | Date range picker, category dropdown, delivery status filter, and live text search | ✅ Completed |
| **10. Pipeline Interface** | Dedicated UI for uploading files, triggering ETL steps, seeding demo datasets, and inspecting live database stats | ✅ Completed |
| **11. External API Showcase** | Real-time currency conversions + REST Countries API integration (from specification sheet) | ✅ Completed |

---

## 📂 Repository Structure

```
kd/
├── backend/                  # Node.js + Express API & Ingestion Engine
│   ├── data/                 # Raw data files and analytics.db (SQLite)
│   ├── src/
│   │   ├── controllers/      # Route controllers (analytics, ingest)
│   │   ├── db/               # SQLite database setup and migrations
│   │   ├── middleware/       # Upload and error middlewares
│   │   ├── routes/           # REST API endpoints
│   │   ├── services/         # Parsing, transformation, currency & storage services
│   │   └── app.js            # Express application bootstrap
│   ├── test-e2e.js           # Automated end-to-end API test suite
│   ├── README.md             # Detailed backend API documentation
│   └── package.json
│
├── frontend/                 # React 19 + Vite Analytics Web App
│   ├── src/
│   │   ├── components/       # Dashboard, Charts, Orders, Products, Pipeline, Settings
│   │   ├── services/         # API integration layer with live/mock toggle
│   │   ├── App.jsx           # Root layout and routing
│   │   └── index.css         # TailwindCSS styling
│   ├── README.md             # Detailed frontend documentation
│   └── package.json
│
├── essential/                # Exercise specifications and baseline datasets
│   ├── Excercise.docx        # Exercise requirements document
│   ├── Hit External API.xlsx # External API specification sheet
│   ├── Orders.json           # Raw Orders input
│   ├── Products.csv          # Raw Products input
│   └── Shipment.xml          # Raw Shipments input
│
└── README.md                 # Master project documentation
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js** (v18.x or later)
- **npm** (v9.x or later)

---

### Step 1: Start the Backend API

```bash
cd backend
npm install
npm run dev
```

Server runs on: **http://localhost:5000**  
Health Check: **http://localhost:5000/api/health**

---

### Step 2: Start the Frontend Dashboard

Open a second terminal window:

```bash
cd frontend
npm install
npm run dev
```

Dashboard runs on: **http://localhost:5173**

---

### Step 3: Run Automated Verification Tests

To verify all backend endpoints, data transformations, SQLite tables, and external APIs:

```bash
cd backend
node test-e2e.js
```

---

## 🖥️ Dashboard Views

1. **Dashboard Overview**: KPI cards for Total Orders, Revenue, Delayed Orders, and Average Order Value with interactive Area and Bar charts.
2. **Orders**: Full order management with real-time text search, category filters, status pills, and detail slide-out drawer.
3. **Products**: Catalog overview with category-based metrics and item counts.
4. **Analytics**: Deep-dive analytics with trend charts and growth metrics.
5. **Delivery**: Logistics tracking with status distribution and delayed order breakdowns.
6. **Data Pipeline**: Drag-and-drop file uploader for JSON/CSV/XML, live pipeline execution logs, database counter metrics, and 1-click demo data seeder.
7. **Settings**: Connection health test to the live backend, instant toggle between Live SQLite and Mock data, and appearance preferences.

---

## 📄 License & Author

**Author**: Anuj Shahdeo  
**GitHub**: [@AnujShahdeo2204](https://github.com/AnujShahdeo2204)  
**License**: MIT
