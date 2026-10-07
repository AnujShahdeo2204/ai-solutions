const fs = require('fs');

let raw = fs.readFileSync('D:/backend/data/Orders.json', 'utf8').replace(/^\uFEFF/, '');
let lines = raw.split(/\r?\n/);
let fixed = lines.map(l => {
    let t = l.trim();
    if(t.startsWith('"') && (t.endsWith('"') || t.endsWith('",'))) {
        let hasComma = t.endsWith('",');
        let inner = t.substring(1, t.length - (hasComma ? 2 : 1));
        inner = inner.replace(/""/g, '"');
        let prefix = l.substring(0, l.indexOf('"')); // preserve leading spaces
        return prefix + inner + (hasComma ? ',' : '');
    }
    return l;
}).join('\n');

console.log(fixed);
console.log('---');
try {
    const data = JSON.parse(fixed);
    console.log('PARSED OK', data.orders.length, 'orders found');
} catch (e) {
    console.error('PARSE ERROR', e);
}
