const analyticsService = require('../services/analytics.service');

class AnalyticsController {
  async getSummary(req, res, next) {
    try {
      const summary = analyticsService.getSummary();
      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalyticsController();
