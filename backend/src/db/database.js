const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/analytics.db');
const db = new Database(dbPath);

function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      product_id TEXT PRIMARY KEY,
      name TEXT,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      order_id TEXT PRIMARY KEY,
      customer_id TEXT,
      order_date TEXT,
      total_order_value REAL,
      total_order_value_converted REAL,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );

    CREATE TABLE IF NOT EXISTS shipments (
      shipment_id TEXT PRIMARY KEY,
      order_id TEXT,
      delivery_days INTEGER,
      status TEXT,
      delivery_delay BOOLEAN,
      FOREIGN KEY (order_id) REFERENCES orders(order_id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT,
      product_id TEXT,
      qty INTEGER,
      price REAL,
      price_converted REAL,
      item_value REAL,
      item_value_converted REAL,
      FOREIGN KEY (order_id) REFERENCES orders(order_id),
      FOREIGN KEY (product_id) REFERENCES products(product_id)
    );
  `);
}

module.exports = { db, initDB };
