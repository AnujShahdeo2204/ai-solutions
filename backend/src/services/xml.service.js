const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');

class XmlService {
  parseShipments(filePath) {
    const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');

    const parser = new XMLParser({
      ignoreAttributes: false,
      parseTagValue: true
    });

    const parsed = parser.parse(raw);

    if (!parsed || !parsed.shipments || !parsed.shipments.shipment) {
      throw new Error('Invalid XML structure: Missing <shipments> or <shipment> tags.');
    }

    let shipments = parsed.shipments.shipment;
    
    // Normalize to array if there's only one shipment
    if (!Array.isArray(shipments)) {
      shipments = [shipments];
    }

    return shipments;
  }
}

module.exports = new XmlService();
