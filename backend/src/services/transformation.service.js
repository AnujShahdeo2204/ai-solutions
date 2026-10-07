const path = require('path');
const jsonService = require('./json.service');
const csvService = require('./csv.service');
const xmlService = require('./xml.service');
const currencyService = require('./currency.service');

const dataDir = path.join(__dirname, '../../data');

class TransformationService {
  async processData() {
    // 1. Ingest all raw data
    const rawOrders = jsonService.parseOrders(path.join(dataDir, 'Orders.json'));
    const rawProducts = csvService.parseProducts(path.join(dataDir, 'Products.csv'));
    const rawShipments = xmlService.parseShipments(path.join(dataDir, 'Shipment.xml'));

    // Clear currency cache for current run and fetch new rate
    currencyService.clearCache();
    const exchangeRate = await currencyService.getExchangeRate('EUR');

    // 2. Index Products by ProductID for O(1) lookup
    const productsMap = {};
    for (const p of rawProducts) {
      if (p.ProductID) {
        productsMap[p.ProductID] = {
          ProductName: p.ProductName || 'Unknown',
          Category: p.Category || 'Unknown'
        };
      }
    }

    // 3. Index Shipments by order_id for O(1) lookup
    const shipmentsMap = {};
    for (const s of rawShipments) {
      if (s.order_id) {
        shipmentsMap[String(s.order_id)] = {
          shipment_id: s.shipment_id || null,
          delivery_days: !isNaN(Number(s.delivery_days)) ? Number(s.delivery_days) : null,
          status: s.status ? s.status.trim() : 'Unknown',
          delivery_delay: s.status ? s.status.trim().toLowerCase() === 'delayed' : false
        };
      }
    }

    // 4. Precalculate total_order_value for each order
    const orderTotals = {};
    for (const order of rawOrders) {
      let total = 0;
      if (order.items && Array.isArray(order.items)) {
        for (const item of order.items) {
          const qty = Number(item.qty) || 0;
          const price = Number(item.price) || 0;
          total += qty * price;
        }
      }
      if (order.order_id) {
        orderTotals[String(order.order_id)] = {
          total_order_value: total,
          total_order_value_converted: total * exchangeRate
        };
      }
    }

    // 5. Flatten and Transform
    const normalizedData = [];

    for (const order of rawOrders) {
      const orderId = order.order_id ? String(order.order_id) : 'UNKNOWN';
      const customerId = order.customer?.id || 'UNKNOWN';
      const customerName = order.customer?.name || 'UNKNOWN';
      
      let orderDate = null;
      if (order.order_date) {
        try {
          orderDate = new Date(order.order_date).toISOString().split('T')[0];
        } catch(e) {
          orderDate = String(order.order_date);
        }
      }

      const shipment = shipmentsMap[orderId] || {
        shipment_id: null,
        delivery_days: null,
        status: 'Unknown',
        delivery_delay: false
      };

      const orderTotalInfo = orderTotals[orderId] || { total_order_value: 0, total_order_value_converted: 0 };

      if (order.items && Array.isArray(order.items)) {
        for (const item of order.items) {
          const productId = item.product_id || 'UNKNOWN';
          const qty = Number(item.qty) || 0;
          const price = Number(item.price) || 0;
          const itemValue = qty * price;
          
          const productInfo = productsMap[productId] || { 
            ProductName: 'Unknown', 
            Category: 'Unknown' 
          };

          normalizedData.push({
            order_id: orderId,
            customer_id: customerId,
            customer_name: customerName,
            order_date: orderDate,
            
            product_id: productId,
            product_name: productInfo.ProductName,
            category: productInfo.Category,
            
            qty: qty,
            price: price,
            price_converted: price * exchangeRate,
            item_value: itemValue,
            item_value_converted: itemValue * exchangeRate,
            total_order_value: orderTotalInfo.total_order_value,
            total_order_value_converted: orderTotalInfo.total_order_value_converted,
            
            shipment_id: shipment.shipment_id,
            delivery_days: shipment.delivery_days,
            shipment_status: shipment.status,
            delivery_delay: shipment.delivery_delay
          });
        }
      }
    }

    return normalizedData;
  }
}

module.exports = new TransformationService();
