import timeout from './timeout';
import log from '../config/logger';
import Currency from '../models/Currency';
import getCurrencyRates from './getCurrencyRates';

// ~2.16 minutes between refreshes (kept from the original implementation).
const REFRESH_INTERVAL_MS = 1296000 / 10;

const saveCurrency = async (currency: string, rate: number) => {
  const existingCurrency = await Currency.findOne({ name: currency });

  if (existingCurrency) {
    existingCurrency.rate = rate;

    await existingCurrency.save();

    return;
  }

  const newCurrency = new Currency({
    name: currency,
    rate,
  });

  await newCurrency.save();
};

const refreshCurrencies = async () => {
  const rates = await getCurrencyRates();

  for (const [currency, rate] of Object.entries(rates)) {
    await saveCurrency(currency, rate);
  }
};

const saveCurrencies = async () => {
  // Run indefinitely, surviving transient provider/database failures so the
  // refresh loop never dies permanently (the previous recursive version stopped
  // forever on the first error).
  for (;;) {
    try {
      await refreshCurrencies();
    } catch (e) {
      log.error(`CURRENCY: Failed to refresh rates - ${e}`);
    }

    await timeout(REFRESH_INTERVAL_MS);
  }
};

export default saveCurrencies;
