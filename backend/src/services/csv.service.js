const fs = require('fs');
const { parse } = require('csv-parse/sync');

class CsvService {
  parseProducts(filePath) {
    const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');

    // Fix outer quoting on every line
    const fixedCsv = raw.split(/\r?\n/).map(l => {
      const t = l.trim();
      if (t.startsWith('"') && t.endsWith('"')) {
        return t.substring(1, t.length - 1);
      }
      return l;
    }).join('\n');

    const records = parse(fixedCsv, {
      columns: true,
      skip_empty_lines: true
    });

    if (records.length === 0) {
        throw new Error('CSV is empty or could not be parsed.');
    }
    
    // Validate that required columns exist
    const firstRow = records[0];
    if (!('ProductID' in firstRow) || !('ProductName' in firstRow)) {
        throw new Error('Invalid CSV structure: Missing required columns (ProductID, ProductName).');
    }

    return records;
  }
}

module.exports = new CsvService();
