const { db, initDB } = require('./src/db/database');
const storageService = require('./src/services/storage.service');

try {
  // Initialize DB schema
  initDB();
  
  // Run storage service
  storageService.saveNormalizedData();
  
  // Verify counts
  const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  const itemCount = db.prepare('SELECT COUNT(*) as count FROM order_items').get().count;
  const shipmentCount = db.prepare('SELECT COUNT(*) as count FROM shipments').get().count;
  const customerCount = db.prepare('SELECT COUNT(*) as count FROM customers').get().count;
  
  console.log(`Customers stored: ${customerCount}`);
  console.log(`Orders stored: ${orderCount} (Expected: 2)`);
  console.log(`Products stored: ${productCount} (Expected: 3)`);
  console.log(`Order Items stored: ${itemCount} (Expected: 3)`);
  console.log(`Shipments stored: ${shipmentCount} (Expected: 2)`);
  
} catch (e) {
  console.error('Database Error:', e);
}
