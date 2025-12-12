// ReportController.js
const reportService = require('../services/ReportService');

class ReportController {
  async getSalesReport(req, res) {
    try {
      const { startDate = '2025-01-01', endDate = '2025-12-31' } = req.query;
      const report = await reportService.generateSalesReport(startDate, endDate);
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getInventoryReport(req, res) {
    try {
      const report = await reportService.generateInventoryReport();
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ReportController();
