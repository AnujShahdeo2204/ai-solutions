const path = require('path');
const jsonService = require('../services/json.service');
const csvService = require('../services/csv.service');
const xmlService = require('../services/xml.service');
const storageService = require('../services/storage.service');

const dataDir = path.join(__dirname, '../../data');

class IngestController {
  
  async ingestJson(req, res, next) {
    try {
      const filePath = path.join(dataDir, 'Orders.json');
      const orders = jsonService.parseOrders(filePath);
      await storageService.saveNormalizedData();
      
      res.json({
        success: true,
        message: 'JSON parsed and full pipeline executed successfully',
        count: orders.length,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }

  async ingestCsv(req, res, next) {
    try {
      const filePath = path.join(dataDir, 'Products.csv');
      const products = csvService.parseProducts(filePath);
      await storageService.saveNormalizedData();
      
      res.json({
        success: true,
        message: 'CSV parsed and full pipeline executed successfully',
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  async ingestXml(req, res, next) {
    try {
      const filePath = path.join(dataDir, 'Shipment.xml');
      const shipments = xmlService.parseShipments(filePath);
      await storageService.saveNormalizedData();
      
      res.json({
        success: true,
        message: 'XML parsed and full pipeline executed successfully',
        count: shipments.length,
        data: shipments
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new IngestController();
