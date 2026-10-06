# 📊 Order Analytics Dashboard

A modern, feature-rich **React analytics dashboard** for monitoring e-commerce order data, revenue trends, product performance, and delivery logistics — built with **React 19**, **Vite**, **Recharts**, and **TailwindCSS**.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-3.10-FF6384?logo=chart.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 📈 Dashboard
- **KPI Summary Cards** — Total Revenue, Total Orders, Average Order Value, Delivery Rate
- **Revenue Trend Chart** — Area chart showing daily/weekly revenue over time
- **Orders Trend Chart** — Line chart tracking order volume
- **Category Distribution** — Bar chart comparing revenue across product categories
- **Delivery Status Donut** — Pie chart showing Delivered, In Transit, Pending & Cancelled breakdown

### 📋 Orders Management
- Full **orders table** with sorting, searching, and status filters
- Order status badges (Delivered, Processing, Shipped, Cancelled)
- Date range and category filtering
- Paginated results with row highlighting

### 📦 Products Catalog
- Product grid with category-based cards
- Search functionality across product names
- Category breakdown with item counts
- Stock status and pricing display

### 📊 Analytics Deep Dive
- KPI summary with growth indicators
- Revenue trend with multi-metric overlay
- Orders volume analysis
- Category performance bar chart with data table
- Fully responsive layout

### 🚚 Delivery Tracking
- Delivery KPI cards (Delivered, In Transit, Pending, Cancelled)
- Donut chart for delivery status distribution
- Filtered delivery orders table
- Status-based color coding

### ⚙️ Settings
- API endpoint configuration
- Notification preferences
- Appearance/theme toggle (Dark mode ready)
- Profile management section

### 🔔 Header Controls
- **Notifications Dropdown** — Live notification feed with unread badges, mark-all-read, clear, and navigation to related pages
- **Account Menu** — Profile card, session info, account settings, notification sound toggle, sign-out
- **Profile Modal** — Full user profile view with department, location, role, access level, and permissions

---

## 🏗️ Tech Stack

| Layer         | Technology                                           |
| ------------- | ---------------------------------------------------- |
| **Framework** | [React 19](https://react.dev/)                       |
| **Bundler**   | [Vite 8](https://vitejs.dev/)                        |
| **Styling**   | [Tailwind CSS 3.4](https://tailwindcss.com/)         |
| **Charts**    | [Recharts 3.10](https://recharts.org/)               |
| **Icons**     | [Lucide React](https://lucide.dev/)                  |
| **Dates**     | [date-fns](https://date-fns.org/)                    |
| **Linting**   | [Oxlint](https://oxc-project.github.io/docs/guide/usage/linter.html) |

---

## 📁 Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images and media
│   ├── components/
│   │   ├── AnalyticsPage.jsx    # Analytics deep-dive page
│   │   ├── Charts.jsx           # Reusable chart components (Revenue, Orders, Category, Delivery)
│   │   ├── Dashboard.jsx        # Main dashboard view
│   │   ├── DeliveryPage.jsx     # Delivery tracking page
│   │   ├── Drawers.jsx          # Slide-out drawer panels
│   │   ├── FilterBar.jsx        # Date range & category filters
│   │   ├── Header.jsx           # Top header with notifications & account menu
│   │   ├── KpiCards.jsx         # KPI summary card components
│   │   ├── OrdersPage.jsx       # Orders management page
│   │   ├── OrdersTable.jsx      # Orders data table
│   │   ├── ProductsPage.jsx     # Products catalog page
│   │   ├── SettingsPage.jsx     # Settings & preferences page
│   │   └── Sidebar.jsx          # Navigation sidebar
│   ├── services/
│   │   ├── api.js               # API service layer (fetch wrapper + mock switch)
│   │   └── mockApi.js           # Mock data generator for development
│   ├── App.jsx                  # Root app with routing & layout
│   ├── App.css                  # Global component styles
│   ├── index.css                # Tailwind directives
│   └── main.jsx                 # React DOM entry point
├── .env                         # Environment variables
├── .env.example                 # Env template
├── tailwind.config.js           # Tailwind configuration & custom theme
├── postcss.config.js            # PostCSS config
├── vite.config.js               # Vite configuration
└── package.json                 # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/AnujShahdeo2204/ai-solutions.git
cd ai-solutions/frontend

# Install dependencies
npm install
```

### Environment Setup

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` to configure:

```env
# Backend API URL (when backend is ready)
VITE_API_URL=http://localhost:5000/api

# Set to "true" to use built-in mock data (no backend needed)
VITE_USE_MOCK_API=true
```

### Run Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview   # Preview the production build
```

### Lint

```bash
npm run lint
```

---

## 🔌 API Integration

The dashboard is designed to consume REST APIs from a backend service. The API service layer (`src/services/api.js`) supports two modes:

### Mock Mode (Default)
Set `VITE_USE_MOCK_API=true` in `.env` — the app uses built-in mock data so you can develop and demo without a backend.

### Live Mode
Set `VITE_USE_MOCK_API=false` and configure `VITE_API_URL` to point to your backend. The frontend expects these endpoints:

| Method | Endpoint                     | Description                          |
| ------ | ---------------------------- | ------------------------------------ |
| GET    | `/api/analytics/summary`     | KPI summary (revenue, orders, AOV)   |
| GET    | `/api/analytics/revenue`     | Revenue trend data (time series)     |
| GET    | `/api/analytics/categories`  | Category-wise breakdown              |
| GET    | `/api/analytics/delivery`    | Delivery status distribution         |
| GET    | `/api/analytics/orders`      | Orders list with filters             |
| GET    | `/api/analytics/products`    | Products catalog data                |

**Supported Query Parameters:** `startDate`, `endDate`, `category`, `deliveryStatus`

---

## 🎨 Design System

The project uses a custom Tailwind theme with semantic color tokens:

| Token         | Value     | Usage                      |
| ------------- | --------- | -------------------------- |
| `background`  | `#f8fafc` | Page background            |
| `surface`     | `#ffffff` | Cards, panels              |
| `primary`     | `#0f172a` | Headings, primary text     |
| `secondary`   | `#64748b` | Muted text, labels         |
| `accent`      | `#3b82f6` | Links, active states, CTAs |
| `border`      | `#e2e8f0` | Dividers, card borders     |
| `danger`      | `#ef4444` | Errors, destructive actions|
| `success`     | `#22c55e` | Positive indicators        |
| `warning`     | `#f59e0b` | Caution, alerts            |

**Font:** [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts

---

## 📸 Pages Overview

| Page          | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| **Dashboard** | KPI cards + revenue/orders/category/delivery charts          |
| **Orders**    | Searchable, filterable orders table with status badges       |
| **Products**  | Product catalog with category cards and search               |
| **Analytics** | Advanced metrics with trend analysis and category breakdowns |
| **Delivery**  | Delivery tracking with donut chart and status table          |
| **Settings**  | App preferences, API config, notification & profile settings |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

**Anuj Shahdeo**  
GitHub: [@AnujShahdeo2204](https://github.com/AnujShahdeo2204)

---

> Built with ❤️ using React, Vite, TailwindCSS & Recharts
