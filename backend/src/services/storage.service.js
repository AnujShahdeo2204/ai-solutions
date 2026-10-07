const { db } = require('../db/database');
const transformationService = require('./transformation.service');

class StorageService {
  async saveNormalizedData() {
    const normalizedData = await transformationService.processData();
    
    const insertCustomer = db.prepare(`INSERT OR IGNORE INTO customers (id, name) VALUES (?, ?)`);
    const insertProduct = db.prepare(`INSERT OR IGNORE INTO products (product_id, name, category) VALUES (?, ?, ?)`);
    const insertOrder = db.prepare(`INSERT OR REPLACE INTO orders (order_id, customer_id, order_date, total_order_value, total_order_value_converted) VALUES (?, ?, ?, ?, ?)`);
    const insertShipment = db.prepare(`INSERT OR REPLACE INTO shipments (shipment_id, order_id, delivery_days, status, delivery_delay) VALUES (?, ?, ?, ?, ?)`);
    const deleteOrderItems = db.prepare(`DELETE FROM order_items WHERE order_id = ?`);
    const insertOrderItem = db.prepare(`INSERT INTO order_items (order_id, product_id, qty, price, price_converted, item_value, item_value_converted) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    
    const transaction = db.transaction((data) => {
      const processedOrders = new Set();
      
      for (const row of data) {
        if (row.customer_id !== 'UNKNOWN') {
          insertCustomer.run(row.customer_id, row.customer_name);
        }
        
        if (row.product_id !== 'UNKNOWN') {
          insertProduct.run(row.product_id, row.product_name, row.category);
        }
        
        if (!processedOrders.has(row.order_id)) {
          insertOrder.run(row.order_id, row.customer_id !== 'UNKNOWN' ? row.customer_id : null, row.order_date, row.total_order_value, row.total_order_value_converted);
          
          if (row.shipment_id) {
            insertShipment.run(row.shipment_id, row.order_id, row.delivery_days, row.shipment_status, row.delivery_delay ? 1 : 0);
          }
          
          deleteOrderItems.run(row.order_id); 
          processedOrders.add(row.order_id);
        }
        
        insertOrderItem.run(row.order_id, row.product_id !== 'UNKNOWN' ? row.product_id : null, row.qty, row.price, row.price_converted, row.item_value, row.item_value_converted);
      }
    });

    transaction(normalizedData);
    
    return normalizedData;
  }
}

module.exports = new StorageService();
