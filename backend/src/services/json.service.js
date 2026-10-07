const fs = require('fs');

class JsonService {
  parseOrders(filePath) {
    const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''); // Remove BOM

    // Fix malformed quoting
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

    const data = JSON.parse(fixedContent);

    // Validate structure
    if (!data.orders || !Array.isArray(data.orders)) {
      throw new Error('Invalid JSON structure: "orders" array missing.');
    }

    return data.orders;
  }
}

module.exports = new JsonService();
