class CurrencyService {
  constructor() {
    this.cachedRate = null;
  }

  async getExchangeRate(targetCurrency = 'EUR') {
    if (this.cachedRate !== null) {
      return this.cachedRate;
    }

    try {
      // Using a public API (Frankfurter) which doesn't require an API key
      const response = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${targetCurrency}`);
      if (!response.ok) {
        throw new Error(`API failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      this.cachedRate = data.rates[targetCurrency];
      return this.cachedRate;
    } catch (error) {
      console.error('Currency conversion failed, defaulting to 1.0 multiplier:', error.message);
      // Fallback rate to prevent crashing
      return 1.0;
    }
  }

  clearCache() {
    this.cachedRate = null;
  }
}

module.exports = new CurrencyService();
