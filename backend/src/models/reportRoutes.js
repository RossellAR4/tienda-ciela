// reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/ReportController');

router.get('/sales', reportController.getSalesReport);
router.get('/inventory', reportController.getInventoryReport);

module.exports = router;
