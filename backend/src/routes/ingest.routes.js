const express = require('express');
const router = express.Router();
const ingestController = require('../controllers/ingest.controller');

router.post('/json', ingestController.ingestJson);
router.post('/csv', ingestController.ingestCsv);
router.post('/xml', ingestController.ingestXml);

module.exports = router;
