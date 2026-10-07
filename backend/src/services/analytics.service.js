const { db } = require('../db/database');

class AnalyticsService {
  getSummary() {
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    
    const totalRevenue = db.prepare('SELECT SUM(total_order_value) as total FROM orders').get().total || 0;
    
    const delayedOrders = db.prepare('SELECT COUNT(*) as count FROM shipments WHERE delivery_delay = 1').get().count;
    
    const categoryRevenue = db.prepare(`
      SELECT p.category, SUM(oi.item_value) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      GROUP BY p.category
    `).all();

    const revenueTrend = db.prepare(`
      SELECT order_date, SUM(total_order_value) as revenue
      FROM orders
      GROUP BY order_date
      ORDER BY order_date ASC
    `).all();

    const deliveryPerformance = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM shipments
      GROUP BY status
    `).all();

    return {
      total_orders: totalOrders,
      total_revenue: totalRevenue,
      delayed_orders: delayedOrders,
      category_revenue: categoryRevenue,
      revenue_trend: revenueTrend,
      delivery_performance: deliveryPerformance
    };
  }
}

module.exports = new AnalyticsService();
