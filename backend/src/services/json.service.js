const fs = require('fs');
const { isSafeFilePath } = require('../utils/security.util');

class JsonService {
  /**
   * Parse orders from safe file path, raw string, buffer, or object
   * @param {string|Buffer|object} input 
   * @returns {Array} List of orders
   */
  parseOrders(input) {
    let raw;

    if (typeof input === 'object' && input !== null && !(input instanceof Buffer)) {
      if (Array.isArray(input)) return input;
      if (Array.isArray(input.orders)) return input.orders;
      throw new Error('Invalid JSON structure: Expected orders array');
    }

    if (input instanceof Buffer) {
      raw = input.toString('utf8');
    } else if (typeof input === 'string') {
      // Safely check if it is an allowed internal file path
      if (isSafeFilePath(input)) {
        raw = fs.readFileSync(input, 'utf8');
      } else {
        raw = input;
      }
    } else {
      throw new Error('Unsupported input type for JSON parser');
    }

    // Strip BOM
    raw = raw.replace(/^\uFEFF/, '').trim();

    // Check if standard JSON.parse works directly
    try {
      const direct = JSON.parse(raw);
      if (Array.isArray(direct)) return direct;
      if (direct && Array.isArray(direct.orders)) return direct.orders;
    } catch (e) {
      // Continue to cleanup malformed quoting
    }

    // Fix malformed quoting (e.g. from Excel exports with ""field"" or outer quotes)
    const lines = raw.split(/\r?\n/);
    const fixedContent = lines.map(l => {
      const t = l.trim();
      if (t.startsWith('"') && (t.endsWith('"') || t.endsWith('",'))) {
        const hasComma = t.endsWith('",');
        let inner = t.substring(1, t.length - (hasComma ? 2 : 1));
        inner = inner.replace(/""/g, '"');
        const prefix = l.substring(0, l.indexOf('"'));
        return prefix + inner + (hasComma ? ',' : '');
      }
      return l;
    }).join('\n');

    let data;
    try {
      data = JSON.parse(fixedContent);
    } catch (err) {
      throw new Error(`Failed to parse Orders JSON: ${err.message}`);
    }

    if (Array.isArray(data)) {
      return data;
    }

    if (!data.orders || !Array.isArray(data.orders)) {
      throw new Error('Invalid JSON structure: "orders" array missing.');
    }

    return data.orders;
  }
}

module.exports = new JsonService();
