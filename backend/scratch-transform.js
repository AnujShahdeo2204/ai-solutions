const transformationService = require('./src/services/transformation.service');

try {
    const result = transformationService.processData();
    console.log(JSON.stringify(result, null, 2));
} catch (e) {
    console.error('Error during transformation:', e);
}
